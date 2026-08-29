import type { RadarTier } from '../contract.ts'

/** Cost dimensions plotted by the Cost × IQ card. */
export type CostMetric = 'combined' | 'minutes' | 'price'

/** A tier with the positive cost value used by one panel. */
export interface ScatterPoint {
  tier: RadarTier
  x: number
}

/** One base model's tiers, already ordered by reasoning effort for a ladder line. */
export type CostLadder = ScatterPoint[]

/** All derived data the three cost panels draw from. */
export interface CostDataset {
  points: Record<CostMetric, ScatterPoint[]>
  ladders: Record<CostMetric, CostLadder[]>
}

/** ln(2.5)/ln(1.35): the site's "2.5× price buys 1.35× speed" exponent. */
const COMBINED_SPEED_WEIGHT = Math.log(2.5) / Math.log(1.35)

/** The site ships these codex-run DSV4 tiers hidden: same base models as the dsh-variants. */
export const DEFAULT_HIDDEN_BASES = ['deepseek-v4-flash', 'deepseek-v4-pro']

/** Legend order used when sorting reasoning-effort ladders; an unknown effort sorts first (indexOf semantics). */
export const EFFORT_ORDER = ['off', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra']

/** Site's combined efficiency index; null when either input is missing or non-positive. */
export function combinedCostIndex(price: number | null, minutes: number | null): number | null {
  if (price === null || minutes === null || !(price > 0) || !(minutes > 0)) return null
  return price * Math.pow(minutes / 10, COMBINED_SPEED_WEIGHT) * 100
}

/**
 * The site's composite-index number format (its efficiencyTickText): 100 caps,
 * otherwise 2+ decimals chosen from the magnitude, trailing zeros trimmed —
 * the tooltip reads the plotted (normalized) value through this.
 */
export function combinedIndexText(value: number): string {
  if (value >= 100) return '100'
  const decimals = Math.min(5, Math.max(2, Math.ceil(-Math.log10(value))))
  return String(Number(value.toFixed(decimals)))
}

/**
 * Sample counts behind the site-format tooltip: cost samples are the
 * token-ledger runs, runtime samples are all graded runs. Legacy snapshots
 * predate tokenSamples (and 0 means "no token ledger") — both fall back to the
 * graded total.
 */
export function tipSampleCounts(tier: { tokenSamples?: number; total: number }): { price: number; minutes: number } {
  return {
    price: tier.tokenSamples !== undefined && tier.tokenSamples > 0 ? tier.tokenSamples : tier.total,
    minutes: tier.total,
  }
}

/**
 * Dedupe base models in first-seen order. The filter chip row lists every
 * base — hidden ones included — so they stay clickable to re-enable.
 */
export function listBases(tiers: readonly RadarTier[]): string[] {
  const bases: string[] = []
  const seen = new Set<string>()
  for (const tier of tiers) {
    if (!seen.has(tier.model)) {
      seen.add(tier.model)
      bases.push(tier.model)
    }
  }
  return bases
}

function costValue(metric: CostMetric, tier: RadarTier): number | null {
  if (metric === 'combined') return combinedCostIndex(tier.avgPrice, tier.avgMinutes)
  return metric === 'minutes' ? tier.avgMinutes : tier.avgPrice
}

function buildLadders(points: ScatterPoint[]): CostLadder[] {
  const byBase = new Map<string, CostLadder>()
  for (const point of points) {
    const ladder = byBase.get(point.tier.model)
    if (ladder === undefined) byBase.set(point.tier.model, [point])
    else ladder.push(point)
  }
  for (const ladder of byBase.values()) {
    ladder.sort(
      (a, b) =>
        EFFORT_ORDER.indexOf(a.tier.effort) - EFFORT_ORDER.indexOf(b.tier.effort) ||
        a.x - b.x,
    )
  }
  return [...byBase.values()]
}

/**
 * Derive all Cost × IQ panel inputs in one pass over `visibleTiers` — the
 * caller applies the base-visibility filter (UI state) before calling. The
 * pass fills the three metric point arrays; ladder grouping then runs over
 * those derived points, never rescanning the tier list.
 * @param visibleTiers - tiers left after the caller's hidden-base filter.
 * @returns final panel points (composite normalized to max=100) and sorted ladder groups.
 */
export function buildCostDataset(visibleTiers: readonly RadarTier[]): CostDataset {
  const raw: Record<CostMetric, ScatterPoint[]> = { combined: [], minutes: [], price: [] }
  for (const tier of visibleTiers) {
    for (const metric of ['combined', 'minutes', 'price'] as const) {
      const value = costValue(metric, tier)
      if (value !== null && value > 0) raw[metric].push({ tier, x: value })
    }
  }

  const combinedMax = raw.combined.reduce((max, point) => Math.max(max, point.x), 0)
  const points: Record<CostMetric, ScatterPoint[]> = {
    combined: combinedMax > 0 ? raw.combined.map((point) => ({ tier: point.tier, x: (point.x / combinedMax) * 100 })) : [],
    minutes: raw.minutes,
    price: raw.price,
  }
  return {
    points,
    ladders: {
      combined: buildLadders(points.combined),
      minutes: buildLadders(points.minutes),
      price: buildLadders(points.price),
    },
  }
}
