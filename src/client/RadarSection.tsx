/**
 * The「模型雷达」settings section: channel switcher, efficiency badges, the
 * tier picker with an IQ trend line, and the per-task pass-composition bars.
 *
 * Data flows through the host half's same-origin /model-radar/api/data route
 * (see docs/adr/0001-host-proxy-fetch.md for why the browser cannot call the
 * benchmark site directly). Every tab activation remounts this component —
 * the settings shell renders one active section at a time — so mounting is
 * the refresh trigger; per-dataset freshness windows live server-side
 * (docs/adr/0002-freshness-window.md). On a failed live refresh the route
 * serves the last persisted snapshot flagged `stale`, which renders as a
 * warning banner above otherwise-normal charts plus a manual retry button.
 * A persistent footer refresh button passes `bypass=1` to skip the windows.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { RadarPayload, RadarView } from '../contract.ts'
import { fmt } from './locales.ts'
import { TierOverview } from './Overview.tsx'
import { TaskBars, TrendTabs } from './charts.tsx'
import { CostScatterCard } from './costScatter.tsx'
import { tierOptionLabel } from './harness.ts'
import { iqBand } from './scoreMetrics.ts'
import { moneyText, minutesText, pctText } from './format.ts'

/** Injected business face: the same-origin data loader. */
export interface RadarInjected {
  loadData: (benchmark: string, signal?: AbortSignal, bypass?: boolean) => Promise<RadarPayload>
}

/** Full section props: injected face + the locale seat (`t`). */
export type RadarSectionProps = InjectFace<RadarInjected> & PropsLocale<'model-radar'>

const LS_BENCH = 'model-radar:benchmark'
const tierStorageKey = (benchmark: string): string => `model-radar:tier:${benchmark}`

const FALLBACK_CHANNELS: RadarView['channels'] = [
  { id: 'deep-swe', title: 'DeepSWE', scoreLabel: 'Pass rate', isDefault: true },
  { id: 'pompeii-adjacency', title: '庞贝壁画', scoreLabel: 'Adjacency F1', isDefault: false },
]

/** Take the provider-qualified id down to its bare model token, case-folded. */
function normalizeModelToken(model: string): string {
  return model.split('/').pop()?.trim().toLowerCase() ?? model.toLowerCase()
}

/**
 * Q5's three-step match of the deployment default model against leaderboard
 * tiers: exact `model@effort`, then any effort of the same model (tiers are
 * IQ-sorted so the first hit is the strongest), then a substring fallback.
 */
export function autoMatchTier(view: RadarView): string | null {
  const selection = view.defaultModel
  if (selection === undefined) return null
  const model = normalizeModelToken(selection.model)
  if (model === '') return null
  const effort = selection.reasoningEffort?.toLowerCase()
  if (effort !== undefined && effort !== '') {
    const exact = view.tiers.find((tier) => tier.model.toLowerCase() === model && tier.effort.toLowerCase() === effort)
    if (exact !== undefined) return exact.key
  }
  const base = view.tiers.find((tier) => tier.model.toLowerCase() === model)
  if (base !== undefined) return base.key
  const fuzzy = view.tiers.find(
    (tier) => tier.model.toLowerCase().includes(model) || model.includes(tier.model.toLowerCase()),
  )
  return fuzzy?.key ?? null
}

/**
 * Render the radar section.
 * @param props - the data loader and `t`.
 * @returns the section element tree.
 */
