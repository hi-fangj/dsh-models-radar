// src/index.ts
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

// src/store.ts
var LOG = "dsh-models-radar";
var FRESH_BENCHMARKS_MS = 60 * 6e4;
var FRESH_EFFICIENCY_MS = 15 * 6e4;
var FRESH_LEADERBOARD_MS = 15 * 6e4;
var FRESH_HISTORY_MS = 60 * 6e4;
var FRESH_SNAPSHOT_MS = FRESH_EFFICIENCY_MS;
var channelDatasets = (benchmark) => [
  { key: "benchmarks", kind: "benchmarks", windowMs: FRESH_BENCHMARKS_MS },
  { key: `eff:${benchmark}`, kind: "eff", windowMs: FRESH_EFFICIENCY_MS },
  { key: `hist:${benchmark}`, kind: "hist", windowMs: FRESH_HISTORY_MS },
  { key: `lb:${benchmark}`, kind: "lb", windowMs: FRESH_LEADERBOARD_MS }
];
var num = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
function djb2(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) + hash + text.charCodeAt(i) >>> 0;
  return hash.toString(36);
}
function createRadarDataStore(upstream, snapshots, clock) {
  const datasets = /* @__PURE__ */ new Map();
  const inflight = /* @__PURE__ */ new Map();
  const lastView = /* @__PURE__ */ new Map();
  const lastHash = /* @__PURE__ */ new Map();
  const commits = /* @__PURE__ */ new Map();
  const resolveDataset = async (key, kind, benchmark, windowMs, bypass) => {
    const now = clock.now();
    const cached = datasets.get(key);
    if (!bypass && cached !== void 0 && now - cached.at < windowMs) {
      return { value: cached.value, at: cached.at, upstream: false };
    }
    const pending = inflight.get(key);
    if (pending !== void 0) return pending;
    const flight = upstream.fetchDataset(kind, benchmark).then((value) => {
      const at = clock.now();
      datasets.set(key, { at, value });
      return { value, at, upstream: true };
    }).finally(() => {
      inflight.delete(key);
    });
    inflight.set(key, flight);
    return flight;
  };
  const assemble = async (benchmark, defaultModel, bypass) => {
    const flights = await Promise.all(
      channelDatasets(benchmark).map(
        (dataset) => resolveDataset(dataset.key, dataset.kind, benchmark, dataset.windowMs, bypass)
      )
    );
    const bench = flights[0].value;
    const eff = flights[1].value;
    const hist = flights[2].value;
    const lb = flights[3].value;
    const channels = (bench.benchmarks ?? []).filter((b) => typeof b.id === "string").map((b) => ({
      id: b.id,
      title: typeof b.title === "string" ? b.title : b.id,
      scoreLabel: typeof b.score_label === "string" ? b.score_label : "",
      isDefault: b.default === true
    }));
    const taskRates = /* @__PURE__ */ new Map();
    for (const model of lb.models ?? []) {
      if (typeof model.model !== "string" || typeof model.effort !== "string") continue;
      const key = `${model.model}@${model.effort}`;
      const rows = Object.entries(model.tasks ?? {}).map(([taskId, task]) => [
        taskId,
        num(task.score_rate) ?? (task.majority_pass === true ? 1 : 0),
        typeof task.majority_pass === "boolean" ? task.majority_pass : void 0
      ]);
      rows.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      taskRates.set(key, rows);
    }
    const tiers = [];
    const series = {};
    for (const point of eff.points ?? []) {
      if (typeof point.model !== "string" || typeof point.effort !== "string") continue;
      const key = `${point.model}@${point.effort}`;
      const total = num(point.total) ?? 0;
      const passed = num(point.passed) ?? 0;
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
        runs24h: num(point.runs_24h) ?? 0
      });
      const entries = hist[key] ?? hist[point.model];
      if (Array.isArray(entries) && entries.length > 0) {
        series[key] = entries.filter((e) => typeof e.ts === "string").map((e) => [e.ts, num(e.score) ?? 0]);
      }
    }
    tiers.sort((a, b) => b.iq - a.iq);
    return {
      view: {
        benchmark,
        scoringMode: typeof eff.scoring_mode === "string" ? eff.scoring_mode : void 0,
        scoreLabel: typeof eff.score_label === "string" ? eff.score_label : "",
        fetchedAt: new Date(Math.min(...flights.map((flight) => flight.at))).toISOString(),
        sourceUpdatedAt: typeof eff.source_updated_at === "string" ? eff.source_updated_at : void 0,
        defaultModel,
        channels,
        tiers,
        taskRates: Object.fromEntries(taskRates),
        series
      },
      upstreamHits: flights.reduce((hits, flight) => hits + Number(flight.upstream), 0)
    };
  };
  const commitSnapshot = async (benchmark, view) => {
    const iq = {};
    for (const tier of view.tiers) iq[tier.key] = tier.iq;
    const hash = djb2(JSON.stringify(iq));
    if (lastHash.get(benchmark) === hash) {
      await snapshots.commit(benchmark, view);
      return;
    }
    await snapshots.commit(benchmark, view, JSON.stringify({ ts: view.fetchedAt, b: benchmark, iq }));
    lastHash.set(benchmark, hash);
  };
  const enqueueCommit = async (benchmark, view) => {
    const tail = commits.get(benchmark) ?? Promise.resolve();
    const commit = tail.then(() => commitSnapshot(benchmark, view));
    commits.set(
      benchmark,
      commit.then(
        () => void 0,
        () => void 0
      )
    );
    try {
      await commit;
    } catch (error) {
      console.error(`[${LOG}] snapshot commit failed:`, error);
    }
  };
  const readSnapshotSafe = async (benchmark) => {
    try {
      return await snapshots.read(benchmark);
    } catch {
      return void 0;
    }
  };
  const get = async ({ benchmark, bypass, defaultModel }) => {
    const now = clock.now();
    if (!bypass) {
      const allFresh = channelDatasets(benchmark).every(({ key, windowMs }) => {
        const entry = datasets.get(key);
        return entry !== void 0 && now - entry.at < windowMs;
      });
      const current = lastView.get(benchmark);
      if (allFresh && current !== void 0) {
        return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current };
      }
      if (current === void 0) {
        const saved = await readSnapshotSafe(benchmark);
        const savedAt = saved === void 0 ? NaN : Date.parse(saved.fetchedAt);
        if (saved !== void 0 && Number.isFinite(savedAt) && now - savedAt < FRESH_SNAPSHOT_MS) {
          lastView.set(benchmark, saved);
          return { ok: true, fresh: true, throttled: true, fetchedAt: saved.fetchedAt, data: saved };
        }
      } else {
        const currentAt = Date.parse(current.fetchedAt);
        if (Number.isFinite(currentAt) && now - currentAt < FRESH_SNAPSHOT_MS) {
          return { ok: true, fresh: true, throttled: true, fetchedAt: current.fetchedAt, data: current };
        }
      }
    }
    try {
      const { view, upstreamHits } = await assemble(benchmark, defaultModel, bypass);
      lastView.set(benchmark, view);
      await enqueueCommit(benchmark, view);
      return {
        ok: true,
        fresh: true,
        throttled: upstreamHits === 0 || void 0,
        fetchedAt: view.fetchedAt,
        data: view
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${LOG}] refresh failed (${benchmark}):`, message);
      const last = lastView.get(benchmark) ?? await readSnapshotSafe(benchmark);
      if (last !== void 0) {
        return { ok: true, fresh: false, stale: true, notice: message, fetchedAt: last.fetchedAt, data: last };
      }
      return { ok: false, error: message };
    }
  };
  return { get };
}

// src/index.ts
var name = "dsh-models-radar";
var inject = ["webServer"];
var UPSTREAM = "https://api.codexradar.com/api/v1";
var ROUTE_PREFIX = "/model-radar";
var FETCH_TIMEOUT_MS = 3e4;
var UPSTREAM_PATHS = {
  benchmarks: () => "/benchmarks",
  eff: (benchmark) => `/intelligence-efficiency?benchmark=${encodeURIComponent(benchmark)}`,
  hist: (benchmark) => `/iq-history?benchmark=${encodeURIComponent(benchmark)}`,
  lb: (benchmark) => `/leaderboard?benchmark=${encodeURIComponent(benchmark)}`
};
var codexRadarUpstream = () => ({
  async fetchDataset(kind, benchmark) {
    const pathAndQuery = UPSTREAM_PATHS[kind](benchmark);
    const response = await fetch(UPSTREAM + pathAndQuery, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) throw new Error(`upstream ${pathAndQuery} \u2192 HTTP ${response.status}`);
    return await response.json();
  }
});
function dataDir() {
  const root = process.env.DSH_HOME ?? join(homedir(), ".dsh");
  return join(root, "plugin-data", name);
}
var latestPath = (benchmark) => join(dataDir(), `latest-${benchmark}.json`);
var fileSnapshotStore = () => ({
  async read(benchmark) {
    try {
      return JSON.parse(await readFile(latestPath(benchmark), "utf8"));
    } catch {
      return void 0;
    }
  },
  async commit(benchmark, view, timelineLine) {
    await mkdir(dataDir(), { recursive: true });
    await writeFile(latestPath(benchmark), JSON.stringify(view), "utf8");
    if (timelineLine !== void 0) {
      await appendFile(join(dataDir(), "iq-timeline.jsonl"), `${timelineLine}
`, "utf8");
    }
  }
});
function apply(ctx) {
  const currentDefaultModel = () => {
    const service = ctx.get("agentDefaultModel");
    const pick = service?.currentSelection?.();
    if (pick === void 0 || typeof pick.model !== "string" || pick.model === "") return void 0;
    return {
      provider: typeof pick.provider === "string" ? pick.provider : "",
      model: pick.model,
      reasoningEffort: typeof pick.reasoningEffort === "string" ? pick.reasoningEffort : void 0
    };
  };
  const store = createRadarDataStore(codexRadarUpstream(), fileSnapshotStore(), { now: () => Date.now() });
  const respond = (res, status, body) => {
    res.writeHead(status, {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    });
    res.end(JSON.stringify(body));
  };
  async function handleData(url, res) {
    const benchmark = url.searchParams.get("benchmark") ?? "deep-swe";
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(benchmark)) {
      respond(res, 400, { ok: false, error: "bad benchmark id" });
      return;
    }
    const bypass = url.searchParams.get("bypass") === "1";
    const response = await store.get({ benchmark, bypass, defaultModel: currentDefaultModel() });
    respond(res, response.ok ? 200 : 502, response);
  }
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: ROUTE_PREFIX,
      handler: (req, res) => {
        void (async () => {
          try {
            const url = new URL(req.url ?? "/", "http://dsh.local");
            if (req.method !== "GET") {
              respond(res, 405, { ok: false, error: "method not allowed" });
            } else if (url.pathname === `${ROUTE_PREFIX}/api/data`) {
              await handleData(url, res);
            } else if (url.pathname === `${ROUTE_PREFIX}/api/health`) {
              respond(res, 200, { ok: true });
            } else {
              respond(res, 404, { ok: false, error: "not found" });
            }
          } catch (error) {
            console.error(`[${name}] route handler failed:`, error);
            if (!res.headersSent) respond(res, 500, { ok: false, error: "internal error" });
          }
        })();
      }
    }),
    `${name}: api routes`
  );
}
export {
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
