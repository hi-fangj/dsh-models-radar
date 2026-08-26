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
  const direction: TrendDirection = delta24h > 0.25 ? 'up' : delta24h < -0.25 ? 'down' : 'flat'
  return {
    delta24h,
    direction,
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values),
  }
}
