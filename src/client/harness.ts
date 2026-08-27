/**
 * Harness attribution for the capability overview: which agent runner produced
 * a tier's crowd-benchmarked score. Derived purely from the base-model id,
 * mirroring the radar site's own classification intent (its advertised client
 * configs are "zcode-glm-5.3-family…", "kimi-code-k3…", "grok-build-4.6…"
 * plus the dsh-prefixed artifacts). Labels are the site-canonical proper nouns,
 * shared by both locales. An unmatched model gets NO badge — never a guess.
 *
 * Deliberately view-layer only: nothing here enters the wire contract or the
 * persisted snapshots, so old snapshots render unchanged.
 */

export type HarnessId = 'codex' | 'dsh' | 'zcode' | 'grok' | 'kimi-code'

export interface HarnessMeta {
  label: string
  /** Brand accent used by the overview badge dot (site palette). */
  color: string
}

const HARNESS_META: Record<HarnessId, HarnessMeta> = {
  codex: { label: 'Codex', color: '#8b5cf6' },
  dsh: { label: 'DSH', color: '#4d6bfe' },
  zcode: { label: 'ZCode', color: '#06b6d4' },
  grok: { label: 'Grok', color: '#f59e0b' },
  'kimi-code': { label: 'Kimi Code', color: '#10b981' },
}

/** Site-canonical display metadata for one harness id. */
export function harnessMeta(id: HarnessId): HarnessMeta {
  return HARNESS_META[id]
}

/**
 * Base-model id → harness, or null when no rule matches (displayed unbadged).
 * Positive families only: the tiers actually listed on the radar today are all
 * covered — anything new stays unlabeled until its rule lands here.
 */
export function harnessOfModel(model: string): HarnessId | null {
  const id = model.trim().toLowerCase()
  if (id.startsWith('dsh-')) return 'dsh'
  if (id === 'k3') return 'kimi-code'
  if (id.startsWith('glm-5.3')) return 'zcode'
  if (id === 'grok-4.6') return 'grok'
  if (id.startsWith('gpt-') || id.startsWith('deepseek-v')) return 'codex'
  return null
}

/**
 * Full-attribution label for a tier selector option: model · effort · harness.
 * No score — the charts next to the selector carry it. Unmatchable harness
 * simply drops the last segment. Shared by the settings page and the
 * capability popover so both selectors read identically, open or collapsed.
 */
export function tierOptionLabel(tier: { model: string; effort: string }): string {
  const harness = harnessOfModel(tier.model)
  return harness === null ? `${tier.model} · ${tier.effort}` : `${tier.model} · ${tier.effort} · ${harnessMeta(harness).label}`
}
