/**
 * Harness attribution for the capability overview: which agent runner produced
 * a tier's crowd-benchmarked score. Derived purely from the base-model id,
 * mirroring the radar site's own classification intent (its advertised client
 * configs are "zcode-glm-5.3-family…", "kimi-code-k3…", "grok-build-4.6…", the
 * google-antigravity-subscription Gemini (gemini-3.7-flash), the
 * codebuddy-subscription HY4 Preview (hy4-preview) plus the dsh-prefixed
 * artifacts). Labels are the site-canonical proper nouns, shared
 * by both locales. An unmatched model gets NO badge — never a guess.
 *
 * Also home to the cost chart's display-label derivation (the site's
 * prettyModel + efficiencyModelLabel): pretty base names and the per-billing
 * attribution line used by the hover tooltip.
 *
 * Deliberately view-layer only: nothing here enters the wire contract or the
 * persisted snapshots, so old snapshots render unchanged.
 */

export type HarnessId = 'codex' | 'dsh' | 'zcode' | 'grok' | 'kimi-code' | 'antigravity' | 'codebuddy'

export interface HarnessMeta {
  label: string
  /** Brand accent used by the overview badge dot (site harnessbar palette). */
  color: string
}

const HARNESS_META: Record<HarnessId, HarnessMeta> = {
  codex: { label: 'Codex', color: '#2dd4bf' },
  dsh: { label: 'DSH', color: '#4d6bfe' },
  zcode: { label: 'ZCode', color: '#06b6d4' },
  grok: { label: 'Grok', color: '#f59e0b' },
  'kimi-code': { label: 'Kimi Code', color: '#10b981' },
  antigravity: { label: 'Antigravity', color: '#8b5cf6' },
  codebuddy: { label: 'CodeBuddy', color: '#ec4899' },
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
  if (id === 'gemini-3.7-flash') return 'antigravity'
  if (id === 'hy4-preview') return 'codebuddy'
  if (id.startsWith('gpt-') || id.startsWith('deepseek-v')) return 'codex'
  return null
}

/** Site pretty names for the bases it lists (its prettyModel table, positive entries only). */
const PRETTY_MODEL: Record<string, string> = {
  'deepseek-v4-flash': 'DeepSeek V4 Flash',
  'dsh-deepseek-v4-flash': 'DeepSeek V4 Flash',
  'deepseek-v4-pro': 'DeepSeek V4 Pro',
  'dsh-deepseek-v4-pro': 'DeepSeek V4 Pro',
  'dsh-deepseek-v4-flash-vision-exp': 'DeepSeek V4 Flash Vision Exp',
  k3: 'K3',
  'glm-5.3': 'GLM-5.3',
  'glm-5.3-flash': 'GLM-5.3 Flash',
  'grok-4.6': 'Grok 4.6',
  'gemini-3.7-flash': 'Gemini 3.7 Flash',
  'hy4-preview': 'HY4 Preview',
}

/**
 * Display name for a base-model id, mirroring the site's prettyModel:
 * GPT codenames capitalize ("gpt-5.6-sol" → "GPT-5.6 Sol"), unknown ids pass
 * through with the gpt- prefix stripped.
 */
export function prettyModelName(model: string): string {
  const id = model.trim().toLowerCase()
  const known = PRETTY_MODEL[id]
  if (known !== undefined) return known
  const suffixed = /^gpt-(\d+\.\d+)-([a-z0-9]+)$/.exec(id)
  if (suffixed !== null) return `GPT-${suffixed[1]} ${suffixed[2].charAt(0).toUpperCase()}${suffixed[2].slice(1)}`
  const bare = /^gpt-(\d+\.\d+)$/.exec(id)
  if (bare !== null) return `GPT-${bare[1]}`
  return id.replace(/^gpt-/, '')
}

/** The cost chart's attribution label parts for one base model. */
export interface CostModelLabel {
  /** Site display name (the tooltip's first segment). */
  name: string
  /** Billing class: the API-metered DeepSeek V4 family vs everything on a subscription. */
  billing: 'api' | 'subscription'
  /** Harness segment — the site attaches one only to the API-metered family. */
  harness: HarnessId | null
}

/**
 * The cost chart's attribution label for a base model, mirroring the site's
 * efficiencyModelLabel: subscription bases render just their pretty name (the
 * "· 订阅" billing word is locale copy), while the API-metered DeepSeek V4
 * family shortens to "DSV4 …" and carries its harness segment.
 */
export function costModelLabel(model: string): CostModelLabel {
  const id = model.trim().toLowerCase()
  if (id === 'deepseek-v4-flash' || id === 'deepseek-v4-pro' || id.startsWith('dsh-')) {
    const name = prettyModelName(model).replace(/^DeepSeek V4\s+/, 'DSV4 ')
    return { name, billing: 'api', harness: harnessOfModel(model) }
  }
  return { name: prettyModelName(model).replace(/^GPT-5\.6\s+/, ''), billing: 'subscription', harness: null }
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

// ---------------------------------------------------------------------------
// Per-base display colors (site palettes)
// ---------------------------------------------------------------------------

/**
 * Site-canonical per-base palettes, resolved in the site's order: the
 * efficiency chart's EFFICIENCY_MODEL_COLORS overrides first, then its general
 * MODEL_COLORS, then the muted fallback (the site's FALLBACK_COLORS slot).
 * Shared by the cost scatter and the community-ratings bar chart — both
 * encode 颜色＝基座 with the same table (CONTEXT.md 成本对比 / 社区体感分).
 */
const BASE_MODEL_COLORS: Record<string, string> = {
  'grok-4.6': '#f59e0b',
  k3: '#10b981',
  'hy4-preview': '#ec4899',
  'gemini-3.7-flash': '#8b5cf6',
  'glm-5.3': '#f5f5f5',
  'glm-5.3-flash': '#f6c453',
  'gpt-5.6-sol': '#eab308',
  'gpt-5.6-terra': '#3b82f6',
  'gpt-5.6-luna': '#c7d2e0',
  'gpt-5.5': '#00e5ff',
  'deepseek-v4-flash': '#4d6bfe',
  'deepseek-v4-pro': '#a78bfa',
  'dsh-deepseek-v4-flash': '#4d6bfe',
  'dsh-deepseek-v4-pro': '#a78bfa',
  'dsh-deepseek-v4-flash-vision-exp': '#22c55e',
}

const EFFICIENCY_MODEL_COLORS: Record<string, string> = {
  'gpt-5.5': '#22d3ee',
  'glm-5.3': '#06b6d4',
  'glm-5.3-flash': '#f6c453',
  'grok-4.6': '#f59e0b',
  'gemini-3.7-flash': '#a78bfa',
  'hy4-preview': '#ec4899',
  'gpt-5.6-sol': '#fbbf24',
  'gpt-5.6-terra': '#3b82f6',
  'gpt-5.6-luna': '#d5dbe5',
  'deepseek-v4-flash': '#c026d3',
  'deepseek-v4-pro': '#f472b6',
  'dsh-deepseek-v4-flash': '#c026d3',
  'dsh-deepseek-v4-pro': '#f472b6',
  'dsh-deepseek-v4-flash-vision-exp': '#16a34a',
}

/** Display color for a base model: efficiency overrides, then general, then muted. */
export function modelColor(base: string): string {
  return EFFICIENCY_MODEL_COLORS[base] ?? BASE_MODEL_COLORS[base] ?? 'var(--dsw-alias-label-secondary)'
}
