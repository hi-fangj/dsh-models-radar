/**
 * `model-radar` locale namespace: the Settings tab copy. Chinese is the product
 * copy; English mirrors it.
 */

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'nav': '模型雷达',
  'title': '模型能力雷达',
  'subtitle': '数据来自 deng.codexradar.com 众测看板；15 分钟新鲜窗口内过期才拉取，也可手动刷新。',
  'channel.label': '频道切换',
  'overview.title': '能力总览 · 每基座最强档',
  'overview.hint': '点击任意行切换下方图表的档位',
  'overview.current': '当前',
  'level.low': '待提升',
  'level.general': '一般',
  'level.steady': '稳健',
  'level.excellent': '优秀',
  'level.leading': '领先',
  'live.label': 'SWE IQ',
  'popover.title': '能力详情',
  'badge.iq': '能力 IQ',
  'badge.price': '平均费用 / 次',
  'badge.minutes': '平均耗时 / 次',
  'badge.cache': '缓存命中率',
  'badge.runs': '24h 运行数',
  'bar.title': '任务通过构成 · {label}',
  'line.title': 'IQ 趋势',
  'window.24h': '近 24 小时',
  'window.7d': '近 7 天',
  'trend.change': '变化',
  'trend.min': '最低',
  'trend.average': '平均',
  'trend.max': '最高',
  'task.summary.pass': '通过 {passed} / {total} · {rate}',
  'task.summary.average': '平均 F1 · {rate}',
  'task.filter.all': '全部',
  'task.filter.pass': '通过',
  'task.filter.split': '分歧',
  'task.filter.fail': '失败',
  'task.filter.excellent': '优秀',
  'task.filter.good': '良好',
  'task.filter.general': '一般',
  'task.filter.low': '较低',
  'status.refreshing': '正在刷新…',
  'status.stale': '刷新失败，显示 {time} 的快照：{reason}',
  'status.failed': '加载失败：{reason}',
  'action.retry': '重试',
  'action.refresh': '刷新',
  'match.hint': '未能在榜单中识别当前会话模型（{model}），请手动选择档位。',
  'empty.none': '该频道暂无任务明细',
  'empty.noSeries': '暂无趋势序列',
  'empty.noRecent': '近 24 小时暂无数据点',
  'updated': '更新于 {time}',
  'source.updated': '服务端数据时间',
} satisfies Record<string, string>

/** The `model-radar` namespace key union. */
export type ModelRadarKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'nav': 'Model Radar',
  'title': 'Model capability radar',
  'subtitle': 'Data from the deng.codexradar.com crowd benchmark; refetches only after the 15-minute freshness window, or on manual refresh.',
  'channel.label': 'Channel switcher',
  'overview.title': 'Capability overview · best effort per base model',
  'overview.hint': 'Click any row to switch the charts below to that tier',
  'overview.current': 'Current',
  'level.low': 'Developing',
  'level.general': 'General',
  'level.steady': 'Steady',
  'level.excellent': 'Excellent',
  'level.leading': 'Leader',
  'live.label': 'SWE IQ',
  'popover.title': 'Capability details',
  'badge.iq': 'Capability IQ',
  'badge.price': 'Avg. cost / run',
  'badge.minutes': 'Avg. minutes / run',
  'badge.cache': 'Cache hit rate',
  'badge.runs': 'Runs (24h)',
  'bar.title': 'Task pass composition · {label}',
  'line.title': 'IQ trend',
  'window.24h': 'Last 24 hours',
  'window.7d': 'Last 7 days',
  'trend.change': 'Change',
  'trend.min': 'Low',
  'trend.average': 'Average',
  'trend.max': 'High',
  'task.summary.pass': 'Passed {passed} / {total} · {rate}',
  'task.summary.average': 'Average F1 · {rate}',
  'task.filter.all': 'All',
  'task.filter.pass': 'Passed',
  'task.filter.split': 'Split',
  'task.filter.fail': 'Failed',
  'task.filter.excellent': 'Excellent',
  'task.filter.good': 'Good',
  'task.filter.general': 'General',
  'task.filter.low': 'Low',
  'status.refreshing': 'Refreshing…',
  'status.stale': 'Refresh failed; showing the {time} snapshot: {reason}',
  'status.failed': 'Load failed: {reason}',
  'action.retry': 'Retry',
  'action.refresh': 'Refresh',
  'match.hint': 'Could not match the session model ({model}) on the leaderboard — pick a tier manually.',
  'empty.none': 'No task detail for this channel yet',
  'empty.noSeries': 'No trend series yet',
  'empty.noRecent': 'No readings in the last 24 hours',
  'updated': 'Updated {time}',
  'source.updated': 'Server data time',
} satisfies Record<ModelRadarKey, string>

/** Locale namespace id registered under ctx.locale. */
export const NS = 'model-radar'

/**
 * Fill one dictionary template's `{name}`-style placeholders.
 * @param template - dictionary text.
 * @param params - placeholder values; absent params replace nothing.
 * @returns the filled text.
 */
export function fmt(template: string, params?: Record<string, string>): string {
  if (params === undefined) return template
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => params[key] ?? whole)
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** The model capability radar Settings tab copy. */
    [NS]: ModelRadarKey
  }
}
