window.__ModuleLoader__.load({ id: 'dsh-models-radar', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// src/client/locales.ts
var zh = {
  "nav": "\u6A21\u578B\u80FD\u529B",
  "title": "\u6A21\u578B\u80FD\u529B\u96F7\u8FBE",
  "subtitle": "\u6570\u636E\u6765\u81EA deng.codexradar.com \u4F17\u6D4B\u770B\u677F\uFF0C\u6253\u5F00\u672C\u9875\u81EA\u52A8\u5237\u65B0\u3002",
  "overview.title": "\u80FD\u529B\u603B\u89C8 \xB7 \u6BCF\u57FA\u5EA7\u6700\u5F3A\u6863",
  "overview.hint": "\u70B9\u51FB\u4EFB\u610F\u884C\u5207\u6362\u4E0B\u65B9\u56FE\u8868\u7684\u6863\u4F4D",
  "level.leading": "\u9886\u5148",
  "live.label": "SWE IQ",
  "badge.iq": "\u80FD\u529B IQ",
  "badge.price": "\u5E73\u5747\u8D39\u7528 / \u6B21",
  "badge.minutes": "\u5E73\u5747\u8017\u65F6 / \u6B21",
  "badge.cache": "\u7F13\u5B58\u547D\u4E2D\u7387",
  "badge.runs": "24h \u8FD0\u884C\u6570",
  "bar.title": "\u4EFB\u52A1\u901A\u8FC7\u6784\u6210 \xB7 {label}",
  "line.title": "IQ \u8D8B\u52BF \xB7 \u8FD1 7 \u5929\u5C0F\u65F6\u7EA7",
  "trend.delta24h": "24h \u53D8\u5316",
  "trend.min": "7 \u5929\u6700\u4F4E",
  "trend.average": "7 \u5929\u5E73\u5747",
  "trend.max": "7 \u5929\u6700\u9AD8",
  "task.summary.pass": "\u901A\u8FC7 {passed} / {total} \xB7 {rate}",
  "task.summary.average": "\u5E73\u5747 F1 \xB7 {rate}",
  "task.filter.all": "\u5168\u90E8",
  "task.filter.pass": "\u901A\u8FC7",
  "task.filter.split": "\u5206\u6B67",
  "task.filter.fail": "\u5931\u8D25",
  "task.filter.excellent": "\u4F18\u79C0",
  "task.filter.good": "\u826F\u597D",
  "task.filter.general": "\u4E00\u822C",
  "task.filter.low": "\u8F83\u4F4E",
  "status.refreshing": "\u6B63\u5728\u5237\u65B0\u2026",
  "status.stale": "\u5237\u65B0\u5931\u8D25\uFF0C\u663E\u793A {time} \u7684\u5FEB\u7167\uFF1A{reason}",
  "status.failed": "\u52A0\u8F7D\u5931\u8D25\uFF1A{reason}",
  "action.retry": "\u91CD\u8BD5",
  "match.hint": "\u672A\u80FD\u5728\u699C\u5355\u4E2D\u8BC6\u522B\u5F53\u524D\u4F1A\u8BDD\u6A21\u578B\uFF08{model}\uFF09\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u6863\u4F4D\u3002",
  "empty.none": "\u8BE5\u9891\u9053\u6682\u65E0\u4EFB\u52A1\u660E\u7EC6",
  "empty.noSeries": "\u6682\u65E0\u8D8B\u52BF\u5E8F\u5217",
  "updated": "\u66F4\u65B0\u4E8E {time}",
  "source.updated": "\u670D\u52A1\u7AEF\u6570\u636E\u65F6\u95F4"
};
var en = {
  "nav": "Model Radar",
  "title": "Model capability radar",
  "subtitle": "Data from the deng.codexradar.com crowd benchmark; this page refreshes on every open.",
  "overview.title": "Capability overview \xB7 best effort per base model",
  "overview.hint": "Click any row to switch the charts below to that tier",
  "level.leading": "Leader",
  "live.label": "SWE IQ",
  "badge.iq": "Capability IQ",
  "badge.price": "Avg. cost / run",
  "badge.minutes": "Avg. minutes / run",
  "badge.cache": "Cache hit rate",
  "badge.runs": "Runs (24h)",
  "bar.title": "Task pass composition \xB7 {label}",
  "line.title": "IQ trend \xB7 hourly, last 7 days",
  "trend.delta24h": "24h change",
  "trend.min": "7d low",
  "trend.average": "7d average",
  "trend.max": "7d high",
  "task.summary.pass": "Passed {passed} / {total} \xB7 {rate}",
  "task.summary.average": "Average F1 \xB7 {rate}",
  "task.filter.all": "All",
  "task.filter.pass": "Passed",
  "task.filter.split": "Split",
  "task.filter.fail": "Failed",
  "task.filter.excellent": "Excellent",
  "task.filter.good": "Good",
  "task.filter.general": "General",
  "task.filter.low": "Low",
  "status.refreshing": "Refreshing\u2026",
  "status.stale": "Refresh failed; showing the {time} snapshot: {reason}",
  "status.failed": "Load failed: {reason}",
  "action.retry": "Retry",
  "match.hint": "Could not match the session model ({model}) on the leaderboard \u2014 pick a tier manually.",
  "empty.none": "No task detail for this channel yet",
  "empty.noSeries": "No trend series yet",
  "updated": "Updated {time}",
  "source.updated": "Server data time"
};
var NS = "model-radar";
function fmt(template, params) {
  if (params === void 0) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key) => params[key] ?? whole);
}

