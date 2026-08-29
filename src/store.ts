/**
 * RadarDataStore — the deep data-coordination module behind the /model-radar
 * route (docs/adr/0001-host-proxy-fetch.md, docs/adr/0002-freshness-window.md).
 *
 * Everything the data response depends on is coordinated here, behind one
 * interface (`get`): per-dataset freshness windows, single-flight upstream
 * fetches, the wholesale fast paths (memory view + persisted snapshot), the
 * stale fallback on upstream failure, and per-channel snapshot commit
 * ordering — a live-refresh response resolves only after its own snapshot
 * commit completes, and commits for one channel are serialized in assembly
 * order, so disk never ends up older than the views already served.
 * `src/index.ts` is deliberately a thin HTTP adapter around this module.
 *
 * Ports:
 * - RadarUpstream: the true-external upstream. Adapters own URLs and HTTP;
 *   payloads arrive raw — the loose schema tolerance below is implementation.
 * - SnapshotStore: local-substitutable persistence (latest-<benchmark>.json
 *   plus the content-deduped iq-timeline.jsonl append). Production adapter:
 *   filesystem, in src/index.ts; tests: in-memory stand-ins.
 * - Clock: injectable so freshness windows are deterministically testable
 *   without real time.
 */
import type { RadarChannel, RadarResponse, RadarTier, RadarView } from './contract.ts'

/** Host log tag (kept local to avoid an import cycle with src/index.ts). */
const LOG = 'dsh-models-radar'

/**
 * Freshness windows per upstream dataset (docs/adr/0002-freshness-window.md):
 * data served inside its window costs zero upstream hits; beyond it the
 * dataset is refetched on the next trigger. An explicit manual refresh
 * (`bypass`) ignores the windows. Windows are hardcoded — no user setting.
 */
const FRESH_BENCHMARKS_MS = 60 * 60_000 // channel list: near-static
const FRESH_EFFICIENCY_MS = 15 * 60_000 // overview + capability readout
const FRESH_LEADERBOARD_MS = 15 * 60_000 // per-task composition
const FRESH_HISTORY_MS = 60 * 60_000 // trend: upstream adds one point/hour
/** Wholesale cold-start window: a persisted snapshot this fresh is served without touching upstream. */
const FRESH_SNAPSHOT_MS = FRESH_EFFICIENCY_MS

/** Upstream dataset kinds; all but `benchmarks` are channel-scoped. */
export type DatasetKind = 'benchmarks' | 'eff' | 'hist' | 'lb'

/** The four upstream datasets of one channel, each with its freshness window. */
const channelDatasets = (
  benchmark: string,
): Array<{ key: string; kind: DatasetKind; windowMs: number }> => [
  { key: 'benchmarks', kind: 'benchmarks', windowMs: FRESH_BENCHMARKS_MS },
  { key: `eff:${benchmark}`, kind: 'eff', windowMs: FRESH_EFFICIENCY_MS },
  { key: `hist:${benchmark}`, kind: 'hist', windowMs: FRESH_HISTORY_MS },
  { key: `lb:${benchmark}`, kind: 'lb', windowMs: FRESH_LEADERBOARD_MS },
]

// ---------------------------------------------------------------------------
// Loose upstream faces: only the leaves this module actually reads. Anything
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
  token_samples?: number
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
interface DatasetEntry {
  at: number
  value: unknown
}

/** Result of one upstream flight, shared by every joining request. */
interface Flight {
  value: unknown
  at: number
  /** True for the request that started the fetch and for every joiner (unchanged observable semantics). */
  upstream: boolean
}

// ---------------------------------------------------------------------------
// Interface
// ---------------------------------------------------------------------------

/** One data request for one channel. `benchmark` must be validated by the caller (URL grammar). */
export interface RadarRequest {
  benchmark: string
  /** Manual refresh: ignores every freshness window but still joins in-flight fetches. */
  bypass: boolean
  /** The deployment's default model selection, resolved by the caller per request. */
  defaultModel?: RadarView['defaultModel']
}

/** True-external upstream port: fetch one raw dataset; adapters own URLs and HTTP. */
export interface RadarUpstream {
  fetchDataset(kind: DatasetKind, benchmark: string): Promise<unknown>
}

/**
 * Local-substitutable snapshot port. `read` resolves undefined when absent or
 * unreadable (it never rejects for expected I/O outcomes). `commit` overwrites
 * the channel snapshot and, when the caller passes a timeline line (content
 * changed), appends it to the long-history accumulator.
 */
