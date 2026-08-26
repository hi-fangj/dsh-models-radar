/**
 * Ambient composer-dock readout for the session's currently selected model:
 * DeepSWE IQ, 24h delta, and a compact 48h sparkline. The official
 * modelDirectories store is the fact source, so switching the composer model
 * updates this component immediately without polling or guessing from history.
 */
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { ModelSelection } from '@deepseek-ai/dsh-api-remotes/client'
import type { RadarPayload, RadarTier, RadarView } from '../contract.ts'
import { iqBand, trendSummary } from './scoreMetrics.ts'

export interface LiveCapabilityInjected {
  modelDirectories: ModelDirectoryResolver
  loadData: (benchmark: string, signal?: AbortSignal) => Promise<RadarPayload>
}

export type LiveCapabilityProps = PropsRuntime<'conversation.composer.dock'> &
  InjectFace<LiveCapabilityInjected> &
  PropsLocale<'model-radar'>

interface TierMatch {
  tier: RadarTier
  approximate: boolean
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
    const timer = window.setInterval(refresh, 60_000)
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
  if (view === null || selection === null || match === null) return null

  const series = view.series[match.tier.key] ?? []
  const trend = trendSummary(series)
  const direction = trend?.direction ?? 'flat'
  const deltaText =
    trend === null
      ? '—'
      : direction === 'flat'
        ? '±0.0'
        : `${trend.delta24h > 0 ? '+' : ''}${trend.delta24h.toFixed(1)}`
  const arrow = direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→'
  const displayedIq = `${match.approximate ? '≈' : ''}${match.tier.iq.toFixed(1)}`

  return (
    <span
      className="dsh_mr_liveReadout"
      data-band={iqBand(match.tier.iq)}
      title={`${selection.model}${selection.reasoningEffort ? ` · ${selection.reasoningEffort}` : ''} · ${match.tier.key}`}
    >
      <span className="dsh_mr_liveLabel">{t('live.label')}</span>
      <strong className="dsh_mr_liveIq">{displayedIq}</strong>
      <span className="dsh_mr_liveDelta" data-dir={direction}>{arrow} {deltaText}</span>
      <MiniTrend points={series} direction={direction} />
    </span>
  )
}
