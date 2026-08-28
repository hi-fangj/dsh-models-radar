/**
 * dsh-models-radar host half: one same-origin prefix route (/model-radar) that
 * serves the browser client through the RadarDataStore coordination module
 * (src/store.ts). This file is deliberately a thin HTTP adapter: route
 * matching, benchmark-id validation, bypass parsing, the codexradar upstream
 * adapter (URLs + fetch), the filesystem snapshot adapter, and the
 * default-model service read. Freshness windows, single-flight, fallback and
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
import type { RadarView } from './contract.ts'
import { createRadarDataStore, type DatasetKind, type RadarUpstream, type SnapshotStore } from './store.ts'

/** Cordis plugin name (the Loader entry and client bundle id). */
export const name = 'dsh-models-radar'

/** Services required before load: only the browser HTTP carrier. */
export const inject = ['webServer']

const UPSTREAM = 'https://api.codexradar.com/api/v1'
const ROUTE_PREFIX = '/model-radar'
const FETCH_TIMEOUT_MS = 30_000

/** Upstream URL per dataset kind — the adapter's schema knowledge. */
const UPSTREAM_PATHS: Record<DatasetKind, (benchmark: string) => string> = {
  benchmarks: () => '/benchmarks',
  eff: (benchmark) => `/intelligence-efficiency?benchmark=${encodeURIComponent(benchmark)}`,
  hist: (benchmark) => `/iq-history?benchmark=${encodeURIComponent(benchmark)}`,
  lb: (benchmark) => `/leaderboard?benchmark=${encodeURIComponent(benchmark)}`,
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
    return (await response.json()) as unknown
  },
})

function dataDir(): string {
  const root = process.env.DSH_HOME ?? join(homedir(), '.dsh')
  return join(root, 'plugin-data', name)
}

const latestPath = (benchmark: string): string => join(dataDir(), `latest-${benchmark}.json`)

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
