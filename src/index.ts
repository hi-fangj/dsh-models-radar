/**
 * dsh-models-radar host half: one same-origin prefix route (/model-radar) that
 * proxies the public codexradar read API, merges it into a compact view model,
 * and serves it to the browser half.
 *
 * Why a host proxy at all — api.codexradar.com's CORS policy is an origin
 * allowlist that only ever echoes deng.codexradar.com, so the browser cannot
 * call it directly from the DSH GUI (see docs/adr/0001-host-proxy-fetch.md).
 * The proxy is also the natural home for snapshot persistence: every
 * successful refresh overwrites `latest-<benchmark>.json` (the failure
 * fallback display source) and appends one deduped line of per-tier IQ to
 * `iq-timeline.jsonl` (the local long-history accumulator beyond the site's
 * 7-day rolling window). Snapshots are never pruned; they are small and
 * content-hash-deduped.
 */
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import type { RadarChannel, RadarTier, RadarView } from './contract.ts'

/** Cordis plugin name (the Loader entry and client bundle id). */
export const name = 'dsh-models-radar'

/** Services required before load: only the browser HTTP carrier. */
export const inject = ['webServer']

const UPSTREAM = 'https://api.codexradar.com/api/v1'
const ROUTE_PREFIX = '/model-radar'
const FETCH_TIMEOUT_MS = 30_000

/**
 * Freshness windows per upstream dataset (docs/adr/0002-freshness-window.md):
 * data served inside its window costs zero upstream hits; beyond it the
 * dataset is refetched on the next trigger. An explicit manual refresh
 * (`bypass=1`) ignores the windows. Windows are hardcoded — no user setting.
 */
const FRESH_BENCHMARKS_MS = 60 * 60_000 // channel list: near-static
const FRESH_EFFICIENCY_MS = 15 * 60_000 // overview + capability readout
const FRESH_LEADERBOARD_MS = 15 * 60_000 // per-task composition
const FRESH_HISTORY_MS = 60 * 60_000 // trend: upstream adds one point/hour
/** Wholesale cold-start window: a persisted snapshot this fresh is served without touching upstream. */
const FRESH_SNAPSHOT_MS = FRESH_EFFICIENCY_MS

// ---------------------------------------------------------------------------
// Loose upstream faces: only the leaves this plugin actually reads. Anything
// unrecognized is tolerated as absent so a benign site-side schema addition
// cannot break the tab.
// ---------------------------------------------------------------------------

interface UpBenchmarks {
  benchmarks?: Array<{ id?: string; title?: string; score_label?: string; default?: boolean }>
}

interface UpPoint {
  model?: string
  effort?: string
  iq?: number
  average_price_usd?: number | null
  average_minutes?: number | null
  cache_hit_rate?: number | null
  passed?: number
  total?: number
  runs_24h?: number
}

interface UpEfficiency {
  points?: UpPoint[]
  scoring_mode?: string
  score_label?: string
  source_updated_at?: string
}

interface UpHistoryEntry {
  ts?: string
  score?: number
}

type UpHistory = Record<string, UpHistoryEntry[]>

interface UpLbTask {
  majority_pass?: boolean
  score_rate?: number | null
}

interface UpLbModel {
  model?: string
  effort?: string
  tasks?: Record<string, UpLbTask>
}

interface UpLeaderboard {
  models?: UpLbModel[]
}

/** One cached upstream dataset: `at` is the fetch-success moment backing its freshness window. */
interface DatasetEntry<T = unknown> {
  at: number
  value: T
}

const num = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

/** djb2 over the stable stringified form — timeline-append dedupe only. */
function djb2(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0
  return hash.toString(36)
}

function dataDir(): string {
  const root = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(root, 'plugin-data', name)
}

async function fetchJson<T>(pathAndQuery: string): Promise<T> {
  const response = await fetch(UPSTREAM + pathAndQuery, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`upstream ${pathAndQuery} → HTTP ${response.status}`)
  return (await response.json()) as T
}

/** Dataset cache keys of one channel (all but `benchmarks` are channel-scoped). */
const DATASETS = (benchmark: string): Array<{ key: string; ttlMs: number }> => [
  { key: 'benchmarks', ttlMs: FRESH_BENCHMARKS_MS },
  { key: `eff:${benchmark}`, ttlMs: FRESH_EFFICIENCY_MS },
  { key: `hist:${benchmark}`, ttlMs: FRESH_HISTORY_MS },
  { key: `lb:${benchmark}`, ttlMs: FRESH_LEADERBOARD_MS },
]

