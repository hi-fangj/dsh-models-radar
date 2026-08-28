/** Shared score semantics for overview bars, badges, and trend summaries. */

export type IqBand = 'low' | 'general' | 'steady' | 'excellent' | 'leading'
export type TrendDirection = 'up' | 'down' | 'flat'

/**
 * The steady band's color: the true brand blue. The neutral
 * `--dsw-alias-brand-primary` alias maps to the bluish grey scale
 * (near-black in light, near-white in dark), which reads grey — band
 * semantics must use the real brand blue instead.
 */
export const STEADY_COLOR = 'var(--dsw-alias-brand-primary-new-colorprimary-new-color)'

/** The band color used by trend strokes, fills, endpoints, and hover markers. */
export function bandColor(band: IqBand): string {
  switch (band) {
    case 'low': return 'var(--dsw-alias-state-error-primary)'
    case 'general': return 'var(--dsw-alias-state-warn-primary)'
    case 'steady': return STEADY_COLOR
    case 'excellent':
    case 'leading': return 'var(--dsw-alias-state-success-primary)'
  }
}

/** Fixed cross-channel IQ bands recorded in CONTEXT.md. */
export function iqBand(iq: number): IqBand {
  if (iq >= 100) return 'leading'
  if (iq >= 95) return 'excellent'
  if (iq >= 85) return 'steady'
  if (iq >= 70) return 'general'
  return 'low'
}

/** Fixed absolute visual scale: 0 IQ = empty, 110 IQ = full. */
export function iqProgress(iq: number): number {
  return Math.max(0, Math.min(1, iq / 110))
}

export interface TrendSummary {
  delta24h: number
  direction: TrendDirection
  min: number
  average: number
  max: number
}

/** Shared ±0.25 IQ dead-zone: measurement noise must not read as direction. */
function directionOf(delta: number): TrendDirection {
  return delta > 0.25 ? 'up' : delta < -0.25 ? 'down' : 'flat'
}

/**
 * Compute 7-day range/average and the latest value minus the closest reading
 * at least 24h older (falling back to the series head). A ±0.25 IQ dead-zone
 * prevents measurement noise from being presented as a real direction.
 */
export function trendSummary(points: Array<[string, number]>): TrendSummary | null {
  if (points.length === 0) return null
  const values = points.map((point) => point[1]).filter(Number.isFinite)
  if (values.length === 0) return null
  const last = points[points.length - 1]
  const lastTs = new Date(last[0]).getTime()
  let reference = points[0]
  if (!Number.isNaN(lastTs)) {
    for (const point of points) {
      const ts = new Date(point[0]).getTime()
      if (!Number.isNaN(ts) && ts <= lastTs - 24 * 3_600_000) reference = point
      else if (!Number.isNaN(ts)) break
    }
  }
  const delta24h = last[1] - reference[1]
  return {
    delta24h,
    direction: directionOf(delta24h),
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values),
  }
}

export interface WindowSummary {
  change: number
  direction: TrendDirection
  min: number
  average: number
  max: number
}

/**
 * Per-window trend stats over a time-sliced series: net change (last minus
 * first), range and mean. Symmetric between the 24h and 7d panels so their
 * stats compare like-for-like — unlike trendSummary, whose reference is a
 * fixed 24h-ago reading.
 */
export function windowSummary(points: Array<[string, number]>): WindowSummary | null {
  if (points.length === 0) return null
  const values = points.map((point) => point[1]).filter(Number.isFinite)
  if (values.length === 0) return null
  const first = points[0]
  const last = points[points.length - 1]
  const change = last[1] - first[1]
  return {
    change,
    direction: directionOf(change),
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values),
  }
}

/**
 * Time-based slicing of a timestamped series: every point newer than `hours`
 * before now. Must be time-based, not "last N points" — some tiers carry
 * sub-hourly readings. Returns ascending order preserved.
 */
export function sliceRecentPoints(points: Array<[string, number]>, hours: number): Array<[string, number]> {
  const cutoff = Date.now() - hours * 3_600_000
  return points.filter(([ts]) => {
    const time = new Date(ts).getTime()
    return !Number.isNaN(time) && time >= cutoff
  })
}

/**
 * Direction glyph and signed text for one trend delta — the shared
 * presentation of a summary's direction (↑/↓/→), the ±0.25 dead-zone read
 * ('±0.0'), and the sign rule. Trusts the caller's direction: deciding flat
 * vs up/down is the summaries' job (directionOf), formatting is this one's.
 */
export function deltaSignal({
  direction,
  delta,
}: {
  direction: TrendDirection
  delta: number
}): { glyph: string; text: string } {
  return {
    glyph: direction === 'up' ? '↑' : direction === 'down' ? '↓' : '→',
    text: direction === 'flat' ? '±0.0' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`,
  }
}
