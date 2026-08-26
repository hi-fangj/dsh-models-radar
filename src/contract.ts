/**
 * Wire contract shared by the host and client halves: pure data shapes with no
 * runtime imports, so both halves (Node ESM bundle and browser CJS bundle) can
 * import the types without dragging code across the boundary.
 */

/** One model×effort tier on the leaderboard. */
export interface RadarTier {
  /** Canonical tier key: `${model}@${effort}`. */
  key: string
  /** Base model id as the site spells it, e.g. `gpt-5.6-sol`. */
  model: string
  /** Reasoning-effort tier, e.g. `high`, `xhigh`. */
  effort: string
  /** Site-normalized capability score. */
  iq: number
  /** Average USD cost per graded run, when published. */
  avgPrice: number | null
  /** Average minutes per graded run, when published. */
  avgMinutes: number | null
  /** Cache hit rate in [0,1], when published. */
  cacheHit: number | null
  /** Graded runs passed / attempted (rolling window). */
  passed: number
  total: number
  /** `passed / total`, or null when nothing was graded yet. */
  passRate: number | null
  /** Runs recorded in the last 24h. */
  runs24h: number
}

/** A benchmark channel selectable in the UI. */
export interface RadarChannel {
  id: string
  title: string
  scoreLabel: string
  isDefault: boolean
}

/** The full view model one refresh produces for one channel. */
export interface RadarView {
  benchmark: string
  /** The channel's scoring mode, e.g. `binary-majority` or `continuous-macro`. */
  scoringMode?: string
  /** The channel's headline metric label, e.g. `Pass rate`. */
  scoreLabel: string
  /** ISO timestamp of this refresh attempt's success. */
  fetchedAt: string
  /** Server-side data timestamp, when published. */
  sourceUpdatedAt?: string
  /** The deployment's default agent model selection, when resolvable. */
  defaultModel?: { provider: string; model: string; reasoningEffort?: string }
  channels: RadarChannel[]
  tiers: RadarTier[]
  /** Tier key → `[taskId, rate, majorityPassed?]` rows. Third field is absent in legacy snapshots. */
  taskRates: Record<string, Array<[string, number, boolean?]>>
  /** Tier key → `[isoTimestamp, iq]` points ascending (7-day hourly series). */
  series: Record<string, Array<[string, number]>>
}

/** Successful data response; `stale` marks a snapshot fallback after a failed live refresh. */
export interface RadarPayload {
  ok: true
  fresh: boolean
  /** Served entirely from the freshness window (zero upstream hits this request). */
  throttled?: boolean
  stale?: boolean
  /** Why the live refresh failed (present only with `stale`). */
  notice?: string
  fetchedAt?: string
  data: RadarView | null
}

/** Failed response: no snapshot existed to fall back to. */
export interface RadarFailure {
  ok: false
  error: string
}

export type RadarResponse = RadarPayload | RadarFailure