/** Bound per-dataset resolve: fresh entries never touch upstream; stale/missing ones do. */
type EnsureFn = <T>(
  key: string,
  ttlMs: number,
  pathAndQuery: string,
) => Promise<{ value: T; at: number; upstream: boolean }>

/**
 * Compose the view model for one benchmark channel from its four upstream
 * datasets. Each dataset resolves per its own freshness window (see
 * FRESH_*_MS), so an expired dataset alone is refetched while fresh ones are
 * reused from cache — the view is a mixed assembly. `fetchedAt` is the oldest
 * dataset moment in the assembly, honestly reporting the view's data currency.
 * Any failure rejects — callers fall back to the last snapshot wholesale,
 * which keeps "what the UI shows" always internally consistent.
 */
async function buildViewModel(
  benchmark: string,
  defaultModel: RadarView['defaultModel'],
  ensure: EnsureFn,
): Promise<{ view: RadarView; upstreamHits: number }> {
  const encoded = encodeURIComponent(benchmark)
  const [bench, eff, hist, lb] = await Promise.all([
    ensure<UpBenchmarks>('benchmarks', FRESH_BENCHMARKS_MS, '/benchmarks'),
    ensure<UpEfficiency>(`eff:${benchmark}`, FRESH_EFFICIENCY_MS, `/intelligence-efficiency?benchmark=${encoded}`),
    ensure<UpHistory>(`hist:${benchmark}`, FRESH_HISTORY_MS, `/iq-history?benchmark=${encoded}`),
    ensure<UpLeaderboard>(`lb:${benchmark}`, FRESH_LEADERBOARD_MS, `/leaderboard?benchmark=${encoded}`),
  ])

  const channels: RadarChannel[] = (bench.value.benchmarks ?? [])
    .filter((b): b is typeof b & { id: string } => typeof b.id === 'string')
    .map((b) => ({
      id: b.id,
      title: typeof b.title === 'string' ? b.title : b.id,
      scoreLabel: typeof b.score_label === 'string' ? b.score_label : '',
      isDefault: b.default === true,
    }))

  // Tier key → per-task rows sorted by rate desc (then id, for stable order).
  const taskRates = new Map<string, Array<[string, number, boolean?]>>()
  for (const model of lb.value.models ?? []) {
    if (typeof model.model !== 'string' || typeof model.effort !== 'string') continue
    const key = `${model.model}@${model.effort}`
    const rows = Object.entries(model.tasks ?? {}).map(([taskId, task]): [string, number, boolean?] => [
      taskId,
      num(task.score_rate) ?? (task.majority_pass === true ? 1 : 0),
      typeof task.majority_pass === 'boolean' ? task.majority_pass : undefined,
    ])
    rows.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    taskRates.set(key, rows)
  }

  const tiers: RadarTier[] = []
  const series: Record<string, Array<[string, number]>> = {}
  for (const point of eff.value.points ?? []) {
    if (typeof point.model !== 'string' || typeof point.effort !== 'string') continue
    const key = `${point.model}@${point.effort}`
    const total = num(point.total) ?? 0
    const passed = num(point.passed) ?? 0
    tiers.push({
      key,
      model: point.model,
      effort: point.effort,
      iq: num(point.iq) ?? 0,
      avgPrice: num(point.average_price_usd),
      avgMinutes: num(point.average_minutes),
      cacheHit: num(point.cache_hit_rate),
      passed,
      total,
      passRate: total > 0 ? passed / total : null,
      runs24h: num(point.runs_24h) ?? 0,
    })
    // Prefer the exact tier series; fall back to the base-model series when
    // the site has not split this tier out yet.
    const entries = hist.value[key] ?? hist.value[point.model]
    if (Array.isArray(entries) && entries.length > 0) {
      series[key] = entries
        .filter((e): e is typeof e & { ts: string } => typeof e.ts === 'string')
        .map((e) => [e.ts, num(e.score) ?? 0])
    }
  }
  tiers.sort((a, b) => b.iq - a.iq)

  return {
    view: {
      benchmark,
      scoringMode: typeof eff.value.scoring_mode === 'string' ? eff.value.scoring_mode : undefined,
      scoreLabel: typeof eff.value.score_label === 'string' ? eff.value.score_label : '',
      fetchedAt: new Date(Math.min(bench.at, eff.at, hist.at, lb.at)).toISOString(),
      sourceUpdatedAt: typeof eff.value.source_updated_at === 'string' ? eff.value.source_updated_at : undefined,
      defaultModel,
      channels,
      tiers,
      taskRates: Object.fromEntries(taskRates),
      series,
    },
    upstreamHits: Number(bench.upstream) + Number(eff.upstream) + Number(hist.upstream) + Number(lb.upstream),
  }
}

