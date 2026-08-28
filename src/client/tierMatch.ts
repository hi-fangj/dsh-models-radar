/**
 * Tier match (档位匹配, see CONTEXT.md) — the single three-step rule that
 * resolves the session's current model to a leaderboard tier, shared by the
 * composer dock capsule and the settings page default selection:
 *
 * ① exact `model@effort`; ② strongest tier of the same base (`view.tiers`
 * arrives IQ-descending, so the first hit is the base's best effort);
 * ③ two-way substring fallback. ① is exact; ②③ are approximate (the dock
 * capsule marks them with `≈`).
 *
 * Model-name comparison normalizes both sides: strip any provider path
 * prefix, trim, case-fold. An empty reasoning effort counts as no effort.
 * Pure data in, pure data out — no React, no DOM, node-testable.
 */
import type { RadarTier, RadarView } from '../contract.ts'

/** One resolved match: the tier plus whether the hit was approximate. */
export interface TierMatch {
  tier: RadarTier
  approximate: boolean
}

/**
 * Structural selection subset both callers satisfy: the official
 * `ModelSelection` (dock) and `RadarView['defaultModel']` (settings).
 * Tolerates `undefined` so callers need no guard.
 */
export interface TierMatchSelection {
  model: string
  reasoningEffort?: string
}

/** Provider-qualified id → bare model token, trimmed and case-folded. */
function normalizeModelToken(model: string): string {
  return model.split('/').pop()?.trim().toLowerCase() ?? model.toLowerCase()
}

/**
 * Resolve one selection against a view's tiers by the three-step rule.
 * Returns null when the selection is absent, its model token is empty, or no
 * step matches (callers then render their own no-match surface).
 */
export function matchTier(view: RadarView, selection?: TierMatchSelection): TierMatch | null {
  if (selection === undefined) return null
  const model = normalizeModelToken(selection.model)
  if (model === '') return null
  const effort = selection.reasoningEffort?.toLowerCase()
  // ① Exact `model@effort` — an empty effort string counts as no effort.
  if (effort !== undefined && effort !== '') {
    const exact = view.tiers.find(
      (tier) => normalizeModelToken(tier.model) === model && tier.effort.toLowerCase() === effort,
    )
    if (exact !== undefined) return { tier: exact, approximate: false }
  }
  // ② Same base, strongest effort: `view.tiers` is IQ-descending, so the
  // first base-model hit is its best tier.
  const base = view.tiers.find((tier) => normalizeModelToken(tier.model) === model)
  if (base !== undefined) return { tier: base, approximate: true }
  // ③ Two-way substring fallback, same normalization on both sides.
  const fuzzy = view.tiers.find(
    (tier) => normalizeModelToken(tier.model).includes(model) || model.includes(normalizeModelToken(tier.model)),
  )
  return fuzzy === undefined ? null : { tier: fuzzy, approximate: true }
}