// src/client/styles.ts
var STYLE_ID = "dsh-models-radar-style";
var cssText = `
.dsh_mr_section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
}
.dsh_mr_header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.dsh_mr_title { margin: 0; font-size: 15px; font-weight: 600; }
.dsh_mr_subtitle { margin-top: 2px; color: var(--dsw-alias-label-secondary); font-size: 12.5px; }
.dsh_mr_seg {
  display: inline-flex;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 9px;
  overflow: hidden;
  background: var(--dsw-alias-bg-layer-1);
}
.dsh_mr_segBtn {
  appearance: none;
  border: 0;
  background: none;
  padding: 6px 14px;
  font: inherit;
  font-size: 13px;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dsh_mr_segBtn + .dsh_mr_segBtn { border-left: 1px solid var(--dsw-alias-border-l1); }
.dsh_mr_segBtn[data-active="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
  font-weight: 600;
  box-shadow: inset 0 -2px 0 var(--dsw-alias-brand-primary);
}
.dsh_mr_badges {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(118px, 1fr));
  gap: 8px;
}
.dsh_mr_badge {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh_mr_badgeVal {
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh_mr_badgeVal[data-accent="true"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_badgeVal[data-band="low"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_badgeVal[data-band="general"] { color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_badgeVal[data-band="steady"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_badgeVal[data-band="excellent"],
.dsh_mr_badgeVal[data-band="leading"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_badgeLabel { font-size: 11.5px; color: var(--dsw-alias-label-secondary); }
.dsh_mr_banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-layer-1);
  font-size: 12.5px;
  color: var(--dsw-alias-label-primary);
  min-width: 0;
}
.dsh_mr_bannerText { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.dsh_mr_banner[data-tone="warn"] { border-color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_banner[data-tone="error"] { border-color: var(--dsw-alias-state-error-primary); }
.dsh_mr_spin {
  width: 12px; height: 12px; flex: none;
  border-radius: 50%;
  border: 2px solid var(--dsw-alias-border-l2);
  border-top-color: var(--dsw-alias-brand-primary);
  animation: dsh_mr_spin 0.9s linear infinite;
}
@keyframes dsh_mr_spin { to { transform: rotate(360deg); } }
.dsh_mr_retry {
  appearance: none;
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12px;
  padding: 3px 10px;
  cursor: pointer;
}
.dsh_mr_retry:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.dsh_mr_card {
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.dsh_mr_cardHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.dsh_mr_cardTitle { font-size: 13px; font-weight: 600; }
.dsh_mr_select {
  appearance: none;
  max-width: 340px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  padding: 4px 8px;
  cursor: pointer;
}
.dsh_mr_hint { font-size: 12px; color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_empty { color: var(--dsw-alias-label-secondary); font-size: 12.5px; padding: 8px 0; }
.dsh_mr_bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
/* Bounded native scroll viewports wrapped by a deterministic custom rail.
   macOS can hide overlay scrollbars regardless of ::-webkit-scrollbar rules,
   so the native bar is suppressed and our rail stays visible at all times. */
.dsh_mr_scrollFrame {
  position: relative;
  min-width: 0;
}
.dsh_mr_scrollFrame[data-scrollable="true"] { padding-right: 14px; }
.dsh_mr_ovScroll {
  max-height: min(52vh, 460px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.dsh_mr_taskScroll {
  max-height: 400px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.dsh_mr_ovScroll::-webkit-scrollbar,
.dsh_mr_taskScroll::-webkit-scrollbar { display: none; }
.dsh_mr_scrollRail {
  position: absolute;
  top: 0;
  right: 2px;
  bottom: 0;
  width: 8px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 5px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh_mr_scrollThumb {
  position: absolute;
  left: 0;
  right: 0;
  min-height: 28px;
  border-radius: 4px;
  background: var(--dsw-alias-border-l2);
  cursor: grab;
  touch-action: none;
}
.dsh_mr_scrollThumb:hover,
.dsh_mr_scrollThumb:focus-visible {
  background: var(--dsw-alias-brand-primary);
  outline: none;
}
.dsh_mr_scrollThumb:active { cursor: grabbing; }
.dsh_mr_ovGroup { display: flex; flex-direction: column; }
.dsh_mr_ovRow {
  display: grid;
  grid-template-columns: 22px 18px minmax(0, 1fr) 64px 118px;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
}
.dsh_mr_ovRow:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh_mr_ovRow[data-selected="true"] {
  background: var(--dsw-alias-bg-layer-2);
  box-shadow: inset 0 0 0 1px var(--dsw-alias-brand-primary);
}
.dsh_mr_ovRank {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.dsh_mr_ovChevron {
  appearance: none;
  border: 0;
  background: none;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
  line-height: 1;
  padding: 2px;
  cursor: pointer;
  transition: transform 120ms ease;
}
.dsh_mr_ovChevron[data-open="true"] { transform: rotate(90deg); }
span.dsh_mr_ovChevron { cursor: default; }
.dsh_mr_ovName {
  font-size: 12.5px;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh_mr_ovEffort { color: var(--dsw-alias-label-secondary); }
.dsh_mr_ovChild .dsh_mr_ovName { color: var(--dsw-alias-label-secondary); }
.dsh_mr_ovDelta {
  font-size: 11.5px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.dsh_mr_ovDelta[data-dir="up"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_ovDelta[data-dir="down"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_ovDelta[data-dir="flat"], .dsh_mr_ovDelta[data-dir="none"] { color: var(--dsw-alias-label-secondary); }
.dsh_mr_ovIqCell {
  position: relative;
  height: 20px;
  border-radius: 5px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.dsh_mr_ovBarFill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: 5px;
  background: var(--dsw-alias-brand-primary);
  opacity: 0.28;
  transition: width 240ms ease;
}
.dsh_mr_ovBarFill[data-band="low"] { background: var(--dsw-alias-state-error-primary); }
.dsh_mr_ovBarFill[data-band="general"] { background: var(--dsw-alias-state-warn-primary); }
.dsh_mr_ovBarFill[data-band="steady"] { background: var(--dsw-alias-brand-primary); }
.dsh_mr_ovBarFill[data-band="excellent"],
.dsh_mr_ovBarFill[data-band="leading"] { background: var(--dsw-alias-state-success-primary); }
.dsh_mr_ovBarFill[data-band="leading"] { opacity: 0.42; }
.dsh_mr_ovLevel {
  position: absolute;
  z-index: 1;
  left: 5px;
  top: 3px;
  padding: 0 4px;
  border-radius: 4px;
  color: var(--dsw-alias-state-success-primary);
  background: var(--dsw-alias-bg-layer-1);
  font-size: 9px;
  line-height: 14px;
  font-weight: 600;
}
.dsh_mr_ovIqVal {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 6px;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_taskSummary { display: flex; flex-direction: column; gap: 5px; }
.dsh_mr_taskSummaryHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.dsh_mr_taskSummaryHead > span { color: var(--dsw-alias-label-secondary); }
.dsh_mr_taskAggregate {
  display: flex;
  width: 100%;
  height: 10px;
  overflow: hidden;
  border-radius: 5px;
  background: var(--dsw-alias-bg-layer-2);
}
.dsh_mr_taskAggregate > span { min-width: 0; transition: width 240ms ease; }
.dsh_mr_taskAggregate [data-band="pass"],
.dsh_mr_taskAggregate [data-band="excellent"] { background: var(--dsw-alias-state-success-primary); }
.dsh_mr_taskAggregate [data-band="split"],
.dsh_mr_taskAggregate [data-band="general"] { background: var(--dsw-alias-state-warn-primary); }
.dsh_mr_taskAggregate [data-band="fail"],
.dsh_mr_taskAggregate [data-band="low"] { background: var(--dsw-alias-state-error-primary); }
.dsh_mr_taskAggregate [data-band="good"] { background: var(--dsw-alias-brand-primary); }
.dsh_mr_taskFilters {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.dsh_mr_taskFilters button {
  appearance: none;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 11px;
  padding: 3px 7px;
  cursor: pointer;
}
.dsh_mr_taskFilters button > span {
  margin-left: 3px;
  font-variant-numeric: tabular-nums;
}
.dsh_mr_taskFilters button[data-active="true"] {
  color: var(--dsw-alias-label-primary);
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-brand-primary);
}
.dsh_mr_taskFilters button[data-active="true"][data-band="pass"],
.dsh_mr_taskFilters button[data-active="true"][data-band="excellent"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_taskFilters button[data-active="true"][data-band="split"],
.dsh_mr_taskFilters button[data-active="true"][data-band="general"] { color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_taskFilters button[data-active="true"][data-band="fail"],
.dsh_mr_taskFilters button[data-active="true"][data-band="low"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_taskFilters button[data-active="true"][data-band="good"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_barRow {
  display: grid;
  grid-template-columns: minmax(140px, 220px) 1fr 44px;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.dsh_mr_barLabel {
  font-size: 11.5px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: ltr;
}
.dsh_mr_barTrack {
  height: 8px;
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2);
  overflow: hidden;
}
.dsh_mr_barFill {
  height: 100%;
  border-radius: 4px;
  background: var(--dsw-alias-brand-primary);
  opacity: 0.9;
  transition: width 240ms ease;
}
.dsh_mr_barFill[data-band="pass"],
.dsh_mr_barFill[data-band="excellent"] { background: var(--dsw-alias-state-success-primary); }
.dsh_mr_barFill[data-band="split"],
.dsh_mr_barFill[data-band="general"] { background: var(--dsw-alias-state-warn-primary); }
.dsh_mr_barFill[data-band="fail"],
.dsh_mr_barFill[data-band="low"] { background: var(--dsw-alias-state-error-primary); }
.dsh_mr_barFill[data-band="good"] { background: var(--dsw-alias-brand-primary); }
.dsh_mr_barVal {
  font-size: 11.5px;
  color: var(--dsw-alias-label-primary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.dsh_mr_barVal[data-band="pass"],
.dsh_mr_barVal[data-band="excellent"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_barVal[data-band="split"],
.dsh_mr_barVal[data-band="general"] { color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_barVal[data-band="fail"],
.dsh_mr_barVal[data-band="low"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_barVal[data-band="good"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_more {
  appearance: none;
  align-self: flex-start;
  border: 0;
  background: none;
  color: var(--dsw-alias-brand-primary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  padding: 2px 0;
}
.dsh_mr_trendStats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}
.dsh_mr_trendStat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 5px;
  min-width: 0;
  padding: 5px 7px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 7px;
  background: var(--dsw-alias-bg-layer-2);
  font-variant-numeric: tabular-nums;
}
.dsh_mr_trendStatLabel {
  color: var(--dsw-alias-label-secondary);
  font-size: 10.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh_mr_trendStat strong { font-size: 12px; }
.dsh_mr_trendStat strong[data-dir="up"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_trendStat strong[data-dir="down"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_trendStat strong[data-dir="flat"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_trendWrap { position: relative; min-width: 0; }
.dsh_mr_trendWrap svg { display: block; width: 100%; height: auto; }
.dsh_mr_tip {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -130%);
  background: var(--dsw-alias-bg-overlay);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_liveReadout {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  align-self: center;
  gap: 6px;
  min-width: 0;
  height: 28px;
  padding: 0 9px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
/* The dock slot renders entries as a Fragment under InputBar's vertical root.
   When the known billing entry precedes this readout, promote only that exact
   parent to a centered grid: composer chrome spans all columns; the two pills
   sit side-by-side in the middle columns. */
div[data-slot="conversation.composer.dock"]:has(> [data-testid="billing-live-cost-bar"] + .dsh_mr_liveReadout) {
  display: grid !important;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto auto minmax(0, 1fr);
  align-items: center;
  column-gap: 8px;
}
div[data-slot="conversation.composer.dock"]:has(> [data-testid="billing-live-cost-bar"] + .dsh_mr_liveReadout)
  > :not([data-testid="billing-live-cost-bar"]):not(.dsh_mr_liveReadout) {
  grid-column: 1 / -1;
}
div[data-slot="conversation.composer.dock"]:has(> [data-testid="billing-live-cost-bar"] + .dsh_mr_liveReadout)
  > [data-testid="billing-live-cost-bar"] {
  grid-column: 2;
  justify-self: end;
  margin-left: 0;
  margin-right: 0;
}
div[data-slot="conversation.composer.dock"]:has(> [data-testid="billing-live-cost-bar"] + .dsh_mr_liveReadout)
  > .dsh_mr_liveReadout {
  grid-column: 3;
  justify-self: start;
}
.dsh_mr_liveLabel { color: var(--dsw-alias-label-secondary); font-size: 10.5px; }
.dsh_mr_liveIq { font-size: 12.5px; line-height: 18px; }
.dsh_mr_liveReadout[data-band="low"] .dsh_mr_liveIq { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_liveReadout[data-band="general"] .dsh_mr_liveIq { color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_liveReadout[data-band="steady"] .dsh_mr_liveIq { color: var(--dsw-alias-brand-primary); }
.dsh_mr_liveReadout[data-band="excellent"] .dsh_mr_liveIq,
.dsh_mr_liveReadout[data-band="leading"] .dsh_mr_liveIq { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_liveDelta { font-size: 10.5px; }
.dsh_mr_liveDelta[data-dir="up"] { color: var(--dsw-alias-state-success-primary); }
.dsh_mr_liveDelta[data-dir="down"] { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_liveDelta[data-dir="flat"] { color: var(--dsw-alias-brand-primary); }
.dsh_mr_liveSpark { display: block; flex: none; width: 72px; height: 18px; }
.dsh_mr_footer {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11.5px;
  flex-wrap: wrap;
}
.dsh_mr_dot { width: 7px; height: 7px; border-radius: 50%; flex: none; }
.dsh_mr_dot[data-fresh="true"] { background: var(--dsw-alias-state-success-primary); }
.dsh_mr_dot[data-fresh="false"] { background: var(--dsw-alias-state-warn-primary); }
@media (max-width: 640px) {
  .dsh_mr_trendStats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh_mr_ovRow { grid-template-columns: 18px 16px minmax(0, 1fr) 58px 100px; gap: 5px; }
  .dsh_mr_liveSpark { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh_mr_ovBarFill,
  .dsh_mr_barFill,
  .dsh_mr_taskAggregate > span { transition: none; }
}
`;
function adoptStyles() {
  let element = document.getElementById(STYLE_ID);
  if (element === null) {
    element = document.createElement("style");
    element.id = STYLE_ID;
    document.head.appendChild(element);
  }
  element.textContent = cssText;
  return () => {
    element?.remove();
  };
}

