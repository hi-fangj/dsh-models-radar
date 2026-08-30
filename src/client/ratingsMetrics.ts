/**
 * Community-ratings display logic (CONTEXT.md 社区体感分): slot assembly for
 * the two-window bar chart and the selected-tier highlight match. Pure data
 * — no React, no DOM — so the node tests can exercise it directly.
 *
 * The two windows (近7天 / 近24小时) are independent upstream datasets, so
 * neither one's tier list alone defines the chart's columns: slots are the
 * union of both windows' tiers, which keeps column positions stable across
 * tab switches (an unrated slot renders the 未评分 placeholder instead of
 * collapsing). The 近7天 list is the site-canonical ordering seed because it
 * is the superset in practice.
 */
import type { CommunityRatingTier } from '../contract.ts'

/** One chart column: a tier that exists in at least one of the two windows. */
export interface RatingsSlot {
  /** Canonical tier key `${model}@${effort}`, same namespace as RadarTier.key. */
  key: string
  model: string
  effort: string
}

/** Effort display order, strongest first (left→right within a base group). */
const EFFORT_DISPLAY_ORDER = ['ultra', 'max', 'xhigh', 'high', 'medium', 'low', 'off']

const effortRank = (effort: string): number => {
  const at = EFFORT_DISPLAY_ORDER.indexOf(effort)
  return at === -1 ? EFFORT_DISPLAY_ORDER.length : at
}

/**
 * Merge both windows' tier lists into the stable slot order: base groups in
 * first-appearance order (the 7d list seeds it), efforts within a group in
 * display order. Dedupe by tier key.
 */
export function ratingsSlots(
  primary: readonly CommunityRatingTier[] | undefined,
  secondary: readonly CommunityRatingTier[] | undefined,
): RatingsSlot[] {
  const seen = new Set<string>()
  const slots: RatingsSlot[] = []
  for (const tier of [...(primary ?? []), ...(secondary ?? [])]) {
    if (seen.has(tier.key)) continue
    seen.add(tier.key)
    slots.push({ key: tier.key, model: tier.model, effort: tier.effort })
  }
  const groupOrder = new Map<string, number>()
  for (const slot of slots) if (!groupOrder.has(slot.model)) groupOrder.set(slot.model, groupOrder.size)
  slots.sort(
    (a, b) =>
      (groupOrder.get(a.model) ?? 0) - (groupOrder.get(b.model) ?? 0) ||
      effortRank(a.effort) - effortRank(b.effort),
  )
  return slots
}

/** One base-model group of consecutive slots (the chart's visual cluster). */
export interface RatingsGroup {
  model: string
  slots: RatingsSlot[]
}

/** Slice the flat slot list into base-model groups of consecutive columns. */
export function ratingsGroups(slots: readonly RatingsSlot[]): RatingsGroup[] {
  const groups: RatingsGroup[] = []
  for (const slot of slots) {
    const last = groups[groups.length - 1]
    if (last !== undefined && last.model === slot.model) last.slots.push(slot)
    else groups.push({ model: slot.model, slots: [slot] })
  }
  return groups
}

/** The selected-tier highlight: exact hit, or the base's best-rated stand-in. */
export interface RatingsMatch {
  tier: CommunityRatingTier
  /** True when the exact tier is absent and a same-base tier stands in (shown with ≈). */
  approx: boolean
}

/**
 * Resolve the highlight for the section's selected tier key (档位匹配, adapted
 * read-only): an exact `${model}@${effort}` hit wins; otherwise the same-base
 * tier with the highest average (unrated windows ignored; effort order breaks
 * ties) stands in with ≈. No same-base tier → no highlight at all.
 */
export function matchRatingsTier(
  tiers: readonly CommunityRatingTier[],
  selectedKey: string | null,
): RatingsMatch | null {
  if (selectedKey === null) return null
  const exact = tiers.find((tier) => tier.key === selectedKey)
  if (exact !== undefined) return { tier: exact, approx: false }
  const at = selectedKey.indexOf('@')
  if (at <= 0) return null
  const base = selectedKey.slice(0, at)
  const candidates = tiers.filter((tier) => tier.model === base)
  if (candidates.length === 0) return null
  const rated = candidates.filter((tier) => tier.average !== null)
  const pool = rated.length > 0 ? rated : candidates
  const best = pool.reduce((acc, candidate) => {
    const accScore = acc.average ?? -1
    const candidateScore = candidate.average ?? -1
    if (candidateScore !== accScore) return candidateScore > accScore ? candidate : acc
    return effortRank(candidate.effort) < effortRank(acc.effort) ? candidate : acc
  })
  return { tier: best, approx: true }
}