/**
 * Mount the same-origin API routes on the web server.
 * @param ctx - host cordis context.
 */
export function apply(ctx: Context): void {
  /**
   * Per-dataset freshness cache (docs/adr/0002-freshness-window.md): each
   * upstream dataset of each channel resolves independently within its own
   * window, so a stale dataset alone is refetched while fresh ones are reused.
   * `benchmarks` is channel-global (the channel list does not vary by channel).
   */
  const datasets = new Map<string, DatasetEntry>()
  /** Single-flight: one upstream fetch per dataset key, whichever request started it. */
  const inflight = new Map<string, Promise<unknown>>()
  /** Last successfully assembled view per channel: wholesale fast path + failure fallback. */
  const lastView = new Map<string, RadarView>()
  /** Last timeline hash per benchmark (in-memory; restart may append one dup). */
  const lastHash = new Map<string, string>()

  // Soft dependency: the deployment-level default model selection used to seed
  // the client's tier picker. Absent service simply means no auto-match hint.
  const currentDefaultModel = (): RadarView['defaultModel'] => {
    const service = ctx.get('agentDefaultModel') as
      | { currentSelection?: () => { provider?: string; model?: string; reasoningEffort?: string } }
      | undefined
    const pick = service?.currentSelection?.()
    if (pick === undefined || typeof pick.model !== 'string' || pick.model === '') return undefined
    return {
      provider: typeof pick.provider === 'string' ? pick.provider : '',
      model: pick.model,
      reasoningEffort: typeof pick.reasoningEffort === 'string' ? pick.reasoningEffort : undefined,
    }
  }

  const latestPath = (benchmark: string): string => join(dataDir(), `latest-${benchmark}.json`)

  async function readLatest(benchmark: string): Promise<RadarView | undefined> {
    try {
      return JSON.parse(await readFile(latestPath(benchmark), 'utf8')) as RadarView
    } catch {
      return undefined
    }
  }

  async function persist(view: RadarView): Promise<void> {
    await mkdir(dataDir(), { recursive: true })
    await writeFile(latestPath(view.benchmark), JSON.stringify(view), 'utf8')
    // Compact long-history accumulator: one line per content change.
    const iq: Record<string, number> = {}
    for (const tier of view.tiers) iq[tier.key] = tier.iq
    const hash = djb2(JSON.stringify(iq))
    if (lastHash.get(view.benchmark) !== hash) {
      lastHash.set(view.benchmark, hash)
      await appendFile(
        join(dataDir(), 'iq-timeline.jsonl'),
        `${JSON.stringify({ ts: view.fetchedAt, b: view.benchmark, iq })}\n`,
        'utf8',
      )
    }
  }

  /**
   * Resolve one dataset within its freshness window. Fresh entries are served
   * from cache without touching upstream; stale/missing ones are fetched
   * (single-flight: concurrent requests share one upstream call). `bypass`
   * forces a fresh fetch (manual refresh) but still joins an in-flight call.
   */
  const ensureRaw = async <T>(key: string, ttlMs: number, pathAndQuery: string, bypass: boolean) => {
    const now = Date.now()
    const cached = datasets.get(key)
    if (!bypass && cached !== undefined && now - cached.at < ttlMs) {
      return { value: cached.value as T, at: cached.at, upstream: false }
    }
    const pending = inflight.get(key)
    if (pending !== undefined) return (await pending) as { value: T; at: number; upstream: boolean }
    const fetch = fetchJson<T>(pathAndQuery)
      .then((value) => {
        const at = Date.now()
        datasets.set(key, { at, value })
        return { value, at, upstream: true }
      })
      .finally(() => {
        inflight.delete(key)
      })
    inflight.set(key, fetch)
    return fetch
  }

  /**
   * Freshness-window resolver, bound per request: serves cached datasets
   * inside their window, fetches stale/missing ones (single-flight).
   */
  const ensure: EnsureFn = async <T>(key: string, ttlMs: number, pathAndQuery: string) =>
    ensureRaw(key, ttlMs, pathAndQuery, false)

  /**
   * With-bypass resolver, bound per request: identical to `ensure` but skips
   * every freshness window (the user explicitly asked for the latest).
   */
  const ensureBypass: EnsureFn = async <T>(key: string, ttlMs: number, pathAndQuery: string) =>
    ensureRaw(key, ttlMs, pathAndQuery, true)

  const respond = (res: import('node:http').ServerResponse, status: number, body: unknown): void => {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify(body))
  }

  async function handleData(url: URL, res: import('node:http').ServerResponse): Promise<void> {
    const benchmark = url.searchParams.get('benchmark') ?? 'deep-swe'
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(benchmark)) {
      respond(res, 400, { ok: false, error: 'bad benchmark id' })
      return
    }
    const bypass = url.searchParams.get('bypass') === '1'
    const now = Date.now()

    if (!bypass) {
      // Wholesale fast path: every dataset of this channel is still within its
      // window, so the last assembled view is served unchanged — zero upstream.
      const allFresh = DATASETS(benchmark).every(({ key, ttlMs }) => {
        const entry = datasets.get(key)
        return entry !== undefined && now - entry.at < ttlMs
      })
      const current = lastView.get(benchmark)
      if (allFresh && current !== undefined) {
        respond(res, 200, {
          ok: true,
          fresh: true,
          throttled: true,
          fetchedAt: current.fetchedAt,
          data: current,
        })
        return
      }
      // Cold start (or no assembled view yet): a persisted snapshot within its
      // window serves wholesale — a fresh process restart costs no upstream.
      // A view that was itself served cold keeps serving within the window,
      // since a snapshot serve never populates the per-dataset cache.
      if (current === undefined) {
        const saved = await readLatest(benchmark)
        const savedAt = saved === undefined ? NaN : Date.parse(saved.fetchedAt)
        if (saved !== undefined && Number.isFinite(savedAt) && now - savedAt < FRESH_SNAPSHOT_MS) {
          lastView.set(benchmark, saved)
          respond(res, 200, {
            ok: true,
            fresh: true,
            throttled: true,
            fetchedAt: saved.fetchedAt,
            data: saved,
          })
          return
        }
      } else {
        // Snapshot-served view: memory was left cold, so window it too.
        const currentAt = Date.parse(current.fetchedAt)
        if (Number.isFinite(currentAt) && now - currentAt < FRESH_SNAPSHOT_MS) {
          respond(res, 200, {
            ok: true,
            fresh: true,
            throttled: true,
            fetchedAt: current.fetchedAt,
            data: current,
          })
          return
        }
      }
    }

    try {
      const { view, upstreamHits } = await buildViewModel(benchmark, currentDefaultModel(), bypass ? ensureBypass : ensure)
      lastView.set(benchmark, view)
      void persist(view).catch((error: unknown) => {
        console.error(`[${name}] snapshot persist failed:`, error)
      })
      respond(res, 200, {
        ok: true,
        fresh: true,
        throttled: upstreamHits === 0 || undefined,
        fetchedAt: view.fetchedAt,
        data: view,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`[${name}] refresh failed (${benchmark}):`, message)
      const last = lastView.get(benchmark) ?? (await readLatest(benchmark))
      if (last !== undefined) {
        respond(res, 200, { ok: true, fresh: false, stale: true, notice: message, fetchedAt: last.fetchedAt, data: last })
      } else {
        respond(res, 502, { ok: false, error: message })
      }
    }
  }

  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE_PREFIX,
        handler: (req, res) => {
          void (async () => {
            try {
              const url = new URL(req.url ?? '/', 'http://dsh.local')
              if (req.method !== 'GET') {
                respond(res, 405, { ok: false, error: 'method not allowed' })
              } else if (url.pathname === `${ROUTE_PREFIX}/api/data`) {
                await handleData(url, res)
              } else if (url.pathname === `${ROUTE_PREFIX}/api/health`) {
                respond(res, 200, { ok: true })
              } else {
                respond(res, 404, { ok: false, error: 'not found' })
              }
            } catch (error) {
              console.error(`[${name}] route handler failed:`, error)
              if (!res.headersSent) respond(res, 500, { ok: false, error: 'internal error' })
            }
          })()
        },
      }),
    `${name}: api routes`,
  )
}
