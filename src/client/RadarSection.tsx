/**
 * The「模型雷达」settings section: channel switcher, efficiency badges, the
 * tier picker with an IQ trend line, and the per-task pass-composition bars.
 * (The live-readout display switch lives in the plugin-configuration card —
 * PrefCard.tsx.)
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
 *
 * The tier selection defaults to the current conversation's model on every
 * entry — the session list's `current` resolved through the official
 * per-session model directory (tier match, CONTEXT.md 档位匹配), with the
 * payload's deployment default only standing in when no session selection is
 * resolvable. A manual pick lasts for the visit, and the overview marks the
 * in-use tier row.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { CommunityRatingsPayload, RadarPayload, RadarView, RatingsWindow } from '../contract.ts'
import { SOURCE_SITE_URL } from '../contract.ts'
import { fmt } from './locales.ts'
import { TierOverview } from './Overview.tsx'
import { CostScatterCard } from './costScatter.tsx'
import { RatingsCard } from './ratingsCard.tsx'
import { matchTier } from './tierMatch.ts'
import { TaskCard, TierBadges, TrendCard } from './TierDetail.tsx'

/** Injected business face: the same-origin data loaders + the per-session model directory. */
export interface RadarInjected {
  loadData: (benchmark: string, signal?: AbortSignal, bypass?: boolean) => Promise<RadarPayload>
  /** The community-ratings loader (global data, one payload per window). */
  loadRatings: (window: RatingsWindow, signal?: AbortSignal, bypass?: boolean) => Promise<CommunityRatingsPayload>
  /** The official per-session model directory — the composer readout's fact source. */
  modelDirectories: ModelDirectoryResolver
}

/**
 * Full section props: the root-scope runtime share (the global `useSessions`
 * seat carries the current conversation) + injected face + the locale seat (`t`).
 */
export type RadarSectionProps =
  PropsRuntime<'settings.section'> & InjectFace<RadarInjected> & PropsLocale<'model-radar'>

const LS_BENCH = 'model-radar:benchmark'
const RATINGS_LS = 'model-radar:ratings-window'

const readRatingsWindow = (): RatingsWindow =>
  typeof localStorage !== 'undefined' && localStorage.getItem(RATINGS_LS) === '24h' ? '24h' : '7d'

const FALLBACK_CHANNELS: RadarView['channels'] = [
  { id: 'deep-swe', title: 'DeepSWE', scoreLabel: 'Pass rate', isDefault: true },
  { id: 'pompeii-adjacency', title: '庞贝壁画', scoreLabel: 'Adjacency F1', isDefault: false },
]

/**
 * Render the radar section.
 * @param props - the root runtime share (`useSessions`), the injected loaders
 *   and model directory, and `t`.
 * @returns the section element tree.
 */
