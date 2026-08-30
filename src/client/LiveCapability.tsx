/**
 * Composer tool-row readout for the session's currently selected model — the
 * conversation.input.right seat, immediately left of the model selector,
 * because the DeepSWE IQ it shows is that model's property. The official
 * modelDirectories store is the fact source, so switching the composer model
 * updates this component immediately without polling or guessing from history.
 *
 * The readout is a compact clickable control: clicking toggles the capability
 * popover, a non-modal anchored panel showing the full tier overview (every
 * base model's best tier, ranked) plus the detail for one viewed tier (badges,
 * IQ trend, per-task pass composition). The viewed tier defaults to the
 * session's matched tier and follows it live; clicking an overview row
 * temporarily views that tier instead, until the session match changes or the
 * popover closes. The popover renders from the readout's already-loaded view —
 * opening costs zero requests — and closes on outside pointerdown, Escape, or
 * when the tier match disappears. The readout can be hidden entirely from the
 * Settings tab (「显示会话能力浮窗」): hidden means no capsule, no popover and
 * no polling.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { RadarPayload, RadarView } from '../contract.ts'
import { SOURCE_SITE_URL } from '../contract.ts'
import { bandColor, iqBand } from './scoreMetrics.ts'
import { matchTier } from './tierMatch.ts'
import { liveVisibleStore } from './liveVisible.ts'
import { TierOverview } from './Overview.tsx'
import { TaskCard, TierBadges, TrendCard } from './TierDetail.tsx'
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

export type LiveCapabilityProps = PropsRuntime<'conversation.input.right'> &
  InjectFace<LiveCapabilityInjected> &
  PropsLocale<'model-radar'>

/** Anchor geometry snapshot in viewport coordinates. */
interface AnchorRect {
  left: number
  top: number
  width: number
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
  /** Settings-tab display preference; false hides the capsule and stops polling. */
  const liveVisible = useSyncExternalStore(liveVisibleStore.subscribe, liveVisibleStore.get)

  useEffect(() => {
    if (directory.store.getSnapshot().current === null) void directory.load().catch(() => undefined)
  }, [directory])

  useEffect(() => {
    // Hidden readout: no polling at all — the settings switch stops all readout
    // traffic. Re-showing restarts the cycle with an immediate refresh.
    if (!liveVisible) return
    let cancelled = false
    const controller = new AbortController()
    const refresh = (): void => {
      void loadData('deep-swe', controller.signal).then(
        (payload) => {
          if (!cancelled && payload.data !== null) setView(payload.data)
        },
        () => {
          // Keep the last successful value: the readout is ambient, not an error surface.
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
  }, [loadData, sessionId, liveVisible])

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

  // Hiding the readout also tears down any open popover state, so re-showing
  // never resurrects a stale anchored panel.
  useEffect(() => {
    if (!liveVisible) close()
  }, [liveVisible, close])

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

  if (!liveVisible || view === null || selection === null || match === null) return null

  const tier = match.tier
  // Detail tier: the temporary overview pick when valid, else the session match.
  const detailTier =
    viewTierKey !== null ? (view.tiers.find((candidate) => candidate.key === viewTierKey) ?? tier) : tier
  const viewingSessionTier = detailTier.key === tier.key
  // The capsule always reflects the session-matched tier: viewing another
  // tier in the popover must not change the readout's IQ.
  const displayedIq = `${match.approximate ? '≈' : ''}${tier.iq.toFixed(1)}`

  const detailSeries = view.series[detailTier.key] ?? []

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
              <TierBadges tier={detailTier} t={t} />
              {/* Same flat tier selector as the settings trend card (model ·
                  harness · effort options, no score). Picking a tier is
                  temporary viewing — identical to clicking an overview row: it
                  resets to following the session match when the match moves or
                  the popover closes. */}
              <TrendCard
                tiers={view.tiers}
                value={detailTier.key}
                onChange={setViewTierKey}
                points={detailSeries}
                t={t}
              />
              <TaskCard view={view} tierKey={detailTier.key} t={t} scroll={false} />
            </div>
            <footer className="dsh_mr_popoverFooter">
              {fmt(t('updated'), { time: new Date(view.fetchedAt).toLocaleString() })}
              <a className="dsh_mr_link" href={SOURCE_SITE_URL} target="_blank" rel="noreferrer noopener">
                {t('action.openSite')} ↗
              </a>
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
        <strong
          className="dsh_mr_liveIq"
          style={{
            color: bandColor(iqBand(tier.iq)),
            background: `color-mix(in srgb, ${bandColor(iqBand(tier.iq))} 12%, transparent)`,
          }}
        >
          {displayedIq}
        </strong>
      </button>
      {popover}
    </>
  )
}
