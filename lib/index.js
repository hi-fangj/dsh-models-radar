// src/index.ts
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
var name = "dsh-models-radar";
var inject = ["webServer"];
var UPSTREAM = "https://api.codexradar.com/api/v1";
var ROUTE_PREFIX = "/model-radar";
var THROTTLE_MS = 6e4;
var FETCH_TIMEOUT_MS = 3e4;
var num = (value) => typeof value === "number" && Number.isFinite(value) ? value : null;
function djb2(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) hash = (hash << 5) + hash + text.charCodeAt(i) >>> 0;
  return hash.toString(36);
}
function dataDir() {
  const root = process.env.DSH_HOME ?? join(homedir(), ".dsh");
  return join(root, "plugin-data", name);
}
async function fetchJson(pathAndQuery) {
  const response = await fetch(UPSTREAM + pathAndQuery, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });
  if (!response.ok) throw new Error(`upstream ${pathAndQuery} \u2192 HTTP ${response.status}`);
  return await response.json();
}
async function buildViewModel(benchmark, defaultModel) {
  const encoded = encodeURIComponent(benchmark);
  const [bench, eff, hist, lb] = await Promise.all([
    fetchJson("/benchmarks"),
    fetchJson(`/intelligence-efficiency?benchmark=${encoded}`),
    fetchJson(`/iq-history?benchmark=${encoded}`),
    fetchJson(`/leaderboard?benchmark=${encoded}`)
  ]);
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
    benchmark,
    scoringMode: typeof eff.scoring_mode === "string" ? eff.scoring_mode : void 0,
    scoreLabel: typeof eff.score_label === "string" ? eff.score_label : "",
    fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
    sourceUpdatedAt: typeof eff.source_updated_at === "string" ? eff.source_updated_at : void 0,
    defaultModel,
    channels,
    tiers,
    taskRates: Object.fromEntries(taskRates),
    series
  };
}
function apply(ctx) {
  const memo = /* @__PURE__ */ new Map();
  const lastHash = /* @__PURE__ */ new Map();
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
  const latestPath = (benchmark) => join(dataDir(), `latest-${benchmark}.json`);
  async function readLatest(benchmark) {
    try {
      return JSON.parse(await readFile(latestPath(benchmark), "utf8"));
    } catch {
      return void 0;
    }
  }
  async function persist(view) {
    await mkdir(dataDir(), { recursive: true });
    await writeFile(latestPath(view.benchmark), JSON.stringify(view), "utf8");
    const iq = {};
    for (const tier of view.tiers) iq[tier.key] = tier.iq;
    const hash = djb2(JSON.stringify(iq));
    if (lastHash.get(view.benchmark) !== hash) {
      lastHash.set(view.benchmark, hash);
      await appendFile(
        join(dataDir(), "iq-timeline.jsonl"),
        `${JSON.stringify({ ts: view.fetchedAt, b: view.benchmark, iq })}
`,
        "utf8"
      );
    }
  }
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
    const cached = memo.get(benchmark);
    const now = Date.now();
    if (cached !== void 0 && now - cached.at < THROTTLE_MS) {
      respond(res, 200, {
        ok: true,
        fresh: true,
        throttled: true,
        fetchedAt: new Date(cached.at).toISOString(),
        data: cached.view
      });
      return;
    }
    try {
      const view = await buildViewModel(benchmark, currentDefaultModel());
      memo.set(benchmark, { at: now, view });
      void persist(view).catch((error) => {
        console.error(`[${name}] snapshot persist failed:`, error);
      });
      respond(res, 200, { ok: true, fresh: true, fetchedAt: view.fetchedAt, data: view });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[${name}] refresh failed (${benchmark}):`, message);
      const last = cached?.view ?? await readLatest(benchmark);
      if (last !== void 0) {
        respond(res, 200, { ok: true, fresh: false, stale: true, notice: message, fetchedAt: last.fetchedAt, data: last });
      } else {
        respond(res, 502, { ok: false, error: message });
      }
    }
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