export function RadarSection({ loadData, loadRatings, modelDirectories, useSessions, t }: RadarSectionProps) {
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

  // -------------------------------------------------------------------------
  // The current conversation's model selection (CONTEXT.md 当前模型's default
  // source). The settings panel overlays the chat, so the session list's
  // `current` is the conversation the user is looking at, and its official
  // model directory — the same store the composer readout reads — is the live
  // fact source; an already-loaded directory costs zero requests.
  // -------------------------------------------------------------------------
  const currentSessionId = useSessions((state) => state.current)
  const directory = useMemo(() => {
    if (currentSessionId === undefined) return null
    try {
      return modelDirectories.directoryFor(currentSessionId)
    } catch {
      // A listed session whose client scope is gone has no directory (the
      // resolver fails loud); the deployment default stands in below.
      return null
    }
  }, [modelDirectories, currentSessionId])
  const directoryState = useSyncExternalStore(
    (listener) => directory?.store.subscribe(listener) ?? (() => {}),
    () => directory?.store.getSnapshot() ?? null,
  )
  // One directory load per entry when the shared store has no selection yet —
  // the composer readout's mount behavior; a failure leaves the fallback.
  useEffect(() => {
    if (directory !== null && directory.store.getSnapshot().current === null) {
      void directory.load().catch(() => undefined)
    }
  }, [directory])
  const sessionSelection = directoryState?.current ?? undefined
  // Only an in-flight load withholds the fallback: rendering the deployment
  // default's tier while the session selection is one RPC away would flash
  // the wrong tier. A settled directory (selection present or not, load
  // error, or a route that cannot address model RPCs) resolves immediately.
  const selectionPending = directoryState?.status === 'loading'

  // Selection is per visit: every entry (and channel switch) re-resolves the
  // default from the conversation's model, so a manual pick lasts only until
  // the next entry.
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  useEffect(() => {
    setSelectedKey(null)
  }, [benchmark])

  // 档位匹配（CONTEXT.md）：默认选中 = 当前对话模型；无会话选择可解析时以部署
  // 默认模型兜底；会话选择已存在但未命中时不兜底，只出提示。近似命中不设 ≈ 标识。
  const sessionMatch = useMemo(
    () => (view === null || selectionPending ? null : matchTier(view, sessionSelection)),
    [view, selectionPending, sessionSelection],
  )
  const defaultMatch = useMemo(
    () => (view === null || selectionPending || sessionMatch !== null ? null : matchTier(view, view.defaultModel)),
    [view, selectionPending, sessionMatch],
  )
  const autoKey = sessionMatch?.tier.key ?? defaultMatch?.tier.key ?? null
  const sessionMatchKey = sessionMatch?.tier.key ?? null
  const tierKey = selectedKey ?? autoKey
  const tier = view?.tiers.find((candidate) => candidate.key === tierKey) ?? null
  const autoSelection = selectionPending ? undefined : (sessionSelection ?? view?.defaultModel)
  const matchHint =
    view !== null && selectedKey === null && autoKey === null && autoSelection !== undefined
      ? fmt(t('match.hint'), { model: autoSelection.model })
      : null

  const selectTier = (key: string): void => {
    setSelectedKey(key)
  }

  const switchBenchmark = (id: string): void => {
    if (id === benchmark) return
    localStorage.setItem(LS_BENCH, id)
    setBenchmark(id)
  }

  const channels = view !== null && view.channels.length > 0 ? view.channels : FALLBACK_CHANNELS
  const seriesPoints = tierKey !== null ? (view?.series[tierKey] ?? []) : []

  // -------------------------------------------------------------------------
  // Community ratings (社区体感分): global data, independent of the channel.
  // Each window is its own dataset with its own 15-minute freshness window
  // server-side; the active window loads on mount/switch, the other lazily on
  // first switch. Payloads cache per window so tab switches render instantly.
  // -------------------------------------------------------------------------
  const [ratingsWin, setRatingsWin] = useState<RatingsWindow>(readRatingsWindow)
  const [ratings, setRatings] = useState<Partial<Record<RatingsWindow, CommunityRatingsPayload>>>({})
  const [ratingsErrors, setRatingsErrors] = useState<Partial<Record<RatingsWindow, string>>>({})
  const [ratingsLoading, setRatingsLoading] = useState<Partial<Record<RatingsWindow, boolean>>>({})
  const ratingsSeqs = useRef<Partial<Record<RatingsWindow, number>>>({})

  const loadRatingsFor = useCallback(
    async (win: RatingsWindow, bypass = false) => {
      const seq = (ratingsSeqs.current[win] ?? 0) + 1
      ratingsSeqs.current[win] = seq
      setRatingsLoading((prev) => ({ ...prev, [win]: true }))
      try {
        const response = await loadRatings(win, undefined, bypass)
        if (ratingsSeqs.current[win] !== seq) return
        if (response.ok) {
          setRatings((prev) => ({ ...prev, [win]: response }))
          setRatingsErrors((prev) => ({ ...prev, [win]: undefined }))
        } else {
          setRatingsErrors((prev) => ({ ...prev, [win]: response.error }))
        }
      } catch (cause) {
        if (ratingsSeqs.current[win] !== seq) return
        setRatingsErrors((prev) => ({
          ...prev,
          [win]: cause instanceof Error ? cause.message : String(cause),
        }))
      } finally {
        if (ratingsSeqs.current[win] === seq) setRatingsLoading((prev) => ({ ...prev, [win]: false }))
      }
    },
    [loadRatings],
  )

  // Mount and window switches: fetch the active window (the host serves it
  // from its freshness cache when still current — re-requests cost nothing).
  useEffect(() => {
    void loadRatingsFor(ratingsWin)
  }, [ratingsWin, loadRatingsFor])

  const switchRatingsWindow = (win: RatingsWindow): void => {
    if (win === ratingsWin) return
    try {
      localStorage.setItem(RATINGS_LS, win)
    } catch {
      // Persistence is best-effort; the tab still switches for this visit.
    }
    setRatingsWin(win)
  }

  return (
    <section className="dsh_mr_section">
      <div className="dsh_mr_header">
        <div>
          <h2 className="dsh_mr_title">{t('title')}</h2>
          <div className="dsh_mr_subtitle">
            {t('subtitle.pre')}
            <a className="dsh_mr_link" href={SOURCE_SITE_URL} target="_blank" rel="noreferrer noopener">
              deng.codexradar.com
            </a>
            {t('subtitle.post')}
          </div>
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
          <TierOverview view={view} selectedKey={tierKey} currentKey={sessionMatchKey} onSelect={selectTier} t={t} />

          <TierBadges tier={tier} t={t} />

          <TrendCard
            tiers={view.tiers}
            value={tierKey ?? ''}
            onChange={selectTier}
            hint={matchHint}
            points={seriesPoints}
            t={t}
          />

          <TaskCard view={view} tierKey={tierKey} t={t} />

          <CostScatterCard view={view} t={t} />

          <RatingsCard
            win={ratingsWin}
            onWinChange={switchRatingsWindow}
            payloads={ratings}
            errors={ratingsErrors}
            loading={ratingsLoading}
            onRetry={() => void loadRatingsFor(ratingsWin, true)}
            selectedKey={tierKey}
            t={t}
          />

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
            <a className="dsh_mr_link" href={SOURCE_SITE_URL} target="_blank" rel="noreferrer noopener">
              {t('action.openSite')} ↗
            </a>
            <span className="dsh_mr_footerSpacer" />
            <button
              type="button"
              className="dsh_mr_refresh"
              onClick={() => {
                void load(benchmark, true)
                void loadRatingsFor(ratingsWin, true)
              }}
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
