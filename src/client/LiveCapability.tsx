/**
 * Ambient composer-dock readout for the session's currently selected model:
 * DeepSWE IQ, 24h delta, and a compact 48h sparkline. The official
 * modelDirectories store is the fact source, so switching the composer model
 * updates this component immediately without polling or guessing from history.
 *
 * The readout is a clickable capsule: clicking toggles the capability popover,
 * a non-modal anchored panel showing the full tier overview (every base
 * model's best tier, ranked) plus the detail for one viewed tier (badges, IQ
 * trend, per-task pass composition). The viewed tier defaults to the session's
 * matched tier and follows it live; clicking an overview row temporarily views
 * that tier instead, until the session match changes or the popover closes.
 * The popover renders from the readout's already-loaded view — opening costs
 * zero requests — and closes on outside pointerdown, Escape, or when the tier
 * match disappears.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { ModelSelection } from '@deepseek-ai/dsh-api-remotes/client'
import type { RadarPayload, RadarTier, RadarView } from '../contract.ts'
import { iqBand, trendSummary } from './scoreMetrics.ts'
import { moneyText, minutesText, pctText } from './format.ts'
import { TaskBars, TrendLine } from './charts.tsx'
import { TierOverview } from './Overview.tsx'
import { fmt } from './locales.ts'

/** Dock polling period: matches the host's shortest freshness window (15 min, host-side FRESH_EFFICIENCY_MS). */
const REFRESH_INTERVAL_MS = 15 * 60_000

/** Popover width cap (hosts the tier overview) and the gap kept above the capsule. */
const POPOVER_WIDTH = 460
const POPOVER_GAP = 8
/** Same elevation tier as the shell's menus (Menu.module.css z-index 1100). */
const POPOVER_Z = 1100

export interface LiveCapabilityInjected {
  modelDirectories: ModelDirectoryResolver
  loadData: (benchmark: string, signal?: AbortSignal, bypass?: boolean) => Promise<RadarPayload>
}

export type LiveCapabilityProps = PropsRuntime<'conversation.composer.dock'> &
  InjectFace<LiveCapabilityInjected> &
  PropsLocale<'model-radar'>

interface TierMatch {
  tier: RadarTier
  approximate: boolean
}

/** Anchor geometry snapshot in viewport coordinates. */
interface AnchorRect {
  left: number
  top: number
  width: number
}

function normalizeModel(model: string): string {
  return model.split('/').pop()?.trim().toLowerCase() ?? model.toLowerCase()
}

function matchTier(view: RadarView, selection: ModelSelection): TierMatch | null {
  const model = normalizeModel(selection.model)
  const effort = selection.reasoningEffort?.toLowerCase()
  if (effort !== undefined) {
    const exact = view.tiers.find(
      (tier) => normalizeModel(tier.model) === model && tier.effort.toLowerCase() === effort,
    )
    if (exact !== undefined) return { tier: exact, approximate: false }
  }
  // `view.tiers` is IQ-descending, so the first base-model hit is its best tier.
  const base = view.tiers.find((tier) => normalizeModel(tier.model) === model)
  if (base !== undefined) return { tier: base, approximate: true }
  const fuzzy = view.tiers.find(
    (tier) => normalizeModel(tier.model).includes(model) || model.includes(normalizeModel(tier.model)),
  )
  return fuzzy === undefined ? null : { tier: fuzzy, approximate: true }
}

