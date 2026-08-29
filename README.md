# dsh-models-radar

<h1 align="center">dsh-models-radar · Model Capability Radar</h1>

<p align="center"><b>Crowd-benchmarked capability scores from deng.codexradar.com, inside the DeepSeek Harness: overview, trend, and cost on one screen.</b></p>

<p align="center">
  <a href="./README.zh.md">中文文档</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#data-and-privacy">Data &amp; Privacy</a> ·
  <a href="#troubleshooting">Troubleshooting</a>
</p>

<p align="center">
  <a href="https://github.com/hi-fangj/dsh-models-radar/stargazers"><img src="https://img.shields.io/github/stars/hi-fangj/dsh-models-radar?style=flat-square" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License"></a>
  <img src="https://img.shields.io/badge/node-%E2%89%A522-blue?style=flat-square" alt="Node.js ≥ 22">
  <img src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-4d6bfe?style=flat-square" alt="DSH plugin">
</p>

A model capability radar plugin for the [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web GUI. It reads public benchmark data from [deng.codexradar.com](https://deng.codexradar.com), adds a **Model Radar** page to Settings, and shows the selected session model's live DeepSWE score below the composer.

## Screenshots

**Settings · capability overview** — best-effort-per-base ranking with per-row Harness attribution (Codex / DSH / ZCode / Grok / Kimi Code / Antigravity); click any row to switch the charts below to that tier.

![Settings · capability overview](docs/screenshots/settings-overview.png)

**Capability popover** — opened from the composer readout: cross-base comparison plus the current tier's details, with a live "current" mark following the session model.

![Capability popover](docs/screenshots/capability-popover.png)

## Highlights

- **Score attribution at a glance.** Every base-model row carries a Harness badge (Codex / DSH / ZCode / Grok / Kimi Code / Antigravity, site palette), and the tier selector options read `model · effort · harness`; unmatchable bases get no badge — never a guess.
- **Best-effort-per-base ranking.** The capability overview groups by base model with a fixed `0–110` absolute-scale magnitude bar and a 24h trend signal per row; expand a row for the base's full reasoning-effort ladder.
- **24h / 7d dual-window IQ trend.** Tab between two time windows, each independently scaled with its own full stats (net change, low, average, high); the curve is colored by capability band.
- **Cost × IQ from three angles.** Tabs for composite cost (the site's own 2.5×-price-for-1.35×-speed trade-off, normalized per chart), time cost, and price cost; color = base, shape = reasoning effort, same-base tiers joined by ladder lines. Upper-left = more efficient. Hovering surfaces the site's three-line reading: attribution (display name · billing · harness · effort), IQ with its pass/total, and the active metric with sample counts.
- **Live readout beside the composer.** Exact `model@reasoningEffort` matching through DSH's official per-session model directory, updating immediately on model switches; click it to open the capability popover for cross-base comparison.
- **Lightweight, credential-free, offline-tolerant.** The browser never hits upstream directly (same-origin host proxy), freshness windows mean zero upstream requests inside a window, the latest local snapshot serves as fallback, and no credentials are requested or submitted.

## Features

- **Settings → Model Radar** page through the additive `settings.section` slot
- A **Model Radar** card under Settings → Plugins → Configurable plugins through `settings.plugin.item` (the live-readout display switch, persisted in Host settings)
- **Capability overview** grouped by base model with expandable reasoning-effort tiers and per-row Harness attribution badges
- Fixed `0–110` IQ scale with consistent capability-band semantics across channels
- **Trend tabs**: last 24 hours / last 7 days, each independently y-scaled with full stats; the choice persists
- **Cost × IQ card**: composite / time / price tabs on a log x-axis, model filter chips synced across tabs, codex-run DSV4 bases hidden by default (site parity)
- Two benchmark channels:
  - `deep-swe`: code-repair tasks, binary-majority scoring
  - `pompeii-adjacency`: visual reconstruction tasks, continuous Adjacency F1
- Semantic task diagnostics:
  - DeepSWE: passed / split vote / failed
  - Pompeii: low / general / good / excellent F1 bands
  - attention-first sorting and local filters
- Efficiency metric badges: IQ, average cost, average duration, cache hit rate, 24-hour run count
- **Capability popover**: opened from the composer readout; cross-base comparison plus the viewed tier's full details (badges, dual-window trend, task composition)
- Refresh within freshness windows: overview & per-task composition 15 min, channel list & IQ trend 60 min; only expired datasets are refetched, everything else is served from cache (single-flight, zero upstream hits inside a window)
- Manual refresh button in the footer (skips the windows) next to the last-fetch timestamp
- Offline fallback to the latest persisted snapshot when the upstream API is unavailable
- Chinese and English UI copy

## Requirements

- DeepSeek Harness Web GUI
- `dsh-super-injector` for runtime or persistent local installation
- Node.js 22 or newer
- npm

## Install

### From Git

The simplest installation fetches the repository directly into the `web` profile:

```bash
dsh plugin --profile web add github:hi-fangj/dsh-models-radar
```

The equivalent full Git URL:

```bash
dsh plugin --profile web add git+https://github.com/hi-fangj/dsh-models-radar.git
```

The repository includes the built Host and browser bundles required by DSH, so direct Git installation does not run dependency lifecycle scripts and does not require a pnpm build allowlist. Refresh `http://127.0.0.1:3080` after installation; restart DSH once if the running process does not hot-load the new package.

To remove the Git-installed package:

```bash
dsh plugin --profile web remove dsh-models-radar
```

### From a local clone

To develop or modify the plugin, clone and build manually:

```bash
git clone https://github.com/hi-fangj/dsh-models-radar.git
cd dsh-models-radar
npm ci
npm run build
```

Build artifacts:

- `lib/index.js`: Host ESM bundle
- `lib/client.js`: browser CJS bundle with the DSH `ModuleLoader` handshake

After building, add the local package to the `web` profile:

```bash
dsh plugin --profile web add /absolute/path/to/dsh-models-radar
```

`dsh plugin` delegates dependency installation to the named profile, so the package lands in `~/.dsh/profiles/web`. The repository ships build artifacts for Git-based installs; after changing local sources, run `npm run build` before adding or reloading the local clone.

Refresh `http://127.0.0.1:3080` after installation. If the running DSH process does not hot-load the new package, restart DSH once and refresh again.

To remove a CLI-installed dependency:

```bash
dsh plugin --profile web remove dsh-models-radar
```

Restart DSH afterwards so the profile reassembles without the plugin.

### Runtime injection and persistent install

Runtime injection suits quick trials. Ask the Agent in a DSH session to call:

```text
dev_inject_plugin({
  "dir": "/absolute/path/to/dsh-models-radar"
})
```

Then refresh `http://127.0.0.1:3080` once. Injection lasts until the DSH process restarts or the plugin is unloaded explicitly.

To write the dependency and bundle list into the `web` profile, ask the Agent to call:

```text
dev_install_package({
  "dir": "/absolute/path/to/dsh-models-radar",
  "profile": "web"
})
```

Refresh the Web GUI afterwards. DSH re-assembles the plugin from the profile on restart.

## Usage

### The Model Radar page

1. Open **Settings** from the bottom-left of the DSH Web GUI.
2. Choose **Model Radar**.
3. Pick the `DeepSWE` or `Pompeii` channel at the top.
4. Select a model tier from the capability overview or the tier selector.

Every page activation refreshes within the freshness windows: cached data costs no upstream requests and only expired datasets are refetched. Clicking any overview row switches the tier used by the efficiency badges, trend, and task diagnostics below.

### Capability overview

Each base model shows its currently strongest tier by default; expanding a row reveals the full reasoning-effort ladder. The IQ progress bar uses a fixed `0–110` absolute scale:

| IQ | Capability band |
| --- | --- |
| `< 70` | Developing |
| `70–84.9` | General |
| `85–94.9` | Steady |
| `95–99.9` | Excellent |
| `≥ 100` | Leader |

### IQ trend

The last-24h and last-7d tabs are time-sliced views of the same hourly series, each with its own y-axis scaling and full stats (net change, low, average, high). The curve is colored by capability band with a matching translucent area fill; endpoint and hover markers use the band color.

### Cost × IQ comparison

Three tabs (composite / time / price) plot every tier on a log cost axis × linear IQ axis: color = base model (site palette), shape = reasoning effort (off=× · low=○ · medium=△ · high=□ · xhigh=◇ · max=⬡ · ultra=★), same-base tiers joined by ladder lines in effort order. **Upper-left = more efficient.** The model chip row multi-selects, synced across the active tab; the codex-run DSV4 bases are hidden by default, matching the site.

### Task diagnostics

DeepSWE uses the upstream's real majority-vote verdicts; Pompeii keeps continuous F1 semantics. Filtering, counting, and sorting all happen locally in the browser — switching filters adds no API requests.

### Capability popover

Click the capability capsule below the composer to open the popover: a full base overview (for comparison) on top and the viewed tier's details below (efficiency badges, dual-window trend, task composition). The viewed tier follows the session model by default; clicking an overview row or using the trend card's tier selector views another tier temporarily until the session model changes or the popover closes.

### The composer capability capsule

The compact capsule reads the model selected for the session's **next request**, not a guess from the last completed reply. Display:

```text
SWE IQ 90.2   ↑ +1.4
```

Match order:

1. Exact `model@reasoningEffort` match
2. The same base model's highest-IQ tier, prefixed with `≈`
3. Hidden entirely when the base is absent from the DeepSWE leaderboard

Switching models in the composer updates the capsule immediately. The readout polls the host every 15 minutes (the shortest freshness window) — one local request per tick and at most one upstream fetch per channel per window; on failure the last successful value is kept.

Prefer no capsule by the composer? The「Show live capability readout」switch on the **Model Radar** card under **Settings → Plugins → Configurable plugins** hides it entirely; while hidden the capsule renders nothing and stops background polling. The preference persists in Host settings (shared across browsers, immune to clearing browser storage; a legacy localStorage choice is migrated once on upgrade).

## Update

```bash
cd /absolute/path/to/dsh-models-radar
git pull
npm ci
npm run build
```

For runtime-injected plugins, ask the Agent to hot-reload:

```text
dev_reload_package({
  "packageName": "dsh-models-radar"
})
```

Refresh the page if the client dependency graph changed.

## Uninstall

Unload a runtime-injected plugin:

```text
dev_uninject_plugin({
  "match": "dsh-models-radar"
})
```

For persistently installed plugins, remove `dsh-models-radar` through the profile / plugin manager, then restart DSH. Snapshot history stays in `~/.dsh/plugin-data/dsh-models-radar/`; delete that directory separately only if you no longer want the history.

## Data and privacy

The plugin reads public, unauthenticated endpoints of `https://api.codexradar.com/api/v1`:

- `/benchmarks`
- `/intelligence-efficiency`
- `/iq-history`
- `/leaderboard`

The browser never calls the upstream API directly. Because `api.codexradar.com` allowlists browser origins, the host half proxies requests through the same-origin route `/model-radar/api/data`. See [ADR-0001](docs/adr/0001-host-proxy-fetch.md) for the rationale.

This plugin:

- never requests passwords, tokens, or other credentials
- never submits benchmark results
- never sends session content
- stores only public benchmark snapshots locally

Snapshot directory:

```text
~/.dsh/plugin-data/dsh-models-radar/
├── latest-deep-swe.json
├── latest-pompeii-adjacency.json
└── iq-timeline.jsonl
```

## Architecture

```text
Browser
  ├── settings.section → Model Radar page
  ├── settings.plugin.item → plugin-configuration card (live-readout display switch)
  ├── conversation.composer.dock → session capability capsule + popover
  ├── GET /model-radar/api/data
  └── GET/POST /model-radar/api/pref
            │
            ▼
Host plugin
  ├── per-dataset freshness windows (efficiency/tasks 15 min, channels/trend 60 min)
  ├── single-flight upstream requests + channel-global benchmarks cache
  ├── normalization into RadarView
  ├── settings namespace dsh-models-radar (live-readout preference, persisted in Host settings)
  └── local snapshot persistence (served within its window across restarts)
```

The capability capsule subscribes to DSH's official `modelDirectories` per-session store, so model switches propagate without polling.

## Development

```bash
npm ci
npm run build
```

GitHub Actions runs a build check on every push/PR; pushing a `v*` tag automatically builds, packs, and publishes a GitHub Release with the tgz attached. The release flow:

```bash
# after bumping the version in package.json and committing:
git tag v0.1.x
git push origin main --tags
```

Common DSH development operations:

```text
dev_inject_plugin({ "dir": "/absolute/path/to/dsh-models-radar" })
dev_reload_package({ "packageName": "dsh-models-radar" })
dev_uninject_plugin({ "match": "dsh-models-radar" })
```

Main sources:

- `src/index.ts`: host proxy, refresh throttling, snapshots
- `src/client/RadarSection.tsx`: settings-page state and composition
- `src/client/Overview.tsx`: capability overview
- `src/client/charts.tsx`: trend charts and task diagnostics
- `src/client/costScatter.tsx`: cost × IQ comparison scatter
- `src/client/harness.ts`: harness attribution and tier-selector labels
- `src/client/LiveCapability.tsx`: composer readout and popover
- `src/client/ScrollFrame.tsx`: scrollbar for overflowing lists
- `src/client/scoreMetrics.ts`: IQ bands and trend semantics
- `CONTEXT.md`: the project's domain vocabulary

## Docs

| Doc | Contents |
| --- | --- |
| [ADR-0001](docs/adr/0001-host-proxy-fetch.md) | Why the browser never hits upstream directly (host proxy) |
| [ADR-0002](docs/adr/0002-freshness-window.md) | Per-dataset freshness-window refresh throttling |
| [CONTEXT.md](CONTEXT.md) | Domain glossary (model tier, harness, trend, …) |

## Troubleshooting

### No Model Radar tab in Settings

1. Make sure `npm run build` produced `lib/client.js`.
2. Use `dev_plugin_status` to confirm the plugin is active.
3. Refresh the Web GUI once to load the latest client dependency graph.

### No capability capsule below the composer

- Make sure the current model exists on the DeepSWE leaderboard.
- Same-base fallback shows `≈`; a fully unknown base is hidden by design.
- Make sure the official model-selection UI plugin is enabled.

### Upstream refresh failures

With snapshot history present, the settings page shows the last successful data. Check network reachability of `api.codexradar.com`; the API needs no credentials.

## License

[MIT](LICENSE)