export interface SnapshotStore {
  read(benchmark: string): Promise<RadarView | undefined>
  commit(benchmark: string, view: RadarView, timelineLine?: string): Promise<void>
}

export interface Clock {
  now(): number
}

export interface RadarDataStore {
  /**
   * The one entry point: returns exactly what the /api/data route responds —
   * the fixed RadarResponse union. Never rejects: upstream failure falls back
   * to the newest view (memory, then snapshot) as a stale payload, and only a
   * channel with no fallback at all returns the RadarFailure the route maps to
   * 502. A live-refresh response resolves only after its snapshot commit
   * completes; a failed commit is diagnostic and never fails the response.
   */
  get(request: RadarRequest): Promise<RadarResponse>
}

const num = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null

/** djb2 over the stable stringified form — timeline-append dedupe only. */
function djb2(text: string): string {
  let hash = 5381
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) + hash + text.charCodeAt(i)) >>> 0
  return hash.toString(36)
}

/**
 * Create the store. All coordination state (dataset cache, single-flight
 * map, last assembled views, timeline hashes, per-channel commit queues)
 * lives behind the returned interface.
 */
export function createRadarDataStore(
  upstream: RadarUpstream,
  snapshots: SnapshotStore,
  clock: Clock,
): RadarDataStore {
  /** Per-dataset freshness cache (docs/adr/0002-freshness-window.md); `benchmarks` is channel-global. */
  const datasets = new Map<string, DatasetEntry>()
  /** Single-flight: one upstream fetch per dataset key, whichever request started it. */
  const inflight = new Map<string, Promise<Flight>>()
  /** Last successfully assembled view per channel: wholesale fast path + failure fallback. */
  const lastView = new Map<string, RadarView>()
  /** Last committed timeline hash per benchmark (memory-only; restart may append one dup). */
  const lastHash = new Map<string, string>()
  /** Per-channel commit-queue tail: snapshot commits serialize in assembly order. */
  const commits = new Map<string, Promise<void>>()

  /**
   * Resolve one dataset within its freshness window. Fresh entries are served
   * from cache without touching upstream; stale/missing ones are fetched
   * (single-flight: concurrent requests share one upstream call, and a bypass
   * still joins an in-flight call instead of duplicating it).
   */
  const resolveDataset = async (
    key: string,
    kind: DatasetKind,
    benchmark: string,
    windowMs: number,
    bypass: boolean,
  ): Promise<Flight> => {
    const now = clock.now()
    const cached = datasets.get(key)
    if (!bypass && cached !== undefined && now - cached.at < windowMs) {
      return { value: cached.value, at: cached.at, upstream: false }
    }
    const pending = inflight.get(key)
    if (pending !== undefined) return pending
    const flight: Promise<Flight> = upstream
      .fetchDataset(kind, benchmark)
      .then((value) => {
        const at = clock.now()
        datasets.set(key, { at, value })
        return { value, at, upstream: true }
      })
      .finally(() => {
        inflight.delete(key)
      })
    inflight.set(key, flight)
    return flight
  }

  /**
   * Compose the view model for one benchmark channel from its four upstream
   * datasets. Each dataset resolves per its own freshness window, so an
   * expired dataset alone is refetched while fresh ones are reused from cache
   * — the view is a mixed assembly. `fetchedAt` is the oldest dataset moment
   * in the assembly, honestly reporting the view's data currency. Any failure
   * rejects — the caller falls back to the last snapshot wholesale, which
   * keeps "what the UI shows" always internally consistent.
   */
  const assemble = async (
    benchmark: string,
    defaultModel: RadarView['defaultModel'],
    bypass: boolean,
  ): Promise<{ view: RadarView; upstreamHits: number }> => {
    const flights = await Promise.all(
      channelDatasets(benchmark).map((dataset) =>
        resolveDataset(dataset.key, dataset.kind, benchmark, dataset.windowMs, bypass),
      ),
    )
    const bench = flights[0].value as UpBenchmarks
    const eff = flights[1].value as UpEfficiency
    const hist = flights[2].value as UpHistory
    const lb = flights[3].value as UpLeaderboard

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
        tokenSamples: num(point.token_samples) ?? 0,
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
      view: {
        benchmark,
        scoringMode: typeof eff.scoring_mode === 'string' ? eff.scoring_mode : undefined,
        scoreLabel: typeof eff.score_label === 'string' ? eff.score_label : '',
        fetchedAt: new Date(Math.min(...flights.map((flight) => flight.at))).toISOString(),
        sourceUpdatedAt: typeof eff.source_updated_at === 'string' ? eff.source_updated_at : undefined,
        defaultModel,
        channels,
        tiers,
        taskRates: Object.fromEntries(taskRates),
        series,
      },
      upstreamHits: flights.reduce((hits, flight) => hits + Number(flight.upstream), 0),
    }
  }

  /**
   * One durable commit: overwrite the channel snapshot always, and append one
   * hash-deduped iq-timeline line on content change. The hash is recorded
   * only after a successful commit, so a failed write is retried by the next
   * successful assembly.
   */
  const commitSnapshot = async (benchmark: string, view: RadarView): Promise<void> => {
    const iq: Record<string, number> = {}
    for (const tier of view.tiers) iq[tier.key] = tier.iq
    const hash = djb2(JSON.stringify(iq))
    if (lastHash.get(benchmark) === hash) {
      await snapshots.commit(benchmark, view)
      return
    }
    await snapshots.commit(benchmark, view, JSON.stringify({ ts: view.fetchedAt, b: benchmark, iq }))
    lastHash.set(benchmark, hash)
  }

  /**
   * Queue a snapshot commit on the channel's serialized tail and wait for it.
   * Committing in assembly order (and resolving the live-refresh response
   * only afterwards) is what keeps disk from regressing behind the views
   * already served — the previous fire-and-forget persist could interleave
   * writes out of order. A failed commit is diagnostic only: the in-memory
   * view stays authoritative and the next success retries the snapshot.
   */
  const enqueueCommit = async (benchmark: string, view: RadarView): Promise<void> => {
    const tail = commits.get(benchmark) ?? Promise.resolve()
    const commit = tail.then(() => commitSnapshot(benchmark, view))
    // The queue tail survives individual commit outcomes.
    commits.set(
      benchmark,
      commit.then(
        () => undefined,
        () => undefined,
      ),
    )
    try {
      await commit
    } catch (error) {
      console.error(`[${LOG}] snapshot commit failed:`, error)
    }
  }

  const readSnapshotSafe = async (benchmark: string): Promise<RadarView | undefined> => {
    try {
      return await snapshots.read(benchmark)
    } catch {
      return undefined
    }
  }

  const get = async ({ benchmark, bypass, defaultModel }: RadarRequest): Promise<RadarResponse> => {
    const now = clock.now()
    if (!bypass) {
      // Wholesale fast path: every dataset of this channel is still within its
      // window, so the last assembled view is served unchanged — zero upstream.
      const allFresh = channelDatasets(benchmark).every(({ key, windowMs }) => {
        const entry = datasets.get(key)
        return entry !== undefined && now - entry.at < windowMs
      })
      const current = lastView.get(benchmark)
      if (allFresh && current !== undefined) {
        return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current }
      }
      // Cold start (or no assembled view yet): a persisted snapshot within its
      // window serves wholesale — a fresh process restart costs no upstream.
      // A view that was itself served cold keeps serving within the window,
      // since a snapshot serve never populates the per-dataset cache.
      if (current === undefined) {
        const saved = await readSnapshotSafe(benchmark)
        const savedAt = saved === undefined ? NaN : Date.parse(saved.fetchedAt)
        if (saved !== undefined && Number.isFinite(savedAt) && now - savedAt < FRESH_SNAPSHOT_MS) {
          lastView.set(benchmark, saved)
          return { ok: true, fresh: true, throttled: true, fetchedAt: saved.fetchedAt, data: saved }
        }
      } else {
        // Snapshot-served view: memory was left cold, so window it too.
        const currentAt = Date.parse(current.fetchedAt)
        if (Number.isFinite(currentAt) && now - currentAt < FRESH_SNAPSHOT_MS) {
          return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current }
        }
      }
    }

    try {
      const { view, upstreamHits } = await assemble(benchmark, defaultModel, bypass)
      lastView.set(benchmark, view)
      await enqueueCommit(benchmark, view)
      return {
        ok: true,
        fresh: true,
        throttled: upstreamHits === 0 || undefined,
        fetchedAt: view.fetchedAt,
        data: view,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`[${LOG}] refresh failed (${benchmark}):`, message)
      const last = lastView.get(benchmark) ?? (await readSnapshotSafe(benchmark))
      if (last !== undefined) {
        return { ok: true, fresh: false, stale: true, notice: message, fetchedAt: last.fetchedAt, data: last }
      }
      return { ok: false, error: message }
    }
  }

  return { get }
}