// src/client/LiveCapability.tsx
var import_react = require("react");

// src/client/scoreMetrics.ts
function iqBand(iq) {
  if (iq >= 100) return "leading";
  if (iq >= 95) return "excellent";
  if (iq >= 85) return "steady";
  if (iq >= 70) return "general";
  return "low";
}
function iqProgress(iq) {
  return Math.max(0, Math.min(1, iq / 110));
}
function trendSummary(points) {
  if (points.length === 0) return null;
  const values = points.map((point) => point[1]).filter(Number.isFinite);
  if (values.length === 0) return null;
  const last = points[points.length - 1];
  const lastTs = new Date(last[0]).getTime();
  let reference = points[0];
  if (!Number.isNaN(lastTs)) {
    for (const point of points) {
      const ts = new Date(point[0]).getTime();
      if (!Number.isNaN(ts) && ts <= lastTs - 24 * 36e5) reference = point;
      else if (!Number.isNaN(ts)) break;
    }
  }
  const delta24h = last[1] - reference[1];
  const direction = delta24h > 0.25 ? "up" : delta24h < -0.25 ? "down" : "flat";
  return {
    delta24h,
    direction,
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values)
  };
}

// src/client/LiveCapability.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function normalizeModel(model) {
  return model.split("/").pop()?.trim().toLowerCase() ?? model.toLowerCase();
}
function matchTier(view, selection) {
  const model = normalizeModel(selection.model);
  const effort = selection.reasoningEffort?.toLowerCase();
  if (effort !== void 0) {
    const exact = view.tiers.find(
      (tier) => normalizeModel(tier.model) === model && tier.effort.toLowerCase() === effort
    );
    if (exact !== void 0) return { tier: exact, approximate: false };
  }
  const base = view.tiers.find((tier) => normalizeModel(tier.model) === model);
  if (base !== void 0) return { tier: base, approximate: true };
  const fuzzy = view.tiers.find(
    (tier) => normalizeModel(tier.model).includes(model) || model.includes(normalizeModel(tier.model))
  );
  return fuzzy === void 0 ? null : { tier: fuzzy, approximate: true };
}
function MiniTrend({ points, direction }) {
  const recent = points.slice(-49);
  if (recent.length < 2) return null;
  const width = 72;
  const height = 18;
  const pad = 1.5;
  const values = recent.map((point) => point[1]);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }
  const coords = recent.map(([, value], index) => {
    const x = pad + index / (recent.length - 1) * (width - pad * 2);
    const y = pad + (1 - (value - min) / (max - min)) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const color = direction === "up" ? "var(--dsw-alias-state-success-primary)" : direction === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-brand-primary)";
  const [lastX, lastY] = coords[coords.length - 1].split(",");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { className: "dsh_mr_liveSpark", viewBox: `0 0 ${width} ${height}`, "aria-hidden": "true", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: coords.join(" "), fill: "none", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: lastX, cy: lastY, r: "1.8", fill: color })
  ] });
}
function LiveCapability({ useSession, modelDirectories, loadData: loadData2, t }) {
  const sessionId = useSession((session) => session.sessionId);
  const directory = (0, import_react.useMemo)(() => modelDirectories.directoryFor(sessionId), [modelDirectories, sessionId]);
  const directoryState = (0, import_react.useSyncExternalStore)(
    (listener) => directory.store.subscribe(listener),
    () => directory.store.getSnapshot()
  );
  const [view, setView] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (directory.store.getSnapshot().current === null) void directory.load().catch(() => void 0);
  }, [directory]);
  (0, import_react.useEffect)(() => {
    let cancelled = false;
    const controller = new AbortController();
    const refresh = () => {
      void loadData2("deep-swe", controller.signal).then(
        (payload) => {
          if (!cancelled && payload.data !== null) setView(payload.data);
        },
        () => {
        }
      );
    };
    refresh();
    const timer = window.setInterval(refresh, 6e4);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadData2, sessionId]);
  const selection = directoryState.current;
  const match = (0, import_react.useMemo)(
    () => view === null || selection === null ? null : matchTier(view, selection),
    [selection, view]
  );
  if (view === null || selection === null || match === null) return null;
  const series = view.series[match.tier.key] ?? [];
  const trend = trendSummary(series);
  const direction = trend?.direction ?? "flat";
  const deltaText = trend === null ? "\u2014" : direction === "flat" ? "\xB10.0" : `${trend.delta24h > 0 ? "+" : ""}${trend.delta24h.toFixed(1)}`;
  const arrow = direction === "up" ? "\u2191" : direction === "down" ? "\u2193" : "\u2192";
  const displayedIq = `${match.approximate ? "\u2248" : ""}${match.tier.iq.toFixed(1)}`;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "span",
    {
      className: "dsh_mr_liveReadout",
      "data-band": iqBand(match.tier.iq),
      title: `${selection.model}${selection.reasoningEffort ? ` \xB7 ${selection.reasoningEffort}` : ""} \xB7 ${match.tier.key}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh_mr_liveLabel", children: t("live.label") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { className: "dsh_mr_liveIq", children: displayedIq }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dsh_mr_liveDelta", "data-dir": direction, children: [
          arrow,
          " ",
          deltaText
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTrend, { points: series, direction })
      ]
    }
  );
}

// src/client/RadarSection.tsx
var import_react5 = require("react");

// src/client/Overview.tsx
var import_react3 = require("react");

// src/client/ScrollFrame.tsx
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var IDLE_METRICS = { scrollable: false, thumbTop: 0, thumbHeight: 0 };
function PersistentScrollFrame({ children, viewportClassName, label }) {
  const viewportRef = (0, import_react2.useRef)(null);
  const dragRef = (0, import_react2.useRef)(null);
  const [metrics, setMetrics] = (0, import_react2.useState)(IDLE_METRICS);
  const measure = (0, import_react2.useCallback)(() => {
    const viewport = viewportRef.current;
    if (viewport === null) return;
    const { clientHeight, scrollHeight, scrollTop } = viewport;
    const scrollable = scrollHeight > clientHeight + 1;
    if (!scrollable || clientHeight <= 0) {
      setMetrics((previous) => previous.scrollable ? IDLE_METRICS : previous);
      return;
    }
    const thumbHeight = Math.max(28, clientHeight / scrollHeight * clientHeight);
    const thumbTravel = clientHeight - thumbHeight;
    const scrollTravel = scrollHeight - clientHeight;
    const thumbTop = scrollTravel > 0 ? scrollTop / scrollTravel * thumbTravel : 0;
    setMetrics(
      (previous) => previous.scrollable === scrollable && Math.abs(previous.thumbTop - thumbTop) < 0.5 && Math.abs(previous.thumbHeight - thumbHeight) < 0.5 ? previous : { scrollable, thumbTop, thumbHeight }
    );
  }, []);
  (0, import_react2.useEffect)(() => {
    const viewport = viewportRef.current;
    if (viewport === null) return;
    const content = viewport.firstElementChild;
    const onScroll = () => measure();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(viewport);
    if (content instanceof Element) observer?.observe(content);
    measure();
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [measure]);
  const scrollFromTrack = (clientY, rail) => {
    const viewport = viewportRef.current;
    if (viewport === null || !metrics.scrollable) return;
    const rect = rail.getBoundingClientRect();
    const thumbTravel = viewport.clientHeight - metrics.thumbHeight;
    const scrollTravel = viewport.scrollHeight - viewport.clientHeight;
    const desiredTop = Math.max(0, Math.min(thumbTravel, clientY - rect.top - metrics.thumbHeight / 2));
    viewport.scrollTop = thumbTravel > 0 ? desiredTop / thumbTravel * scrollTravel : 0;
  };
  const onThumbKeyDown = (event) => {
    const viewport = viewportRef.current;
    if (viewport === null || !metrics.scrollable) return;
    const line = 40;
    const page = Math.max(80, viewport.clientHeight * 0.8);
    const next = event.key === "ArrowDown" ? viewport.scrollTop + line : event.key === "ArrowUp" ? viewport.scrollTop - line : event.key === "PageDown" ? viewport.scrollTop + page : event.key === "PageUp" ? viewport.scrollTop - page : event.key === "Home" ? 0 : event.key === "End" ? viewport.scrollHeight : null;
    if (next === null) return;
    event.preventDefault();
    viewport.scrollTop = next;
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_mr_scrollFrame", "data-scrollable": metrics.scrollable, children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { ref: viewportRef, className: viewportClassName, children }),
    metrics.scrollable && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        className: "dsh_mr_scrollRail",
        onPointerDown: (event) => {
          if (event.target === event.currentTarget) scrollFromTrack(event.clientY, event.currentTarget);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: "dsh_mr_scrollThumb",
            role: "scrollbar",
            "aria-label": label,
            "aria-orientation": "vertical",
            "aria-valuemin": 0,
            "aria-valuemax": Math.max(0, (viewportRef.current?.scrollHeight ?? 0) - (viewportRef.current?.clientHeight ?? 0)),
            "aria-valuenow": Math.round(viewportRef.current?.scrollTop ?? 0),
            tabIndex: 0,
            style: { top: metrics.thumbTop, height: metrics.thumbHeight },
            onKeyDown: onThumbKeyDown,
            onPointerDown: (event) => {
              const viewport = viewportRef.current;
              if (viewport === null) return;
              dragRef.current = { y: event.clientY, scrollTop: viewport.scrollTop };
              event.currentTarget.setPointerCapture(event.pointerId);
              event.preventDefault();
            },
            onPointerMove: (event) => {
              const viewport = viewportRef.current;
              const drag = dragRef.current;
              if (viewport === null || drag === null) return;
              const thumbTravel = viewport.clientHeight - metrics.thumbHeight;
              const scrollTravel = viewport.scrollHeight - viewport.clientHeight;
              viewport.scrollTop = drag.scrollTop + (event.clientY - drag.y) * (scrollTravel / Math.max(1, thumbTravel));
            },
            onPointerUp: (event) => {
              dragRef.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            },
            onPointerCancel: () => {
              dragRef.current = null;
            }
          }
        )
      }
    )
  ] });
}

// src/client/Overview.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function groupByBase(view) {
  const groups = /* @__PURE__ */ new Map();
  for (const tier of view.tiers) {
    const ladder = groups.get(tier.model);
    if (ladder === void 0) groups.set(tier.model, [tier]);
    else if (!ladder.some((existing) => existing.key === tier.key)) ladder.push(tier);
  }
  return [...groups.entries()].map(([base, tiers]) => ({ base, tiers, best: tiers[0] }));
}
function DeltaBadge({ points }) {
  const summary = trendSummary(points ?? []);
  if (summary === null) return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovDelta", "data-dir": "none", children: "\u2014" });
  const glyph = summary.direction === "up" ? "\u2191" : summary.direction === "down" ? "\u2193" : "\u2192";
  const text = summary.direction === "flat" ? "\xB10.0" : `${summary.delta24h > 0 ? "+" : ""}${summary.delta24h.toFixed(1)}`;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_mr_ovDelta", "data-dir": summary.direction, title: "24h", children: [
    glyph,
    " ",
    text
  ] });
}
function TierOverview({ view, selectedKey, onSelect, t }) {
  const [expanded, setExpanded] = (0, import_react3.useState)(() => /* @__PURE__ */ new Set());
  const groups = groupByBase(view);
  if (groups.length === 0) return null;
  const toggle = (base) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(base)) next.delete(base);
      else next.add(base);
      return next;
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_mr_cardHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_cardTitle", children: t("overview.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_hint", children: t("overview.hint") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(PersistentScrollFrame, { viewportClassName: "dsh_mr_ovScroll", label: t("overview.title"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_mr_bars", children: groups.map((group, index) => {
      const isOpen = expanded.has(group.base);
      const isSelected = selectedKey !== null && (group.best.key === selectedKey || group.tiers.some((tier) => tier.key === selectedKey));
      const widthPct = iqProgress(group.best.iq) * 100;
      const band = iqBand(group.best.iq);
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh_mr_ovGroup", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: "dsh_mr_ovRow",
            "data-selected": isSelected,
            role: "button",
            tabIndex: 0,
            onClick: () => onSelect(group.best.key),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") onSelect(group.best.key);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovRank", children: index + 1 }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  className: "dsh_mr_ovChevron",
                  "aria-label": isOpen ? "collapse" : "expand",
                  "data-open": isOpen,
                  onClick: (event) => {
                    event.stopPropagation();
                    toggle(group.base);
                  },
                  children: "\u25B8"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_mr_ovName", title: group.base, children: [
                group.base,
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_mr_ovEffort", children: [
                  " \xB7 ",
                  group.best.effort
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DeltaBadge, { points: view.series[group.best.key] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_mr_ovIqCell", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovBarFill", "data-band": band, style: { width: `${widthPct}%` } }),
                band === "leading" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovLevel", children: t("level.leading") }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovIqVal", children: group.best.iq.toFixed(1) })
              ] })
            ]
          }
        ),
        isOpen && group.tiers.filter((tier) => tier.key !== group.best.key).map((tier) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: "dsh_mr_ovRow dsh_mr_ovChild",
            "data-selected": tier.key === selectedKey,
            role: "button",
            tabIndex: 0,
            onClick: () => onSelect(tier.key),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === " ") onSelect(tier.key);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovRank" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovChevron" }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovName", children: tier.effort }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DeltaBadge, { points: view.series[tier.key] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh_mr_ovIqCell", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "span",
                  {
                    className: "dsh_mr_ovBarFill",
                    "data-band": iqBand(tier.iq),
                    style: { width: `${iqProgress(tier.iq) * 100}%` }
                  }
                ),
                iqBand(tier.iq) === "leading" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovLevel", children: t("level.leading") }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh_mr_ovIqVal", children: tier.iq.toFixed(1) })
              ] })
            ]
          },
          tier.key
        ))
      ] }, group.base);
    }) }) })
  ] });
}

// src/client/charts.tsx
var import_react4 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var TREND_W = 640;
var TREND_H = 190;
var PAD = { top: 16, right: 14, bottom: 26, left: 46 };
var AXIS_STYLE = { fontSize: 10.5, fill: "var(--dsw-alias-label-secondary)" };
var two = (n) => n < 10 ? `0${n}` : String(n);
function formatStamp(iso, withTime) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const base = `${two(date.getMonth() + 1)}-${two(date.getDate())}`;
  return withTime ? `${base} ${two(date.getHours())}:${two(date.getMinutes())}` : base;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function smoothPath(points, minY, maxY) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, minY, maxY);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, minY, maxY);
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return path;
}
function TrendLine({ points, t }) {
  const [hoverIndex, setHoverIndex] = (0, import_react4.useState)(null);
  const summary = trendSummary(points);
  const geometry = (0, import_react4.useMemo)(() => {
    if (points.length < 2) return null;
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const [, value] of points) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (min === max) {
      min -= 0.5;
      max += 0.5;
    }
    const slack = (max - min) * 0.08;
    const lo2 = min - slack;
    const hi2 = max + slack;
    const innerW = TREND_W - PAD.left - PAD.right;
    const innerH = TREND_H - PAD.top - PAD.bottom;
    const x2 = (index) => PAD.left + index / (points.length - 1) * innerW;
    const y2 = (value) => PAD.top + (1 - (value - lo2) / (hi2 - lo2)) * innerH;
    const coordinates = points.map(([, value], index) => [x2(index), y2(value)]);
    const line2 = smoothPath(coordinates, PAD.top, TREND_H - PAD.bottom);
    const baseline = TREND_H - PAD.bottom;
    const area2 = `${line2} L ${coordinates[coordinates.length - 1][0].toFixed(1)} ${baseline} L ${coordinates[0][0].toFixed(1)} ${baseline} Z`;
    return { lo: lo2, hi: hi2, x: x2, y: y2, line: line2, area: area2, last: points.length - 1 };
  }, [points]);
  if (geometry === null || summary === null) return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_empty" });
  const { lo, hi, x, y, line, area, last } = geometry;
  const mid = (lo + hi) / 2;
  const hovered = hoverIndex !== null ? points[hoverIndex] : void 0;
  const deltaText = summary.direction === "flat" ? "\xB10.0" : `${summary.delta24h > 0 ? "+" : ""}${summary.delta24h.toFixed(1)}`;
  const endpointColor = summary.direction === "up" ? "var(--dsw-alias-state-success-primary)" : summary.direction === "down" ? "var(--dsw-alias-state-error-primary)" : "var(--dsw-alias-brand-primary)";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_trendStats", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_trendStat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_trendStatLabel", children: t("trend.delta24h") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { "data-dir": summary.direction, children: deltaText })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_trendStat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_trendStatLabel", children: t("trend.min") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: summary.min.toFixed(1) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_trendStat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_trendStatLabel", children: t("trend.average") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: summary.average.toFixed(1) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_trendStat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_trendStatLabel", children: t("trend.max") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: summary.max.toFixed(1) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_trendWrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "svg",
        {
          viewBox: `0 0 ${TREND_W} ${TREND_H}`,
          role: "img",
          "aria-label": "IQ trend",
          onMouseMove: (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const relX = (event.clientX - rect.left) / rect.width * TREND_W;
            const ratio = (relX - PAD.left) / (TREND_W - PAD.left - PAD.right);
            setHoverIndex(clamp(Math.round(ratio * (points.length - 1)), 0, points.length - 1));
          },
          onMouseLeave: () => setHoverIndex(null),
          children: [
            [hi, mid, lo].map((value) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("line", { x1: PAD.left, x2: TREND_W - PAD.right, y1: y(value), y2: y(value), stroke: "var(--dsw-alias-border-l1)", strokeDasharray: value === mid ? "none" : "3 4" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: PAD.left - 6, y: y(value) + 3.5, textAnchor: "end", style: AXIS_STYLE, children: value.toFixed(1) })
            ] }, value)),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: area, fill: "var(--dsw-alias-brand-primary)", fillOpacity: "0.09" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: line, fill: "none", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round" }),
            hovered !== void 0 && hoverIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("line", { x1: x(hoverIndex), x2: x(hoverIndex), y1: PAD.top, y2: TREND_H - PAD.bottom, stroke: "var(--dsw-alias-border-l2)" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: x(hoverIndex), cy: y(hovered[1]), r: "3", fill: "var(--dsw-alias-bg-layer-1)", stroke: "var(--dsw-alias-brand-primary)", strokeWidth: "2" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: x(last), cy: y(points[last][1]), r: "3.8", fill: endpointColor }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: x(last), y: y(points[last][1]) - 9, textAnchor: "end", style: { ...AXIS_STYLE, fontWeight: 600, fill: "var(--dsw-alias-label-primary)" }, children: points[last][1].toFixed(1) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: PAD.left, y: TREND_H - 8, style: AXIS_STYLE, children: formatStamp(points[0][0], false) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: TREND_W - PAD.right, y: TREND_H - 8, textAnchor: "end", style: AXIS_STYLE, children: formatStamp(points[last][0], false) })
          ]
        }
      ),
      hovered !== void 0 && hoverIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_tip", style: { left: `${x(hoverIndex) / TREND_W * 100}%`, top: `${y(hovered[1]) / TREND_H * 100}%` }, children: [
        formatStamp(hovered[0], true),
        " \xB7 ",
        hovered[1].toFixed(1)
      ] })
    ] })
  ] });
}
function taskMode(benchmark, scoringMode) {
  return benchmark === "deep-swe" || scoringMode === "binary-majority" ? "binary" : "continuous";
}
function taskCategory(row, mode) {
  const [, rate, majorityPassed] = row;
  if (mode === "binary") {
    if (majorityPassed === true || majorityPassed === void 0 && rate >= 2 / 3) return "pass";
    if (rate > 0) return "split";
    return "fail";
  }
  if (rate >= 0.75) return "excellent";
  if (rate >= 0.5) return "good";
  if (rate >= 0.25) return "general";
  return "low";
}
var FILTER_KEYS = {
  all: "task.filter.all",
  pass: "task.filter.pass",
  split: "task.filter.split",
  fail: "task.filter.fail",
  excellent: "task.filter.excellent",
  good: "task.filter.good",
  general: "task.filter.general",
  low: "task.filter.low"
};
function TaskBars({
  rows,
  benchmark,
  scoringMode,
  t
}) {
  const mode = taskMode(benchmark, scoringMode);
  const categories = mode === "binary" ? ["pass", "split", "fail"] : ["excellent", "good", "general", "low"];
  const [filter, setFilter] = (0, import_react4.useState)("all");
  (0, import_react4.useEffect)(() => setFilter("all"), [mode]);
  const enriched = rows.map((row) => ({ row, category: taskCategory(row, mode) })).sort((a, b) => a.row[1] - b.row[1] || a.row[0].localeCompare(b.row[0]));
  const counts = Object.fromEntries(categories.map((category) => [category, enriched.filter((item) => item.category === category).length]));
  const visible = filter === "all" ? enriched : enriched.filter((item) => item.category === filter);
  const average = rows.length === 0 ? 0 : rows.reduce((sum, row) => sum + row[1], 0) / rows.length;
  const passed = counts.pass ?? 0;
  const summary = mode === "binary" ? fmt(t("task.summary.pass"), { passed: String(passed), total: String(rows.length), rate: `${Math.round(passed / Math.max(1, rows.length) * 100)}%` }) : fmt(t("task.summary.average"), { rate: `${Math.round(average * 100)}%` });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_taskSummary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_taskSummaryHead", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: summary }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: rows.length })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_taskAggregate", role: "img", "aria-label": summary, children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { "data-band": category, style: { width: `${counts[category] / Math.max(1, rows.length) * 100}%` } }, category)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_taskFilters", children: ["all", ...categories].map((category) => {
      const count = category === "all" ? rows.length : counts[category];
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", "data-active": filter === category, "data-band": category, onClick: () => setFilter(category), children: [
        t(FILTER_KEYS[category]),
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: count })
      ] }, category);
    }) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PersistentScrollFrame, { viewportClassName: "dsh_mr_taskScroll", label: t("bar.title"), children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_bars", children: visible.map(({ row: [taskId, rate], category }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_barRow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_barLabel", title: taskId, children: taskId }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_barTrack", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_barFill", "data-band": category, style: { width: `${clamp(rate, 0, 1) * 100}%` } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_barVal", "data-band": category, children: [
        Math.round(rate * 100),
        "%"
      ] })
    ] }, taskId)) }) })
  ] });
}

// src/client/RadarSection.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var LS_BENCH = "model-radar:benchmark";
var tierStorageKey = (benchmark) => `model-radar:tier:${benchmark}`;
var FALLBACK_CHANNELS = [
  { id: "deep-swe", title: "DeepSWE", scoreLabel: "Pass rate", isDefault: true },
  { id: "pompeii-adjacency", title: "\u5E9E\u8D1D\u58C1\u753B", scoreLabel: "Adjacency F1", isDefault: false }
];
function normalizeModelToken(model) {
  return model.split("/").pop()?.trim().toLowerCase() ?? model.toLowerCase();
}
function autoMatchTier(view) {
  const selection = view.defaultModel;
  if (selection === void 0) return null;
  const model = normalizeModelToken(selection.model);
  if (model === "") return null;
  const effort = selection.reasoningEffort?.toLowerCase();
  if (effort !== void 0 && effort !== "") {
    const exact = view.tiers.find((tier) => tier.model.toLowerCase() === model && tier.effort.toLowerCase() === effort);
    if (exact !== void 0) return exact.key;
  }
  const base = view.tiers.find((tier) => tier.model.toLowerCase() === model);
  if (base !== void 0) return base.key;
  const fuzzy = view.tiers.find(
    (tier) => tier.model.toLowerCase().includes(model) || model.includes(tier.model.toLowerCase())
  );
  return fuzzy?.key ?? null;
}
var pctText = (rate) => `${Math.round(rate * 100)}%`;
var moneyText = (value) => value === null ? "\u2014" : `$${value.toFixed(2)}`;
var minutesText = (value) => value === null ? "\u2014" : `${value.toFixed(1)} min`;
function RadarSection({ loadData: loadData2, t }) {
  const [benchmark, setBenchmark] = (0, import_react5.useState)(() => localStorage.getItem(LS_BENCH) ?? "deep-swe");
  const [payload, setPayload] = (0, import_react5.useState)(null);
  const [error, setError] = (0, import_react5.useState)(null);
  const [loading, setLoading] = (0, import_react5.useState)(true);
  const loadSeq = (0, import_react5.useRef)(0);
  const load = (0, import_react5.useCallback)(
    async (target) => {
      const seq = ++loadSeq.current;
      setLoading(true);
      setError(null);
      try {
        const response = await loadData2(target);
        if (seq !== loadSeq.current) return;
        if (response.ok) {
          setPayload(response);
        } else {
          setPayload(null);
          setError(response.error);
        }
      } catch (cause) {
        if (seq !== loadSeq.current) return;
        setPayload(null);
        setError(cause instanceof Error ? cause.message : String(cause));
      } finally {
        if (seq === loadSeq.current) setLoading(false);
      }
    },
    [loadData2]
  );
  (0, import_react5.useEffect)(() => {
    void load(benchmark);
  }, [benchmark, load]);
  const view = payload?.data ?? null;
  const [selectedKey, setSelectedKey] = (0, import_react5.useState)(() => localStorage.getItem(tierStorageKey(benchmark)));
  (0, import_react5.useEffect)(() => {
    setSelectedKey(localStorage.getItem(tierStorageKey(benchmark)));
  }, [benchmark]);
  const autoKey = (0, import_react5.useMemo)(() => view === null ? null : autoMatchTier(view), [view]);
  const tierKey = selectedKey ?? autoKey;
  const tier = view?.tiers.find((candidate) => candidate.key === tierKey) ?? null;
  const matchHint = view !== null && selectedKey === null && autoKey === null && view.defaultModel !== void 0 ? fmt(t("match.hint"), { model: view.defaultModel.model }) : null;
  const selectTier = (key) => {
    setSelectedKey(key);
    localStorage.setItem(tierStorageKey(benchmark), key);
  };
  const switchBenchmark = (id) => {
    if (id === benchmark) return;
    localStorage.setItem(LS_BENCH, id);
    setBenchmark(id);
  };
  const channels = view !== null && view.channels.length > 0 ? view.channels : FALLBACK_CHANNELS;
  const taskRows = tierKey !== null ? view?.taskRates[tierKey] ?? [] : [];
  const seriesPoints = tierKey !== null ? view?.series[tierKey] ?? [] : [];
  const badges = [
    {
      label: t("badge.iq"),
      value: tier !== null ? tier.iq.toFixed(1) : "\u2014",
      accent: true,
      band: tier !== null ? iqBand(tier.iq) : void 0
    },
    { label: t("badge.price"), value: moneyText(tier?.avgPrice ?? null) },
    { label: t("badge.minutes"), value: minutesText(tier?.avgMinutes ?? null) },
    { label: t("badge.cache"), value: tier?.cacheHit != null ? pctText(tier.cacheHit) : "\u2014" },
    { label: t("badge.runs"), value: tier !== null ? String(tier.runs24h) : "\u2014" }
  ];
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("section", { className: "dsh_mr_section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "dsh_mr_title", children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_subtitle", children: t("subtitle") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_seg", role: "tablist", "aria-label": t("nav"), children: channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": channel.id === benchmark,
          className: "dsh_mr_segBtn",
          "data-active": channel.id === benchmark,
          onClick: () => switchBenchmark(channel.id),
          children: channel.title
        },
        channel.id
      )) })
    ] }),
    loading && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "info", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_spin" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_bannerText", children: t("status.refreshing") })
    ] }),
    !loading && payload?.stale === true && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "warn", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_bannerText", children: fmt(t("status.stale"), {
        time: new Date(payload.fetchedAt ?? payload.data?.fetchedAt ?? Date.now()).toLocaleString(),
        reason: payload.notice ?? ""
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: () => void load(benchmark), children: t("action.retry") })
    ] }),
    !loading && error !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_bannerText", children: fmt(t("status.failed"), { reason: error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: () => void load(benchmark), children: t("action.retry") })
    ] }),
    view !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TierOverview, { view, selectedKey: tierKey, onSelect: selectTier, t }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_badges", children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_badge", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_badgeVal", "data-accent": badge.accent === true, "data-band": badge.band, children: badge.value }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_badgeLabel", children: badge.label })
      ] }, badge.label)) }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_cardHead", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_cardTitle", children: t("line.title") }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "select",
            {
              className: "dsh_mr_select",
              value: tierKey ?? "",
              onChange: (event) => selectTier(event.target.value),
              "aria-label": t("line.title"),
              children: [
                tierKey === null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "\u2014" }),
                view.tiers.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("option", { value: candidate.key, children: [
                  candidate.model,
                  " \xB7 ",
                  candidate.effort,
                  " \xB7 IQ ",
                  candidate.iq.toFixed(1)
                ] }, candidate.key))
              ]
            }
          )
        ] }),
        matchHint !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_hint", children: matchHint }),
        seriesPoints.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TrendLine, { points: seriesPoints, t }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_empty", children: t("empty.noSeries") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_cardTitle", children: fmt(t("bar.title"), { label: view.scoreLabel || (tier?.passRate != null ? pctText(tier.passRate) : "") }) }),
        taskRows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TaskBars, { rows: taskRows, benchmark: view.benchmark, scoringMode: view.scoringMode, t }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_empty", children: t("empty.none") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "span",
          {
            className: "dsh_mr_dot",
            "data-fresh": payload?.stale === true ? "false" : "true",
            title: payload?.stale === true ? "stale snapshot" : "fresh"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { children: fmt(t("updated"), { time: new Date(view.fetchedAt).toLocaleString() }) }),
        view.sourceUpdatedAt !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { children: [
          "\xB7 ",
          t("source.updated"),
          ": ",
          new Date(view.sourceUpdatedAt).toLocaleString()
        ] })
      ] })
    ] })
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale", "modelDirectories"];
async function loadData(benchmark, signal) {
  const url = `/model-radar/api/data?benchmark=${encodeURIComponent(benchmark)}`;
  const response = await fetch(url, { signal });
  const body = await response.json();
  if (!response.ok || body.ok !== true) {
    throw new Error(body.ok === false ? body.error : `HTTP ${response.status}`);
  }
  return body;
}
function apply(ctx) {
  ctx.effect(() => adoptStyles(), "dsh-models-radar: styles");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-models-radar: dictionaries");
  const t = ctx.locale.bind(NS);
  const modelDirectories = ctx.get("modelDirectories");
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "model-radar",
    order: 25,
    label: () => t("nav"),
    locale: NS,
    inject: () => ({ loadData })
  }, RadarSection));
  ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
    name: "conversation.composer.dock",
    id: "model-radar-live",
    order: 10,
    locale: NS,
    inject: () => ({ modelDirectories, loadData })
  }, LiveCapability));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