export function RadarSection({ loadData, t }: RadarSectionProps) {
  const [benchmark, setBenchmark] = useState<string>(() => localStorage.getItem(LS_BENCH) ?? 'deep-swe')
  const [payload, setPayload] = useState<RadarPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const loadSeq = useRef(0)

  const load = useCallback(
    async (target: string, bypass = false) => {
      const seq = ++loadSeq.current
      setLoading(true)
      setError(null)
      try {
        const response = await loadData(target, undefined, bypass)
        if (seq !== loadSeq.current) return
        if (response.ok) {
          setPayload(response)
        } else {
          setPayload(null)
          setError(response.error)
        }
      } catch (cause) {
        if (seq !== loadSeq.current) return
        setPayload(null)
        setError(cause instanceof Error ? cause.message : String(cause))
      } finally {
        if (seq === loadSeq.current) setLoading(false)
      }
    },
    [loadData],
  )

  // Mount = refresh: every tab activation remounts this section.
  useEffect(() => {
    void load(benchmark)
  }, [benchmark, load])

  const view = payload?.data ?? null

  // Selection is remembered per benchmark; switching channels re-reads storage.
  const [selectedKey, setSelectedKey] = useState<string | null>(() => localStorage.getItem(tierStorageKey(benchmark)))
  useEffect(() => {
    setSelectedKey(localStorage.getItem(tierStorageKey(benchmark)))
  }, [benchmark])

  const autoKey = useMemo(() => (view === null ? null : autoMatchTier(view)), [view])
  const tierKey = selectedKey ?? autoKey
  const tier = view?.tiers.find((candidate) => candidate.key === tierKey) ?? null
  const matchHint =
    view !== null && selectedKey === null && autoKey === null && view.defaultModel !== undefined
      ? fmt(t('match.hint'), { model: view.defaultModel.model })
      : null

  const selectTier = (key: string): void => {
    setSelectedKey(key)
    localStorage.setItem(tierStorageKey(benchmark), key)
  }

  const switchBenchmark = (id: string): void => {
    if (id === benchmark) return
    localStorage.setItem(LS_BENCH, id)
    setBenchmark(id)
  }

  const channels = view !== null && view.channels.length > 0 ? view.channels : FALLBACK_CHANNELS
  const taskRows = tierKey !== null ? (view?.taskRates[tierKey] ?? []) : []
  const seriesPoints = tierKey !== null ? (view?.series[tierKey] ?? []) : []

  const badges: Array<{ label: string; value: string; accent?: boolean; band?: string }> = [
    {
      label: t('badge.iq'),
      value: tier !== null ? tier.iq.toFixed(1) : '—',
      accent: true,
      band: tier !== null ? iqBand(tier.iq) : undefined,
    },
    { label: t('badge.price'), value: moneyText(tier?.avgPrice ?? null) },
    { label: t('badge.minutes'), value: minutesText(tier?.avgMinutes ?? null) },
    { label: t('badge.cache'), value: tier?.cacheHit != null ? pctText(tier.cacheHit) : '—' },
    { label: t('badge.runs'), value: tier !== null ? String(tier.runs24h) : '—' },
  ]

  return (
    <section className="dsh_mr_section">
      <div className="dsh_mr_header">
        <div>
          <h2 className="dsh_mr_title">{t('title')}</h2>
          <div className="dsh_mr_subtitle">{t('subtitle')}</div>
        </div>
        <div className="dsh_mr_seg" role="tablist" aria-label={t('channel.label')}>
          {channels.map((channel) => (
            <button
              key={channel.id}
              type="button"
              role="tab"
              aria-selected={channel.id === benchmark}
              className="dsh_mr_segBtn"
              data-active={channel.id === benchmark}
              onClick={() => switchBenchmark(channel.id)}
            >
              {channel.title}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="dsh_mr_banner" data-tone="info" aria-live="polite">
          <span className="dsh_mr_spin" />
          <span className="dsh_mr_bannerText">{t('status.refreshing')}</span>
        </div>
      )}
      {!loading && payload?.stale === true && (
        <div className="dsh_mr_banner" data-tone="warn">
          <span className="dsh_mr_bannerText">
            {fmt(t('status.stale'), {
              time: new Date(payload.fetchedAt ?? payload.data?.fetchedAt ?? Date.now()).toLocaleString(),
              reason: payload.notice ?? '',
            })}
          </span>
          <button type="button" className="dsh_mr_retry" onClick={() => void load(benchmark)}>
            {t('action.retry')}
          </button>
        </div>
      )}
      {!loading && error !== null && (
        <div className="dsh_mr_banner" data-tone="error">
          <span className="dsh_mr_bannerText">{fmt(t('status.failed'), { reason: error })}</span>
          <button type="button" className="dsh_mr_retry" onClick={() => void load(benchmark)}>
            {t('action.retry')}
          </button>
        </div>
      )}

      {view !== null && (
        <>
          <TierOverview view={view} selectedKey={tierKey} onSelect={selectTier} t={t} />

          <div className="dsh_mr_badges">
            {badges.map((badge) => (
              <div className="dsh_mr_badge" key={badge.label}>
                <span className="dsh_mr_badgeVal" data-accent={badge.accent === true} data-band={badge.band}>
                  {badge.value}
                </span>
                <span className="dsh_mr_badgeLabel">{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="dsh_mr_card">
            <div className="dsh_mr_cardHead">
              <span className="dsh_mr_cardTitle">{t('line.title')}</span>
              <select
                className="dsh_mr_select"
                value={tierKey ?? ''}
                onChange={(event) => selectTier(event.target.value)}
                aria-label={t('line.title')}
              >
                {tierKey === null && <option value="">—</option>}
                {view.tiers.map((candidate) => (
                  <option key={candidate.key} value={candidate.key}>
                    {tierOptionLabel(candidate)}
                  </option>
                ))}
              </select>
            </div>
            {matchHint !== null && <div className="dsh_mr_hint">{matchHint}</div>}
            {seriesPoints.length >= 2 ? (
              <TrendTabs points={seriesPoints} t={t} />
            ) : (
              <div className="dsh_mr_empty">{t('empty.noSeries')}</div>
            )}
          </div>

          <div className="dsh_mr_card">
            <span className="dsh_mr_cardTitle">
              {fmt(t('bar.title'), { label: view.scoreLabel || (tier?.passRate != null ? pctText(tier.passRate) : '') })}
            </span>
            {taskRows.length > 0 ? (
              <TaskBars rows={taskRows} benchmark={view.benchmark} scoringMode={view.scoringMode} t={t} />
            ) : (
              <div className="dsh_mr_empty">{t('empty.none')}</div>
            )}
          </div>

          <CostScatterCard view={view} t={t} />

          <div className="dsh_mr_footer">
            <span
              className="dsh_mr_dot"
              data-fresh={payload?.stale === true ? 'false' : 'true'}
              title={payload?.stale === true ? 'stale snapshot' : 'fresh'}
            />
            <span>{fmt(t('updated'), { time: new Date(view.fetchedAt).toLocaleString() })}</span>
            {view.sourceUpdatedAt !== undefined && (
              <span>
                · {t('source.updated')}: {new Date(view.sourceUpdatedAt).toLocaleString()}
              </span>
            )}
            <span className="dsh_mr_footerSpacer" />
            <button
              type="button"
              className="dsh_mr_refresh"
              onClick={() => void load(benchmark, true)}
              disabled={loading}
            >
              {t('action.refresh')}
            </button>
          </div>
        </>
      )}
    </section>
  )
}
