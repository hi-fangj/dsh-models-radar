/**
 * dsh-models-radar host half: one same-origin prefix route (/model-radar) that
 * serves the browser client through the RadarDataStore coordination module
 * (src/store.ts). This file is deliberately a thin HTTP adapter: route
 * matching, benchmark-id validation, bypass parsing, the codexradar upstream
 * adapter (URLs + fetch), the filesystem snapshot adapter, and the
 * default-model service read. The settings namespace `dsh-models-radar` (the
 * composer live-readout display preference) is registered here too and edited over the
 * same-origin pref routes. Freshness windows, single-flight, fallback and
 * snapshot-commit ordering all live in the store.
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
import z from '@deepseek-ai/schemastery'
import type { CommunityRatings, RadarView, RatingsWindow } from './contract.ts'
import { createRadarDataStore, type DatasetKind, type RadarUpstream, type SnapshotStore } from './store.ts'

/** Cordis plugin name (the Loader entry and client bundle id). */
export const name = 'dsh-models-radar'

/** Services required before load: the browser HTTP carrier and the settings capability. */
export const inject = ['webServer', 'settings']

const UPSTREAM = 'https://api.codexradar.com/api/v1'

/**
 * The community-ratings upstream is the codexradar main site, not the benchmark
 * API host above — /api/model-ratings only exists there (CONTEXT.md 社区体感分).
 * Same CORS regime (origin allowlist, no ACAO for our page), so it rides the
 * same host-side fetch discipline as ADR 0001.
 */
const UPSTREAM_RATINGS = 'https://codexradar.com'
const ROUTE_PREFIX = '/model-radar'
const FETCH_TIMEOUT_MS = 30_000

/**
 * Settings namespace serving the composer live-readout display preference. The value
 * must stay a lowercase kebab string (the dsh-settings namespace grammar) and
 * must equal the client pref card's slot key — the Plugins configuration tab
 * dispatches cards by pairing served namespaces with registered card keys.
 */
const RADAR_SETTINGS_NAMESPACE = 'dsh-models-radar'

/** Schema of the namespace: one boolean preference, shown by default. */
const RADAR_SETTINGS_SCHEMA = z.object({
  liveVisible: z.boolean().default(true),
})

/** Cap on the pref write body; one boolean field never needs more. */
const PREF_BODY_LIMIT_BYTES = 1024

/**
 * Structural face of the settings service this plugin registers through.
 * `@deepseek-ai/dsh-settings` is a deployment-internal package with no npm
 * artifact a workspace install can resolve, so the contract is mirrored
 * structurally (same shape as SettingsProvider.register's scope) and the
 * runtime service name `settings` comes from the inject declaration.
 */
interface RadarSettingsScope {
  /** Current resolved namespace value (schema default, then user layer). */
  get(): { liveVisible: boolean }
  /** Merge a partial patch into the user layer and persist it. */
  update(patch: object): Promise<void>
}

/** Upstream URL per dataset kind — the adapter's schema knowledge. */
const UPSTREAM_PATHS: Record<DatasetKind, (benchmark: string) => string> = {
  benchmarks: () => '/benchmarks',
  eff: (benchmark) => `/intelligence-efficiency?benchmark=${encodeURIComponent(benchmark)}`,
  hist: (benchmark) => `/iq-history?benchmark=${encodeURIComponent(benchmark)}`,
  lb: (benchmark) => `/leaderboard?benchmark=${encodeURIComponent(benchmark)}`,
  catalog: (benchmark) => `/table?ui=1&benchmark=${encodeURIComponent(benchmark)}`,
}

/** Production upstream adapter: host-side fetch (ADR 0001 — never the browser). */
const codexRadarUpstream = (): RadarUpstream => ({
  async fetchDataset(kind, benchmark) {
    const pathAndQuery = UPSTREAM_PATHS[kind](benchmark)
    const response = await fetch(UPSTREAM + pathAndQuery, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`upstream ${pathAndQuery} → HTTP ${response.status}`)
    const payload = (await response.json()) as unknown
    // The /table payload ships ~7MB of combos/cells next to its task catalog;
    // only the tasks array is kept, so the store's dataset cache never
    // retains the bulk of it.
    return kind === 'catalog' ? (payload as { tasks?: unknown }).tasks : payload
  },
  async fetchRatings(window) {
    const pathAndQuery = `/api/model-ratings?view=public&window=${encodeURIComponent(window)}`
    const response = await fetch(UPSTREAM_RATINGS + pathAndQuery, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`upstream ${pathAndQuery} → HTTP ${response.status}`)
    return (await response.json()) as unknown
  },
})

function dataDir(): string {
  const root = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(root, 'plugin-data', name)
}

const latestPath = (benchmark: string): string => join(dataDir(), `latest-${benchmark}.json`)
const ratingsPath = (window: string): string => join(dataDir(), `latest-ratings-${window}.json`)

/**
 * Production snapshot adapter: filesystem mechanics only. Ordering, dedupe
 * and fallback policy live in the store; the timeline line arrives ready to
 * append (undefined when the content hash did not change).
 */
