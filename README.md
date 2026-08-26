# dsh-models-radar

[中文文档](README.zh.md)

A model capability radar plugin for the [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web GUI. It reads public benchmark data from [deng.codexradar.com](https://deng.codexradar.com), adds a **Model Capability** page to Settings, and shows the selected session model's live DeepSWE score below the composer.

## Features

- **Settings → Model Capability** through the additive `settings.section` slot
- **Capability overview** grouped by base model, with expandable reasoning-effort tiers
- **Fixed IQ scale (`0–110`)** and consistent capability bands across channels
- **Two benchmark channels**:
  - `deep-swe`: code-repair tasks, binary-majority scoring
  - `pompeii-adjacency`: visual reconstruction tasks, continuous Adjacency F1
- **Semantic task diagnostics**:
  - DeepSWE: passed / split vote / failed
  - Pompeii: low / general / good / excellent F1 bands
  - attention-first sorting and local filters
- **Seven-day IQ trend** with a smooth curve, solid translucent area, 24-hour delta, and seven-day low/average/high
- **Efficiency metrics**: IQ, average cost, average duration, cache hit rate, and 24-hour run count
- **Composer capability readout** beside the session price pill:
  - exact current `model@reasoningEffort` matching through DSH's official per-session model directory
  - current DeepSWE IQ
  - 24-hour delta
  - 48-hour sparkline
- **Automatic refresh** when the Settings page opens, plus a 60-second host-side throttle
- **Offline fallback** to the latest persisted snapshot when the upstream API is unavailable
- Chinese and English UI copy

## Requirements

- DeepSeek Harness Web GUI
- `dsh-super-injector` for runtime or persistent local installation
- Node.js 22 or newer
- npm

## Install from Source

Clone and build the plugin:

```bash
git clone https://github.com/hi-fangj/dsh-models-radar.git
cd dsh-models-radar
npm ci
npm run build
```

The build produces:

- `lib/index.js`: Host ESM bundle
- `lib/client.js`: browser CJS bundle wrapped in the DSH `ModuleLoader` handshake

### Runtime Injection

Runtime injection is the fastest way to try the plugin. In a DSH session, ask the Agent to call:

```text
dev_inject_plugin({
  "dir": "/absolute/path/to/dsh-models-radar"
})
```

Then refresh `http://127.0.0.1:3080` once. Runtime injection remains active until the DSH process restarts or the plugin is uninjected.

### Persistent Installation

To add the package to the `web` profile's dependencies and bundle list, ask the Agent to call:

```text
dev_install_package({
  "dir": "/absolute/path/to/dsh-models-radar",
  "profile": "web"
})
```

Refresh the Web GUI after installation. The package will be assembled again from the profile after a DSH restart.

## Usage

### Capability Page

1. Open **Settings** in the lower-left corner of the DSH Web GUI.
2. Select **Model Capability**.
3. Choose `DeepSWE` or `Pompeii` at the top.
4. Select a model tier from the overview or tier selector.

The page refreshes automatically on open. Clicking a row in the overview changes the model tier used by the metrics, trend, and task diagnostics below it.

### Capability Overview

Each base model is represented by its strongest tier. Expand a row to inspect all available reasoning-effort tiers. IQ bars use an absolute `0–110` scale:

| IQ | Band |
| --- | --- |
| `< 70` | Needs improvement |
| `70–84.9` | General |
| `85–94.9` | Steady |
| `95–99.9` | Excellent |
| `≥ 100` | Leading |

### Task Diagnostics

DeepSWE uses the benchmark's real majority-vote result. Pompeii keeps its continuous F1 semantics. Filters and counts are computed locally; no extra API request is made when changing filters.

### Composer Readout

The compact pill below the composer follows the model selected for the session's **next request**, not merely the most recently completed response. It displays:

```text
SWE IQ 90.2   ↑ +1.4   [48h sparkline]
```

Matching behavior:

1. Exact `model@reasoningEffort` match
2. Best tier of the same base model, prefixed with `≈`
3. Hidden when the base model does not exist in the DeepSWE leaderboard

The readout updates immediately when the composer model changes. Benchmark data refreshes every 60 seconds; a failed refresh keeps the last successful value.

## Update

```bash
cd /absolute/path/to/dsh-models-radar
git pull
npm ci
npm run build
```

For a runtime-injected package, ask the Agent to reload it:

```text
dev_reload_package({
  "packageName": "dsh-models-radar"
})
```

Refresh the page if the client dependency graph changed.

## Uninstall

For a runtime-injected package:

```text
dev_uninject_plugin({
  "match": "dsh-models-radar"
})
```

For a persistent profile installation, remove `dsh-models-radar` through your profile/plugin manager and restart DSH. Snapshot data is intentionally retained under `~/.dsh/plugin-data/dsh-models-radar/`; remove that directory separately only when its history is no longer needed.

## Data and Privacy

The plugin reads unauthenticated public endpoints from `https://api.codexradar.com/api/v1`:

- `/benchmarks`
- `/intelligence-efficiency`
- `/iq-history`
- `/leaderboard`

The browser does not contact the upstream API directly. `api.codexradar.com` only allows selected browser origins through CORS, so the Host half proxies the request through the same-origin endpoint `/model-radar/api/data`. See [ADR-0001](docs/adr/0001-host-proxy-fetch.md).

The plugin:

- does not request credentials or tokens
- does not submit benchmark results
- does not send conversation content
- stores only public benchmark snapshots locally

Snapshot files:

```text
~/.dsh/plugin-data/dsh-models-radar/
├── latest-deep-swe.json
├── latest-pompeii-adjacency.json
└── iq-timeline.jsonl
```

## Architecture

```text
Browser
  ├── settings.section → Model Capability page
  ├── conversation.composer.dock → live session capability pill
  └── GET /model-radar/api/data
            │
            ▼
Host plugin
  ├── 60-second per-channel memory cache
  ├── parallel public API reads
  ├── RadarView normalization
  └── local snapshot persistence
```

The composer readout subscribes to DSH's official `modelDirectories` per-session store, so model changes propagate without polling the model-selection state.

## Development

```bash
npm ci
npm run build
```

Useful DSH development operations:

```text
dev_inject_plugin({ "dir": "/absolute/path/to/dsh-models-radar" })
dev_reload_package({ "packageName": "dsh-models-radar" })
dev_uninject_plugin({ "match": "dsh-models-radar" })
```

Primary source files:

- `src/index.ts`: Host proxy, refresh throttle, and snapshots
- `src/client/RadarSection.tsx`: Settings page state and composition
- `src/client/Overview.tsx`: capability overview
- `src/client/charts.tsx`: trend and task diagnostics
- `src/client/LiveCapability.tsx`: composer capability readout
- `src/client/ScrollFrame.tsx`: persistent overflow scrollbar
- `src/client/scoreMetrics.ts`: IQ bands and trend semantics
- `CONTEXT.md`: project domain language

## Troubleshooting

### The Model Capability tab is missing

1. Confirm `npm run build` produced `lib/client.js`.
2. Confirm the plugin is active with `dev_plugin_status`.
3. Refresh the Web GUI once to load the latest client graph.

### The composer capability pill is missing

- Confirm the selected model exists in the DeepSWE leaderboard.
- A base-model fallback is shown with `≈`; an entirely unknown base model is hidden by design.
- Confirm the official model-selection UI plugin is active.

### Upstream refresh failed

The Settings page shows the latest stored snapshot when one exists. Check network access to `api.codexradar.com`; no credential is required.

## License

[MIT](LICENSE)