function MiniTrend({ points, direction }: { points: Array<[string, number]>; direction: 'up' | 'down' | 'flat' }) {
  const recent = points.slice(-49)
  if (recent.length < 2) return null
  const width = 72
  const height = 18
  const pad = 1.5
  const values = recent.map((point) => point[1])
  let min = Math.min(...values)
  let max = Math.max(...values)
  if (min === max) {
    min -= 0.5
    max += 0.5
  }
  const coords = recent.map(([, value], index) => {
    const x = pad + (index / (recent.length - 1)) * (width - pad * 2)
    const y = pad + (1 - (value - min) / (max - min)) * (height - pad * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const color =
    direction === 'up'
      ? 'var(--dsw-alias-state-success-primary)'
      : direction === 'down'
        ? 'var(--dsw-alias-state-error-primary)'
        : 'var(--dsw-alias-brand-primary)'
  const [lastX, lastY] = coords[coords.length - 1].split(',')
  return (
    <svg className="dsh_mr_liveSpark" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="1.8" fill={color} />
    </svg>
  )
}

export function LiveCapability({ useSession, modelDirectories, loadData, t }: LiveCapabilityProps) {
  const sessionId = useSession((session) => session.sessionId)
  const directory = useMemo(() => modelDirectories.directoryFor(sessionId), [modelDirectories, sessionId])
  const directoryState = useSyncExternalStore(
    (listener) => directory.store.subscribe(listener),
    () => directory.store.getSnapshot(),
  )
  const [view, setView] = useState<RadarView | null>(null)
  const [open, setOpen] = useState(false)
  const [anchor, setAnchor] = useState<AnchorRect | null>(null)
  /** Tier key the popover detail shows; null = follow the session match. */
  const [viewTierKey, setViewTierKey] = useState<string | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (directory.store.getSnapshot().current === null) void directory.load().catch(() => undefined)
  }, [directory])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const refresh = (): void => {
      void loadData('deep-swe', controller.signal).then(
        (payload) => {
          if (!cancelled && payload.data !== null) setView(payload.data)
        },
        () => {
          // Keep the last successful value: the dock is ambient, not an error surface.
        },
      )
    }
    refresh()
    // Poll the host's shortest refresh window (15 min): the host serves fresh
    // data from its cache without upstream hits, so each tick costs one local
    // request and an upstream fetch at most once per window per channel.
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      controller.abort()
      window.clearInterval(timer)
    }
  }, [loadData, sessionId])

  const selection = directoryState.current
  const match = useMemo(
    () => (view === null || selection === null ? null : matchTier(view, selection)),
    [selection, view],
  )

  const close = useCallback(() => {
    setOpen(false)
    setAnchor(null)
    setViewTierKey(null)
  }, [])

  const onToggle = (): void => {
    if (open) {
      close()
      return
    }
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect === undefined) return
    setAnchor({ left: rect.left, top: rect.top, width: rect.width })
    setOpen(true)
  }

  // While open: re-anchor on scroll/resize, close on outside pointerdown or Escape.
  useEffect(() => {
    if (!open) return
    const measure = (): void => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (rect === undefined) return
      setAnchor((previous) =>
        previous !== null && previous.left === rect.left && previous.top === rect.top && previous.width === rect.width
          ? previous
          : { left: rect.left, top: rect.top, width: rect.width },
      )
    }
    const onPointerDown = (event: PointerEvent): void => {
      const target = event.target instanceof Node ? event.target : null
      if (target !== null && (popoverRef.current?.contains(target) === true || buttonRef.current?.contains(target) === true)) return
      close()
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('resize', measure)
    document.addEventListener('scroll', measure, true)
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', measure)
      document.removeEventListener('scroll', measure, true)
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  // The popover exists only while the tier match exists: follow the session
  // model live, and close when the model drops off the leaderboard.
  useEffect(() => {
    if (open && match === null) close()
  }, [open, match, close])

  // Follow-first viewing: a temporary overview pick survives until the session
  // match moves (the detail resets to the new matched tier), then it is gone.
  useEffect(() => {
    setViewTierKey(null)
  }, [match?.tier.key])

  if (view === null || selection === null || match === null) return null

  const tier = match.tier
  // Detail tier: the temporary overview pick when valid, else the session match.
  const detailTier =
    viewTierKey !== null ? (view.tiers.find((candidate) => candidate.key === viewTierKey) ?? tier) : tier
  const viewingSessionTier = detailTier.key === tier.key
  const series = view.series[detailTier.key] ?? []
  const taskRows = view.taskRates[detailTier.key] ?? []
  const trend = trendSummary(series)
  const direction = trend?.direction ?? 'flat'
  const deltaText =
    trend === null
      ? '—'
      : direction === 'flat'
        ? '±0.0'
        : `${trend.delta24h > 0 ? '+' : ''}${trend.delta24h.toFixed(1)}`
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'
  const displayedIq = `${match.approximate ? '≈' : ''}${tier.iq.toFixed(1)}`

  const badges: Array<{ label: string; value: string; accent?: boolean; band?: string }> = [
    { label: t('badge.iq'), value: detailTier.iq.toFixed(1), accent: true, band: iqBand(detailTier.iq) },
    { label: t('badge.price'), value: moneyText(detailTier.avgPrice) },
    { label: t('badge.minutes'), value: minutesText(detailTier.avgMinutes) },
    { label: t('badge.cache'), value: detailTier.cacheHit != null ? pctText(detailTier.cacheHit) : '—' },
    { label: t('badge.runs'), value: String(detailTier.runs24h) },
  ]

  const width = Math.min(POPOVER_WIDTH, window.innerWidth - 24)
  const anchorLeft =
    anchor === null
      ? 12
      : Math.max(12, Math.min(anchor.left + anchor.width / 2 - width / 2, window.innerWidth - width - 12))
  const popoverBottom = anchor === null ? 0 : window.innerHeight - anchor.top + POPOVER_GAP

  const popover =
    open && anchor !== null
      ? createPortal(
          <section
            ref={popoverRef}
            className="dsh_mr_popover"
            role="region"
            aria-label={t('popover.title')}
            style={{ left: anchorLeft, bottom: popoverBottom, width, zIndex: POPOVER_Z }}
          >
            <header className="dsh_mr_popoverHead">
              <strong className="dsh_mr_popoverTier">
                {viewingSessionTier && match.approximate ? '≈ ' : ''}
                {detailTier.model} · {detailTier.effort}
              </strong>
              <span className="dsh_mr_popoverChannel">{view.scoreLabel}</span>
            </header>
            <div className="dsh_mr_popoverBody">
              <TierOverview
                view={view}
                selectedKey={detailTier.key}
                currentKey={tier.key}
                onSelect={setViewTierKey}
                t={t}
                scroll={false}
              />
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
                <span className="dsh_mr_cardTitle">{t('line.title')}</span>
                {series.length >= 2 ? (
                  <TrendLine points={series} t={t} />
                ) : (
                  <div className="dsh_mr_empty">{t('empty.noSeries')}</div>
                )}
              </div>
              <div className="dsh_mr_card">
                <span className="dsh_mr_cardTitle">
                  {fmt(t('bar.title'), { label: view.scoreLabel })}
                </span>
                {taskRows.length > 0 ? (
                  <TaskBars rows={taskRows} benchmark={view.benchmark} scoringMode={view.scoringMode} t={t} scroll={false} />
                ) : (
                  <div className="dsh_mr_empty">{t('empty.none')}</div>
                )}
              </div>
            </div>
            <footer className="dsh_mr_popoverFooter">
              {fmt(t('updated'), { time: new Date(view.fetchedAt).toLocaleString() })}
            </footer>
          </section>,
          document.body,
        )
      : null

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="dsh_mr_liveReadout"
        data-band={iqBand(tier.iq)}
        data-open={open}
        aria-expanded={open}
        onClick={onToggle}
        title={`${selection.model}${selection.reasoningEffort ? ` · ${selection.reasoningEffort}` : ''} · ${tier.key}`}
      >
        <span className="dsh_mr_liveLabel">{t('live.label')}</span>
        <strong className="dsh_mr_liveIq">{displayedIq}</strong>
        <span className="dsh_mr_liveDelta" data-dir={direction}>{arrow} {deltaText}</span>
        <MiniTrend points={series} direction={direction} />
      </button>
      {popover}
    </>
  )
}
