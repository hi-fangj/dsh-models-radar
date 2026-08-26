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
/** Same data within this window is served from memory instead of upstream. */
const THROTTLE_MS = 60_000
const FETCH_TIMEOUT_MS = 30_000

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

interface CacheEntry {
  at: number
  view: RadarView
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

/**
 * Compose the view model for one benchmark channel from four upstream reads.
 * Any failure rejects — callers fall back to the stored snapshot wholesale,
 * which keeps "what the UI shows" always internally consistent.
 */
async function buildViewModel(benchmark: string, defaultModel: RadarView['defaultModel']): Promise<RadarView> {
  const encoded = encodeURIComponent(benchmark)
  const [bench, eff, hist, lb] = await Promise.all([
    fetchJson<UpBenchmarks>('/benchmarks'),
    fetchJson<UpEfficiency>(`/intelligence-efficiency?benchmark=${encoded}`),
    fetchJson<UpHistory>(`/iq-history?benchmark=${encoded}`),
    fetchJson<UpLeaderboard>(`/leaderboard?benchmark=${encoded}`),
  ])

  const channels: RadarChannel[] = (bench.benchmarks ?? [])
    .filter((b): b is typeof b & { id: string } => typeof b.id === 'string')
    .map((b) => ({
      id: b.id,
      title: typeof b.title === 'string' ? b.title : b.id,
      scoreLabel: typeof b.score_label === 'string' ? b.score_label : '',
      isDefault: b.default === true,
    }))

  // Tier key → per-task rows sorted by rate desc (then id, for stable order).
  const taskRates = new Map<string, Array<[string, number, boolean?]>>()
  for (const model of lb.models ?? []) {
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
  for (const point of eff.points ?? []) {
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
    const entries = hist[key] ?? hist[point.model]
    if (Array.isArray(entries) && entries.length > 0) {
      series[key] = entries
        .filter((e): e is typeof e & { ts: string } => typeof e.ts === 'string')
        .map((e) => [e.ts, num(e.score) ?? 0])
    }
  }
  tiers.sort((a, b) => b.iq - a.iq)

  return {
    benchmark,
    scoringMode: typeof eff.scoring_mode === 'string' ? eff.scoring_mode : undefined,
    scoreLabel: typeof eff.score_label === 'string' ? eff.score_label : '',
    fetchedAt: new Date().toISOString(),
    sourceUpdatedAt: typeof eff.source_updated_at === 'string' ? eff.source_updated_at : undefined,
    defaultModel,
    channels,
    tiers,
    taskRates: Object.fromEntries(taskRates),
    series,
  }
}

/**
 * Mount the same-origin API routes on the web server.
 * @param ctx - host cordis context.
 */
export function apply(ctx: Context): void {
  /** Per-benchmark in-memory throttle cache. */
  const memo = new Map<string, CacheEntry>()
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
    const cached = memo.get(benchmark)
    const now = Date.now()
    if (cached !== undefined && now - cached.at < THROTTLE_MS) {
      respond(res, 200, {
        ok: true,
        fresh: true,
        throttled: true,
        fetchedAt: new Date(cached.at).toISOString(),
        data: cached.view,
      })
      return
    }
    try {
      const view = await buildViewModel(benchmark, currentDefaultModel())
      memo.set(benchmark, { at: now, view })
      void persist(view).catch((error: unknown) => {
        console.error(`[${name}] snapshot persist failed:`, error)
      })
      respond(res, 200, { ok: true, fresh: true, fetchedAt: view.fetchedAt, data: view })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`[${name}] refresh failed (${benchmark}):`, message)
      const last = cached?.view ?? (await readLatest(benchmark))
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
