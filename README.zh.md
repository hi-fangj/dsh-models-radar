# dsh-models-radar

[English documentation](README.md)

面向 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web GUI 的模型能力雷达插件。插件读取 [deng.codexradar.com](https://deng.codexradar.com) 的公开众测数据，在设置页增加「模型能力」页面，并在输入框下方显示当前 session 所选模型的 DeepSWE 实时能力读数。

## 功能

- 通过 `settings.section` 扩展点增加 **设置 → 模型能力** 页面
- 按基座模型聚合的**能力总览**，可展开查看所有推理力度档位
- 使用固定 `0–110` IQ 刻度，跨频道保持一致的能力等级语义
- 支持两个评测频道：
  - `deep-swe`：代码修复任务，binary-majority 多数票评分
  - `pompeii-adjacency`：视觉恢复任务，连续 Adjacency F1 评分
- 语义化任务诊断：
  - DeepSWE：通过 / 投票分歧 / 失败
  - Pompeii：较低 / 一般 / 良好 / 优秀
  - 待关注任务优先排序与本地筛选
- 七天 IQ 趋势：平滑曲线、低透明度实色面积、24h 变化、七天最低/平均/最高
- 效率指标：IQ、平均费用、平均耗时、缓存命中率、24h 运行数
- 在会话价格胶囊旁显示**当前 session 能力读数**：
  - 通过 DSH 官方 per-session 模型目录精确匹配 `model@reasoningEffort`
  - 当前 DeepSWE IQ
  - 24h 变化
  - 48h 微型趋势图
- 打开设置页自动刷新，Host 侧 60 秒节流
- 上游不可用时自动使用最近一次本地快照
- 中英文 UI 文案

## 环境要求

- DeepSeek Harness Web GUI
- `dsh-super-injector`，用于运行时注入或持久安装本地插件
- Node.js 22 或更高版本
- npm

## 从源码安装

克隆并构建插件：

```bash
git clone https://github.com/hi-fangj/dsh-models-radar.git
cd dsh-models-radar
npm ci
npm run build
```

构建产物：

- `lib/index.js`：Host ESM bundle
- `lib/client.js`：带 DSH `ModuleLoader` 握手的浏览器 CJS bundle

### 运行时注入

运行时注入适合快速试用。在 DSH 会话中让 Agent 调用：

```text
dev_inject_plugin({
  "dir": "/插件绝对路径/dsh-models-radar"
})
```

随后刷新一次 `http://127.0.0.1:3080`。运行时注入会保持到 DSH 进程重启，或主动卸载插件为止。

### 持久安装

如需写入 `web` profile 的依赖和 bundle 列表，让 Agent 调用：

```text
dev_install_package({
  "dir": "/插件绝对路径/dsh-models-radar",
  "profile": "web"
})
```

安装后刷新 Web GUI。DSH 重启时会再次从 profile 装配该插件。

## 使用方法

### 模型能力页面

1. 打开 DSH Web GUI 左下角的**设置**。
2. 选择**模型能力**。
3. 在页面顶部选择 `DeepSWE` 或 `Pompeii`。
4. 从能力总览或档位选择器中选择模型档位。

页面每次打开都会自动刷新。点击总览中的任意行，会同步切换下方效率指标、趋势图和任务诊断所使用的档位。

### 能力总览

默认每个基座模型显示当前最强档位；展开一行可查看该基座全部推理力度。IQ 进度条使用固定 `0–110` 绝对刻度：

| IQ | 能力等级 |
| --- | --- |
| `< 70` | 待提升 |
| `70–84.9` | 一般 |
| `85–94.9` | 稳健 |
| `95–99.9` | 优秀 |
| `≥ 100` | 领先 |

### 任务诊断

DeepSWE 使用上游真实的多数票判定；Pompeii 保留连续 F1 语义。筛选、计数和排序全部在浏览器本地完成，切换筛选不会增加 API 请求。

### 输入框下方能力胶囊

紧凑能力胶囊读取的是当前 session **下一次请求**选中的模型，而不是仅根据最近一次已完成回复推测。显示形式：

```text
SWE IQ 90.2   ↑ +1.4   [48h 微型趋势]
```

匹配顺序：

1. 精确匹配 `model@reasoningEffort`
2. 匹配同一基座模型的最高 IQ 档位，并在分数前显示 `≈`
3. DeepSWE 榜单中完全没有该基座时隐藏胶囊

在 composer 中切换模型后，胶囊立即更新。评测数据每 60 秒刷新；刷新失败时保留最近一次成功值。

## 更新

```bash
cd /插件绝对路径/dsh-models-radar
git pull
npm ci
npm run build
```

运行时注入的插件可让 Agent 热重载：

```text
dev_reload_package({
  "packageName": "dsh-models-radar"
})
```

如果 client 依赖图发生变化，请刷新页面。

## 卸载

卸载运行时注入的插件：

```text
dev_uninject_plugin({
  "match": "dsh-models-radar"
})
```

持久安装的插件请通过 profile/plugin manager 移除 `dsh-models-radar`，然后重启 DSH。快照历史会保留在 `~/.dsh/plugin-data/dsh-models-radar/`；仅在确认不再需要历史时单独删除该目录。

## 数据与隐私

插件读取 `https://api.codexradar.com/api/v1` 的公开免认证接口：

- `/benchmarks`
- `/intelligence-efficiency`
- `/iq-history`
- `/leaderboard`

浏览器不会直接访问上游 API。由于 `api.codexradar.com` 使用浏览器 Origin 白名单，Host 半通过同源接口 `/model-radar/api/data` 代理请求。设计原因见 [ADR-0001](docs/adr/0001-host-proxy-fetch.md)。

本插件：

- 不请求密码、Token 或其他凭据
- 不提交评测结果
- 不发送会话内容
- 本地只保存公开评测数据快照

快照目录：

```text
~/.dsh/plugin-data/dsh-models-radar/
├── latest-deep-swe.json
├── latest-pompeii-adjacency.json
└── iq-timeline.jsonl
```

## 架构

```text
Browser
  ├── settings.section → 模型能力页面
  ├── conversation.composer.dock → 当前 session 能力胶囊
  └── GET /model-radar/api/data
            │
            ▼
Host plugin
  ├── 每频道 60 秒内存缓存
  ├── 并行读取公开 API
  ├── 归一化为 RadarView
  └── 本地快照持久化
```

能力胶囊订阅 DSH 官方 `modelDirectories` per-session store，因此模型选择变化不需要轮询即可传播。

## 开发

```bash
npm ci
npm run build
```

常用 DSH 开发操作：

```text
dev_inject_plugin({ "dir": "/插件绝对路径/dsh-models-radar" })
dev_reload_package({ "packageName": "dsh-models-radar" })
dev_uninject_plugin({ "match": "dsh-models-radar" })
```

主要源码：

- `src/index.ts`：Host 代理、刷新节流、快照
- `src/client/RadarSection.tsx`：设置页状态与界面组合
- `src/client/Overview.tsx`：能力总览
- `src/client/charts.tsx`：趋势图和任务诊断
- `src/client/LiveCapability.tsx`：输入框下方实时能力读数
- `src/client/ScrollFrame.tsx`：溢出列表滚动条
- `src/client/scoreMetrics.ts`：IQ 等级和趋势语义
- `CONTEXT.md`：项目领域词汇

## 故障排查

### 设置页没有「模型能力」tab

1. 确认 `npm run build` 已生成 `lib/client.js`。
2. 使用 `dev_plugin_status` 确认插件处于 active 状态。
3. 刷新一次 Web GUI，加载最新 client 依赖图。

### 输入框下方没有能力胶囊

- 确认当前模型存在于 DeepSWE 榜单。
- 同基座 fallback 会显示 `≈`；完全未知的基座按设计不显示。
- 确认官方模型选择 UI 插件已启用。

### 上游刷新失败

存在历史快照时，设置页会显示最近一次成功数据。请检查 `api.codexradar.com` 的网络连通性；该接口不需要凭据。

## 许可证

[MIT](LICENSE)
