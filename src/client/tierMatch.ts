/**
 * Tier match (档位匹配, see CONTEXT.md) — the single three-step rule that
 * resolves the session's current model to a leaderboard tier, shared by the
 * composer readout capsule and the settings page default selection:
 *
 * ① exact `model@effort`; ② strongest tier of the same base (`view.tiers`
 * arrives IQ-descending, so the first hit is the base's best effort);
 * ③ two-way substring fallback. ① is exact; ②③ are approximate (the dock
 * capsule marks them with `≈`).
 *
 * Every step prefers this session's own-harness tier over the bare id, because
 * the radar files a DSH session's results under a `dsh-` prefixed id while the
 * session itself reports the bare model id. A bare id is therefore homonymous
 * with whichever OTHER harness ran that model: the radar's `deepseek-v4-flash`
 * is Codex's, while DSH's own row is `dsh-deepseek-v4-flash`. Without the
 * preference the readout describes a namesake — a different runner's sample,
 * typically a much smaller one — instead of the model this session is running.
 *
 * The preference only reorders candidates WITHIN a step, never excludes: a
 * session whose own harness never ran the model, or lacks the requested effort,
 * falls through to the bare id exactly as before.
 *
 * Model-name comparison normalizes both sides: strip any provider path
 * prefix, trim, case-fold. An empty reasoning effort counts as no effort.
 * Pure data in, pure data out — no React, no DOM, node-testable.
 */
import type { RadarTier, RadarView } from '../contract.ts'

/**
 * Prefix the radar puts on this session's own-harness artifacts. Mirrors the
 * `dsh-` arm of `harness.ts`'s `harnessOfModel`; a tier carrying it is DSH's
 * own result for that model, not another runner's.
 */
const OWN_HARNESS_PREFIX = 'dsh-'

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
  /**
   * The same route under other spellings the caller can vouch for — in practice
   * the model catalog's display name. DSH's own adapters name a route
   * differently from the radar's catalog: a session reports `deepseek-flash`
   * where the radar lists `deepseek-v4.1-flash`, so the id alone misses every
   * tier even though the site does cover the model. Consulted only after the id
   * has failed, so a real id hit always wins and a caller with no better
   * spelling behaves exactly as before.
   */
  aliases?: readonly string[]
}

/** Provider-qualified id → bare model token, trimmed and case-folded. */
function normalizeModelToken(model: string): string {
  return model.split('/').pop()?.trim().toLowerCase() ?? model.toLowerCase()
}

/** First tier whose normalized model equals `token`, optionally pinned to one effort. */
function findTier(tiers: readonly RadarTier[], token: string, effort?: string): RadarTier | undefined {
  return tiers.find(
    (tier) => normalizeModelToken(tier.model) === token && (effort === undefined || tier.effort.toLowerCase() === effort),
  )
}

/** Two-way substring test over normalized model tokens. */
function isNamesake(tier: RadarTier, token: string): boolean {
  const normalized = normalizeModelToken(tier.model)
  return normalized.includes(token) || token.includes(normalized)
}

/** The three-step rule applied to ONE normalized model token. */
function resolveToken(tiers: readonly RadarTier[], model: string, effort?: string): TierMatch | null {
  const own = OWN_HARNESS_PREFIX + model
  // ① Exact `model@effort` — an empty effort string counts as no effort.
  if (effort !== undefined && effort !== '') {
    const exact = findTier(tiers, own, effort) ?? findTier(tiers, model, effort)
    if (exact !== undefined) return { tier: exact, approximate: false }
  }
  // ② Same base, strongest effort: `tiers` is IQ-descending, so the first
  // base-model hit is its best tier.
  const base = findTier(tiers, own) ?? findTier(tiers, model)
  if (base !== undefined) return { tier: base, approximate: true }
  // ③ Two-way substring fallback, same normalization on both sides.
  const fuzzy = tiers.find((tier) => isNamesake(tier, own)) ?? tiers.find((tier) => isNamesake(tier, model))
  return fuzzy === undefined ? null : { tier: fuzzy, approximate: true }
}

/**
 * Resolve one selection against a view's tiers: the three-step rule on the
 * provider's own model id, then the same rule on each caller-supplied alias.
 * Returns null when the selection is absent, its model token is empty, or
 * neither spelling matches (callers then render their own no-match surface).
 */
export function matchTier(view: RadarView, selection?: TierMatchSelection): TierMatch | null {
  if (selection === undefined) return null
  const model = normalizeModelToken(selection.model)
  if (model === '') return null
  const effort = selection.reasoningEffort?.toLowerCase()
  const direct = resolveToken(view.tiers, model, effort)
  if (direct !== null) return direct
  for (const alias of selection.aliases ?? []) {
    const token = normalizeModelToken(alias)
    if (token === '' || token === model) continue
    const hit = resolveToken(view.tiers, token, effort)
    if (hit !== null) return hit
  }
  return null
}