const fileSnapshotStore = (): SnapshotStore => ({
  async read(benchmark) {
    try {
      return JSON.parse(await readFile(latestPath(benchmark), 'utf8')) as RadarView
    } catch {
      return undefined
    }
  },
  async commit(benchmark, view, timelineLine) {
    await mkdir(dataDir(), { recursive: true })
    await writeFile(latestPath(benchmark), JSON.stringify(view), 'utf8')
    if (timelineLine !== undefined) {
      await appendFile(join(dataDir(), 'iq-timeline.jsonl'), `${timelineLine}\n`, 'utf8')
    }
  },
  async readRatings(window) {
    try {
      return JSON.parse(await readFile(ratingsPath(window), 'utf8')) as CommunityRatings
    } catch {
      return undefined
    }
  },
  async commitRatings(window, ratings) {
    await mkdir(dataDir(), { recursive: true })
    await writeFile(ratingsPath(window), JSON.stringify(ratings), 'utf8')
  },
})

/**
 * Mount the same-origin API routes on the web server.
 * @param ctx - host cordis context.
 */
export function apply(ctx: Context): void {
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

  const store = createRadarDataStore(codexRadarUpstream(), fileSnapshotStore(), { now: () => Date.now() })

  const respond = (res: import('node:http').ServerResponse, status: number, body: unknown): void => {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    })
    res.end(JSON.stringify(body))
  }

  /** HTTP adapter around the store: validate URL grammar, delegate, map status. */
  async function handleData(url: URL, res: import('node:http').ServerResponse): Promise<void> {
    const benchmark = url.searchParams.get('benchmark') ?? 'deep-swe'
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(benchmark)) {
      respond(res, 400, { ok: false, error: 'bad benchmark id' })
      return
    }
    const bypass = url.searchParams.get('bypass') === '1'
    const response = await store.get({ benchmark, bypass, defaultModel: currentDefaultModel() })
    respond(res, response.ok ? 200 : 502, response)
  }

  /** HTTP adapter for the ratings route: window validation, delegate, map status. */
  async function handleRatings(url: URL, res: import('node:http').ServerResponse): Promise<void> {
    const window = url.searchParams.get('window') ?? '7d'
    if (window !== '7d' && window !== '24h') {
      respond(res, 400, { ok: false, error: 'bad ratings window' })
      return
    }
    const bypass = url.searchParams.get('bypass') === '1'
    const response = await store.getRatings({ window: window as RatingsWindow, bypass })
    respond(res, response.ok ? 200 : 502, response)
  }

  /** Read one JSON body with the pref cap; rejects on oversize or broken JSON. */
  async function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
    const chunks: Buffer[] = []
    let total = 0
    for await (const chunk of req) {
      total += (chunk as Buffer).length
      if (total > PREF_BODY_LIMIT_BYTES) throw new Error('body too large')
      chunks.push(chunk as Buffer)
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
  }

  // Hard dependency: the pref card in the Plugins configuration tab only
  // dispatches for namespaces the settings service serves, so without it the
  // display preference has no surface and the plugin has nothing to say.
  const settings = ctx.get('settings') as
    | { register(ns: string, schema: unknown, options?: { applies?: 'live' | 'restart' }): RadarSettingsScope }
    | undefined
  if (settings === undefined) throw new Error(`[${name}] settings service unavailable`)
  const prefScope = settings.register(RADAR_SETTINGS_NAMESPACE, RADAR_SETTINGS_SCHEMA, { applies: 'live' })

  /** GET /api/pref: the committed display preference. */
  function handlePrefGet(res: import('node:http').ServerResponse): void {
    respond(res, 200, { ok: true, liveVisible: prefScope.get().liveVisible })
  }

  /** POST /api/pref: validate one boolean field, merge into the user layer, persist. */
  async function handlePrefPost(
    req: import('node:http').IncomingMessage,
    res: import('node:http').ServerResponse,
  ): Promise<void> {
    let payload: unknown
    try {
      payload = await readJsonBody(req)
    } catch {
      respond(res, 400, { ok: false, error: 'invalid JSON body' })
      return
    }
    const value = (payload as { liveVisible?: unknown } | null)?.liveVisible
    if (typeof value !== 'boolean') {
      respond(res, 400, { ok: false, error: 'liveVisible must be a boolean' })
      return
    }
    try {
      await prefScope.update({ liveVisible: value })
    } catch (cause) {
      respond(res, 500, { ok: false, error: cause instanceof Error ? cause.message : String(cause) })
      return
    }
    respond(res, 200, { ok: true, liveVisible: prefScope.get().liveVisible })
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
              if (url.pathname === `${ROUTE_PREFIX}/api/pref`) {
                if (req.method === 'GET') handlePrefGet(res)
                else if (req.method === 'POST') await handlePrefPost(req, res)
                else respond(res, 405, { ok: false, error: 'method not allowed' })
              } else if (req.method !== 'GET') {
                respond(res, 405, { ok: false, error: 'method not allowed' })
              } else if (url.pathname === `${ROUTE_PREFIX}/api/data`) {
                await handleData(url, res)
              } else if (url.pathname === `${ROUTE_PREFIX}/api/ratings`) {
                await handleRatings(url, res)
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
