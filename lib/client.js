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
  "nav": "\u6A21\u578B\u96F7\u8FBE",
  "title": "\u6A21\u578B\u80FD\u529B\u96F7\u8FBE",
  "subtitle.pre": "\u6570\u636E\u6765\u81EA ",
  "subtitle.post": " \u4F17\u6D4B\u770B\u677F\uFF1B15 \u5206\u949F\u65B0\u9C9C\u7A97\u53E3\u5185\u8FC7\u671F\u624D\u62C9\u53D6\uFF0C\u4E5F\u53EF\u624B\u52A8\u5237\u65B0\u3002",
  "channel.label": "\u9891\u9053\u5207\u6362",
  "overview.title": "\u80FD\u529B\u603B\u89C8 \xB7 \u6BCF\u57FA\u5EA7\u6700\u5F3A\u6863",
  "overview.hint": "\u70B9\u51FB\u4EFB\u610F\u884C\u5207\u6362\u4E0B\u65B9\u56FE\u8868\u7684\u6863\u4F4D",
  "overview.current": "\u5F53\u524D",
  "level.low": "\u5F85\u63D0\u5347",
  "level.general": "\u4E00\u822C",
  "level.steady": "\u7A33\u5065",
  "level.excellent": "\u4F18\u79C0",
  "level.leading": "\u9886\u5148",
  "live.label": "SWE IQ",
  "live.pref.label": "\u663E\u793A\u4F1A\u8BDD\u80FD\u529B\u6D6E\u7A97",
  "live.pref.hint": "\u8F93\u5165\u6846\u5DE5\u5177\u884C\u91CC\u3001\u6A21\u578B\u9009\u62E9\u5668\u5DE6\u4FA7\u7684 SWE IQ \u8BFB\u6570\u53CA\u5176\u80FD\u529B\u6D6E\u5C42\uFF1B\u5173\u95ED\u540E\u7ACB\u5373\u9690\u85CF\u5E76\u505C\u6B62\u540E\u53F0\u5237\u65B0\u3002",
  "pref.card.title": "\u6A21\u578B\u96F7\u8FBE",
  "pref.card.description": "\u6A21\u578B\u80FD\u529B\u96F7\u8FBE\u4E0E SWE IQ \u4F1A\u8BDD\u8BFB\u6570\u3002",
  "pref.card.pointer": "\u80FD\u529B\u56FE\u8868\u4E0E\u6570\u636E\u9875\u5728 \u8BBE\u7F6E \u2192 \u6A21\u578B\u96F7\u8FBE\u3002",
  "popover.title": "\u80FD\u529B\u8BE6\u60C5",
  "badge.iq": "\u80FD\u529B IQ",
  "badge.price": "\u5E73\u5747\u8D39\u7528 / \u6B21",
  "badge.minutes": "\u5E73\u5747\u8017\u65F6 / \u6B21",
  "badge.cache": "\u7F13\u5B58\u547D\u4E2D\u7387",
  "badge.runs": "24h \u8FD0\u884C\u6570",
  "bar.title": "\u4EFB\u52A1\u901A\u8FC7\u6784\u6210 \xB7 {label}",
  "cost.title": "\u6210\u672C \xD7 IQ \u5BF9\u6BD4 \xB7 \u5BF9\u6570\u6A2A\u8F74",
  "cost.hint": "\u8D8A\u9760\u5DE6\u4E0A\u8D8A\u9AD8\u6548",
  "cost.tab.combined": "\u7EFC\u5408\u6210\u672C",
  "cost.tab.minutes": "\u65F6\u95F4\u6210\u672C",
  "cost.tab.price": "\u8D39\u7528\u6210\u672C",
  "cost.filter.all": "\u5168\u9009",
  "cost.empty": "\u5F53\u524D\u7B5B\u9009\u4E0B\u6CA1\u6709\u53EF\u7ED8\u5236\u7684\u6863\u4F4D",
  "cost.tip.sub": "\u8BA2\u9605",
  "cost.tip.iq": "IQ {iq}\uFF08{passed}/{total}\uFF09",
  "cost.tip.combined": "\u7EFC\u5408\u6210\u672C \u7EFC\u5408\u6210\u672C\u6307\u6570 {index}\uFF08{price} \u6B21\u8D39\u7528\u3001{minutes} \u6B21\u8017\u65F6\uFF09",
  "cost.tip.minutes": "\u5E73\u5747\u8017\u65F6 {minutes} \u5206\u949F\uFF08{samples} \u6B21\uFF09",
  "cost.tip.price": "\u5E73\u5747\u4EF7\u683C {price}\uFF08{samples} \u6B21\uFF09",
  "ratings.title": "\u793E\u533A\u4F53\u611F\u5206",
  "ratings.hint": "\u7AD9\u70B9\u53C2\u8003\uFF1A9-10 \u660E\u663E\u597D\u7528 \xB7 7-8 \u6B63\u5E38\u53EF\u7528 \xB7 5-6 \u52C9\u5F3A\u53EF\u7528 \xB7 3-4 \u4F53\u9A8C\u8F83\u5DEE \xB7 1-2 \u51E0\u4E4E\u4E0D\u53EF\u7528",
  "ratings.loading": "\u6B63\u5728\u8BFB\u53D6\u793E\u533A\u4F53\u611F\u5206\u2026",
  "ratings.none": "\u672A\u8BC4\u5206",
  "ratings.empty": "\u6682\u65E0\u793E\u533A\u4F53\u611F\u5206\u6570\u636E",
  "ratings.tip.score": "\u4F53\u611F\u5206 {score} \xB7 {count} \u4EBA\u8BC4\u5206",
  "ratings.tip.none": "\u672C\u7A97\u53E3\u6682\u65E0\u8BC4\u5206",
  "ratings.chart.label": "\u793E\u533A\u4F53\u611F\u5206\u67F1\u72B6\u56FE",
  "line.title": "IQ \u8D8B\u52BF",
  "window.24h": "\u8FD1 24 \u5C0F\u65F6",
  "window.7d": "\u8FD1 7 \u5929",
  "trend.change": "\u53D8\u5316",
  "trend.min": "\u6700\u4F4E",
  "trend.average": "\u5E73\u5747",
  "trend.max": "\u6700\u9AD8",
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
  "task.lang.title": "\u7F16\u7A0B\u8BED\u8A00\uFF1A{language}",
  "task.expand": "\u5C55\u5F00\u5168\u90E8 {count} \u6761",
  "task.collapse": "\u6536\u8D77",
  "status.refreshing": "\u6B63\u5728\u5237\u65B0\u2026",
  "status.stale": "\u5237\u65B0\u5931\u8D25\uFF0C\u663E\u793A {time} \u7684\u5FEB\u7167\uFF1A{reason}",
  "status.failed": "\u52A0\u8F7D\u5931\u8D25\uFF1A{reason}",
  "action.retry": "\u91CD\u8BD5",
  "action.refresh": "\u5237\u65B0",
  "action.openSite": "\u8BBF\u95EE\u539F\u7AD9",
  "match.hint": "\u672A\u80FD\u5728\u699C\u5355\u4E2D\u8BC6\u522B\u5F53\u524D\u4F1A\u8BDD\u6A21\u578B\uFF08{model}\uFF09\uFF0C\u8BF7\u624B\u52A8\u9009\u62E9\u6863\u4F4D\u3002",
  "empty.none": "\u8BE5\u9891\u9053\u6682\u65E0\u4EFB\u52A1\u660E\u7EC6",
  "empty.noSeries": "\u6682\u65E0\u8D8B\u52BF\u5E8F\u5217",
  "empty.noRecent": "\u8FD1 24 \u5C0F\u65F6\u6682\u65E0\u6570\u636E\u70B9",
  "updated": "\u66F4\u65B0\u4E8E {time}",
  "source.updated": "\u670D\u52A1\u7AEF\u6570\u636E\u65F6\u95F4"
};
var en = {
  "nav": "Model Radar",
  "title": "Model capability radar",
  "subtitle.pre": "Data from ",
  "subtitle.post": " crowd benchmark; refetches only after the 15-minute freshness window, or on manual refresh.",
  "channel.label": "Channel switcher",
  "overview.title": "Capability overview \xB7 best effort per base model",
  "overview.hint": "Click any row to switch the charts below to that tier",
  "overview.current": "Current",
  "level.low": "Developing",
  "level.general": "General",
  "level.steady": "Steady",
  "level.excellent": "Excellent",
  "level.leading": "Leader",
  "live.label": "SWE IQ",
  "live.pref.label": "Show live capability readout",
  "live.pref.hint": "The SWE IQ readout beside the model selector in the composer tool row, and its capability popover; hiding it also stops background polling.",
  "pref.card.title": "Model Radar",
  "pref.card.description": "Model capability radar and the live SWE IQ readout.",
  "pref.card.pointer": "Charts and data live in Settings \u2192 Model Radar.",
  "popover.title": "Capability details",
  "badge.iq": "Capability IQ",
  "badge.price": "Avg. cost / run",
  "badge.minutes": "Avg. minutes / run",
  "badge.cache": "Cache hit rate",
  "badge.runs": "Runs (24h)",
  "bar.title": "Task pass composition \xB7 {label}",
  "cost.title": "Cost \xD7 IQ comparison \xB7 log x-axis",
  "cost.hint": "Upper-left = more efficient",
  "cost.tab.combined": "Composite",
  "cost.tab.minutes": "Time",
  "cost.tab.price": "Price",
  "cost.filter.all": "All",
  "cost.empty": "No tiers to plot under the current filter",
  "cost.tip.sub": "SUB",
  "cost.tip.iq": "IQ {iq} ({passed}/{total})",
  "cost.tip.combined": "Combined cost index {index} ({price} cost samples, {minutes} runtime samples)",
  "cost.tip.minutes": "Avg. runtime {minutes} min ({samples} runs)",
  "cost.tip.price": "Avg. price {price} ({samples} runs)",
  "ratings.title": "Community Ratings",
  "ratings.hint": "Site guide: 9\u201310 great \xB7 7\u20138 fine \xB7 5\u20136 usable \xB7 3\u20134 rough \xB7 1\u20132 nearly unusable",
  "ratings.loading": "Loading community ratings\u2026",
  "ratings.none": "Not rated",
  "ratings.empty": "No community ratings yet",
  "ratings.tip.score": "Score {score} \xB7 {count} ratings",
  "ratings.tip.none": "No ratings in this window",
  "ratings.chart.label": "Community ratings bar chart",
  "line.title": "IQ trend",
  "window.24h": "Last 24 hours",
  "window.7d": "Last 7 days",
  "trend.change": "Change",
  "trend.min": "Low",
  "trend.average": "Average",
  "trend.max": "High",
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
  "task.lang.title": "Language: {language}",
  "task.expand": "Show all {count}",
  "task.collapse": "Show less",
  "status.refreshing": "Refreshing\u2026",
  "status.stale": "Refresh failed; showing the {time} snapshot: {reason}",
  "status.failed": "Load failed: {reason}",
  "action.retry": "Retry",
  "action.refresh": "Refresh",
  "action.openSite": "Open site",
  "match.hint": "Could not match the session model ({model}) on the leaderboard \u2014 pick a tier manually.",
  "empty.none": "No task detail for this channel yet",
  "empty.noSeries": "No trend series yet",
  "empty.noRecent": "No readings in the last 24 hours",
  "updated": "Updated {time}",
  "source.updated": "Server data time"
};
var NS = "model-radar";
function fmt(template, params) {
  if (params === void 0) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key) => params[key] ?? whole);
}

// src/client/scoreMetrics.ts
var STEADY_COLOR = "var(--dsw-alias-brand-primary-new-colorprimary-new-color)";
function bandColor(band) {
  switch (band) {
    case "low":
      return "var(--dsw-alias-state-error-primary)";
    case "general":
      return "var(--dsw-alias-state-warn-primary)";
    case "steady":
      return STEADY_COLOR;
    case "excellent":
    case "leading":
      return "var(--dsw-alias-state-success-primary)";
  }
}
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
function directionOf(delta) {
  return delta > 0.25 ? "up" : delta < -0.25 ? "down" : "flat";
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
  return {
    delta24h,
    direction: directionOf(delta24h),
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values)
  };
}
function windowSummary(points) {
  if (points.length === 0) return null;
  const values = points.map((point) => point[1]).filter(Number.isFinite);
  if (values.length === 0) return null;
  const first = points[0];
  const last = points[points.length - 1];
  const change = last[1] - first[1];
  return {
    change,
    direction: directionOf(change),
    min: Math.min(...values),
    average: values.reduce((sum, value) => sum + value, 0) / values.length,
    max: Math.max(...values)
  };
}
function sliceRecentPoints(points, hours) {
  const cutoff = Date.now() - hours * 36e5;
  return points.filter(([ts]) => {
    const time = new Date(ts).getTime();
    return !Number.isNaN(time) && time >= cutoff;
  });
}
function deltaSignal({
  direction,
  delta
}) {
  return {
    glyph: direction === "up" ? "\u2191" : direction === "down" ? "\u2193" : "\u2192",
    text: direction === "flat" ? "\xB10.0" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`
  };
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
.dsh_mr_badgeVal[data-band="steady"] { color: ${STEADY_COLOR}; }
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
.dsh_mr_refresh {
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
.dsh_mr_refresh:hover { border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-brand-primary); }
.dsh_mr_refresh:disabled { opacity: 0.5; cursor: default; }
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
  background: var(--dsw-alias-scrollbar-bg-l1);
  cursor: grab;
  touch-action: none;
}
/* The thumb follows the system scrollbar palette (gray, slightly darker on
   hover/drag) \u2014 never the brand token, which is near-black in the light
   theme and read as a black bar while scrolling. */
.dsh_mr_scrollThumb:hover,
.dsh_mr_scrollThumb:focus-visible,
.dsh_mr_scrollThumb:active {
  background: var(--dsw-alias-scrollbar-hover-l1);
  outline: none;
}
.dsh_mr_scrollThumb:active { cursor: grabbing; }
.dsh_mr_ovGroup { display: flex; flex-direction: column; }
.dsh_mr_ovRow {
  position: relative;
  display: grid;
  grid-template-columns: 22px 18px minmax(0, 1fr) 64px 118px;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 120ms ease;
}
.dsh_mr_ovRow::before {
  content: '';
  position: absolute;
  left: 0;
  top: 5px;
  bottom: 5px;
  width: 2px;
  border-radius: 1px;
  background: var(--dsw-alias-brand-primary);
  opacity: 0;
  transform: scaleY(0.4);
  transition: opacity 120ms ease, transform 120ms ease;
}
/* Hover uses the shell's interactive token, not the layer ladder: layer-2 is
   DARKER than the card in the dark theme (rows would blacken under the cursor
   while scrolling), whereas interactive-bg-hover is the system gray-brighten
   overlay (white 8% on dark, subtle tint on light) shared with shell lists.
   The persistent [data-group-selected]/[data-selected] rules below keep
   precedence via source order. */
.dsh_mr_ovRow:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh_mr_ovRow[data-group-selected="true"] {
  background: var(--dsw-alias-bg-layer-2);
}
.dsh_mr_ovRow[data-group-selected="true"]::before {
  opacity: 0.35;
  transform: scaleY(0.65);
}
.dsh_mr_ovRow[data-selected="true"] {
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 10%, var(--dsw-alias-bg-layer-1));
}
.dsh_mr_ovRow[data-selected="true"]::before {
  opacity: 1;
  transform: scaleY(1);
}
.dsh_mr_ovRow[data-selected="true"] .dsh_mr_ovName { font-weight: 600; }
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
/* Flex row: the inner span owns the ellipsis truncation, so the current-model
   mark (a flex:none sibling) can never be squeezed into the clipped flow. */
.dsh_mr_ovName {
  display: flex;
  align-items: center;
  min-width: 0;
  font-size: 12.5px;
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_ovNameText {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh_mr_ovCurrent {
  flex: none;
  margin-left: 6px;
  padding: 0 5px;
  border: 1px solid var(--dsw-alias-brand-primary);
  border-radius: 5px;
  color: var(--dsw-alias-brand-primary);
  font-size: 9.5px;
  line-height: 14px;
  font-weight: 600;
}
.dsh_mr_ovEffort { color: var(--dsw-alias-label-secondary); }
.dsh_mr_ovHarness {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-left: 7px;
  font-size: 9.5px;
  line-height: 14px;
  font-weight: 600;
  white-space: nowrap;
}
.dsh_mr_ovHarnessDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--dsh-mr-harness-color, var(--dsw-alias-label-secondary));
}
/* Site harnessbar palette; codex \u2014 the site's default harness \u2014 wears its
   default accent, since #8b5cf6 is antigravity's slot there. */
.dsh_mr_ovHarness[data-harness='codex'] { --dsh-mr-harness-color: #2dd4bf; }
.dsh_mr_ovHarness[data-harness='claude-code'] { --dsh-mr-harness-color: #d97757; }
.dsh_mr_ovHarness[data-harness='dsh'] { --dsh-mr-harness-color: #4d6bfe; }
.dsh_mr_ovHarness[data-harness='zcode'] { --dsh-mr-harness-color: #06b6d4; }
.dsh_mr_ovHarness[data-harness='grok'] { --dsh-mr-harness-color: #f59e0b; }
.dsh_mr_ovHarness[data-harness='kimi-code'] { --dsh-mr-harness-color: #10b981; }
.dsh_mr_ovHarness[data-harness='antigravity'] { --dsh-mr-harness-color: #8b5cf6; }
.dsh_mr_ovHarness[data-harness='codebuddy'] { --dsh-mr-harness-color: #ec4899; }
.dsh_mr_ovHarnessLabel { color: var(--dsw-alias-label-secondary); letter-spacing: 0.2px; }
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
  background: ${STEADY_COLOR};
  opacity: 0.28;
  transition: width 240ms ease;
}
.dsh_mr_ovBarFill[data-band="low"] { background: var(--dsw-alias-state-error-primary); }
.dsh_mr_ovBarFill[data-band="general"] { background: var(--dsw-alias-state-warn-primary); }
.dsh_mr_ovBarFill[data-band="steady"] { background: ${STEADY_COLOR}; }
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
.dsh_mr_taskAggregate [data-band="good"] { background: ${STEADY_COLOR}; }
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
.dsh_mr_taskFilters button[data-active="true"][data-band="good"] { color: ${STEADY_COLOR}; }
.dsh_mr_barRow {
  display: grid;
  grid-template-columns: minmax(140px, 220px) 1fr 44px;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
/* Label + language badge: the id truncates, the badge never does. */
.dsh_mr_barLabelCell {
  display: inline-flex;
  align-items: center;
  gap: 5px;
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
/* With a catalog repo the title is a link: quiet like the label, brand-tinted
   on hover (same treatment as .dsh_mr_link). */
a.dsh_mr_barLabel { cursor: pointer; text-decoration: none; }
a.dsh_mr_barLabel:hover { color: var(--dsw-alias-brand-primary); text-decoration: underline; }
/* Language pill (site .task-lang parity): tinted border/fill over the
   language color, site palette on data-lang, neutral for other languages. */
.dsh_mr_langBadge {
  --dsh-mr-lang-color: var(--dsw-alias-label-tertiary);
  flex: none;
  padding: 1px 4px;
  border: 1px solid color-mix(in srgb, var(--dsh-mr-lang-color) 58%, var(--dsw-alias-border-l2));
  border-radius: 3px;
  background: color-mix(in srgb, var(--dsh-mr-lang-color) 12%, transparent);
  color: var(--dsh-mr-lang-color);
  font-size: 9.5px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.15px;
  white-space: nowrap;
}
.dsh_mr_langBadge[data-lang='python'] { --dsh-mr-lang-color: #60a5fa; }
.dsh_mr_langBadge[data-lang='javascript'] { --dsh-mr-lang-color: #facc15; }
.dsh_mr_langBadge[data-lang='typescript'] { --dsh-mr-lang-color: #a78bfa; }
.dsh_mr_langBadge[data-lang='go'] { --dsh-mr-lang-color: #22d3ee; }
.dsh_mr_langBadge[data-lang='rust'] { --dsh-mr-lang-color: #fb923c; }
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
.dsh_mr_barFill[data-band="good"] { background: ${STEADY_COLOR}; }
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
.dsh_mr_barVal[data-band="good"] { color: ${STEADY_COLOR}; }
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
.dsh_mr_trendStat strong[data-dir="flat"] { color: var(--dsw-alias-label-secondary); }
.dsh_mr_trendWrap, .dsh_mr_ratingsWrap { position: relative; min-width: 0; }
.dsh_mr_trendWrap svg, .dsh_mr_ratingsWrap svg { display: block; width: 100%; height: auto; }
/* Tab-switched card bodies (trend windows, cost metrics): the in-house
   segmented control above a single active panel. */
.dsh_mr_tabBody { display: flex; flex-direction: column; gap: 10px; }
.dsh_mr_trendPanel { min-width: 0; }
.dsh_mr_trendPanelHead {
  margin-bottom: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
}
/* Cost \xD7 IQ scatter card: filter chip row + effort shape legend.
   Chip states follow the site's toggles: brand-colored pill when on,
   faded + struck-through when off, hover lifts both. */
.dsh_mr_costTitleGroup {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
.dsh_mr_costChips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.dsh_mr_costChip {
  --chip-color: var(--dsw-alias-label-secondary);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 9px;
  border: 1px solid color-mix(in srgb, var(--chip-color) 54%, var(--dsw-alias-border-l2));
  border-radius: 999px;
  background: color-mix(in srgb, var(--chip-color) 9%, transparent);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition:
    opacity 0.14s ease,
    border-color 0.14s ease,
    background-color 0.14s ease;
}
.dsh_mr_costChip:hover {
  border-color: var(--chip-color);
  background: color-mix(in srgb, var(--chip-color) 14%, transparent);
}
.dsh_mr_costChip[data-active='false'] {
  opacity: 0.45;
  border-color: var(--dsw-alias-border-l2);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  text-decoration: line-through;
}
.dsh_mr_costChip[data-active='false']:hover { opacity: 0.8; }
.dsh_mr_costChip[data-all] {
  border-style: dashed;
  border-color: var(--dsw-alias-border-l2);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
}
.dsh_mr_costChip[data-all]:hover {
  border-color: var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_costChipDot {
  width: 12px;
  height: 3px;
  border-radius: 2px;
  background: var(--chip-color);
  flex: none;
}
.dsh_mr_costChip[data-active='true'] .dsh_mr_costChipDot { box-shadow: 0 0 2px var(--chip-color); }
.dsh_mr_costChip[data-active='false'] .dsh_mr_costChipDot { background: var(--dsw-alias-label-secondary); }
.dsh_mr_costScope { font-size: 10.5px; color: var(--dsw-alias-label-secondary); }
/* Outbound links to the source site: quiet, brand-tinted, underline on hover. */
.dsh_mr_link {
  flex: none;
  color: var(--dsw-alias-brand-primary);
  text-decoration: none;
}
.dsh_mr_link:hover { text-decoration: underline; }
/* Model-focus dimming (site parity): hovering a chip focuses that base's
   series alone \u2014 others fade to 0.16, the focused ladder thickens. */
.dsh_mr_costSeries { transition: opacity 0.16s ease; }
.dsh_mr_trendPanel[data-model-focus='true'] .dsh_mr_costSeries.is-muted { opacity: 0.16; }
.dsh_mr_trendPanel[data-model-focus='true'] .dsh_mr_costSeries.is-focused { opacity: 1; }
.dsh_mr_trendPanel[data-model-focus='true'] .dsh_mr_costLadder.is-focused { stroke-width: 3; }
.dsh_mr_costLegend {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 10.5px;
  color: var(--dsw-alias-label-secondary);
}
.dsh_mr_costLegend span { display: inline-flex; align-items: center; gap: 3px; }
.dsh_mr_costLegend svg { width: 11px; height: 11px; overflow: visible; }
.dsh_mr_costSymbol {
  fill: var(--dsw-alias-bg-layer-1);
  stroke: var(--dsw-alias-label-primary);
  stroke-width: 1.6;
}
.dsh_mr_tip {
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -130%);
  /* White surface (cost/IQ/score hover tips): layer-1 is pure white in the
     light theme and stays readable against label-primary in the dark theme. */
  background: var(--dsw-alias-bg-layer-1);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  padding: 3px 8px;
  font-size: 11px;
  white-space: nowrap;
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_tipHead { font-weight: 700; }
/* The live readout in the composer tool row (conversation.input.right, left of
   the model selector): compact text form \u2014 no pill chrome of its own, the
   band-tinted IQ chip carries the color. flex:none keeps it whole; the shell's
   trailing group wraps to its own line when the card runs out of width.
   Typography mirrors the model trigger (13/20/500) instead of inheriting the
   composer's metrics: identical line boxes are what keep the two controls on
   one text band \u2014 every item here shares the trigger's 20px line. */
.dsh_mr_liveReadout {
  box-sizing: border-box;
  appearance: none;
  display: inline-flex;
  align-items: center;
  flex: none;
  gap: 5px;
  min-width: 0;
  padding: 0 6px;
  border: none;
  border-radius: 14px;
  background: none;
  height: 28px;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease;
}
/* Hover/pressed use the shell's overlay tokens, not the layer ladder: in the
   light theme bg-layer-1/2/3 collapse to the same color, so the layer ladder
   would be invisible there. These match the model-selection seat exactly. */
.dsh_mr_liveReadout:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh_mr_liveReadout:active { background: var(--dsw-alias-interactive-bg-active); }
.dsh_mr_liveReadout:focus:not(:focus-visible) { outline: none; }
.dsh_mr_liveReadout:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.dsh_mr_liveLabel { color: var(--dsw-alias-label-secondary); font-size: 10.5px; }
/* The IQ value sits in a small band-tinted chip on the same 20px line as the
   label and the model trigger's text; color/background are inline (band color
   + color-mix tint) so the band semantics cannot be lost to selector or
   ordering issues. */
.dsh_mr_liveIq {
  font-size: 13px;
  line-height: 20px;
  padding: 0 6px;
  border-radius: 7px;
}
.dsh_mr_liveReadout[data-band="low"] .dsh_mr_liveIq { color: var(--dsw-alias-state-error-primary); }
.dsh_mr_liveReadout[data-band="general"] .dsh_mr_liveIq { color: var(--dsw-alias-state-warn-primary); }
.dsh_mr_liveReadout[data-band="steady"] .dsh_mr_liveIq { color: ${STEADY_COLOR}; }
.dsh_mr_liveReadout[data-band="excellent"] .dsh_mr_liveIq,
.dsh_mr_liveReadout[data-band="leading"] .dsh_mr_liveIq { color: var(--dsw-alias-state-success-primary); }
/* The capability popover: a non-modal anchored panel above the readout,
   portaled to body, rendered at the shell's menu elevation. */
.dsh_mr_popover {
  position: fixed;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: min(72vh, 640px);
  padding: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  background: var(--dsw-specific-menu);
  box-shadow: var(--dsw-shadow-lv3);
  color: var(--dsw-alias-label-primary);
  font-size: 12.5px;
}
.dsh_mr_popoverHead {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}
.dsh_mr_popoverTier {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dsh_mr_popoverBody {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
}
.dsh_mr_popoverBody::-webkit-scrollbar { display: none; }
.dsh_mr_popoverFooter {
  flex: none;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
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
.dsh_mr_footerSpacer { flex: 1 1 auto; }
/* Plugin-configuration card (\u8BBE\u7F6E \u2192 \u63D2\u4EF6 \u2192 \u53EF\u914D\u7F6E\u63D2\u4EF6), the collapsible
   disclosure used by ecosystem plugin cards: a full-width header button
   (name + description + chevron) over a conditionally rendered body. The
   card owns the list-item surface the plugins tab stacks; open state flips
   data-open on the card and chevron. */
.dsh_mr_prefCard {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-3);
  border-radius: 8px;
  min-width: 0;
  list-style: none;
  transition: border-color 160ms ease, background-color 160ms ease;
  overflow: hidden;
  margin-bottom: 8px;
}
.dsh_mr_prefCard[data-open="true"] {
  background: var(--dsw-alias-bg-layer-2);
  border-color: var(--dsw-alias-label-dimmed);
}
.dsh_mr_prefHeader {
  width: 100%;
  color: inherit;
  cursor: pointer;
  text-align: left;
  font: inherit;
  background: none;
  border: 0;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  display: flex;
}
.dsh_mr_prefHeader:hover { background: var(--dsw-alias-interactive-bg-hover); }
.dsh_mr_prefHeadText {
  flex-direction: column;
  flex: 1;
  gap: 2px;
  min-width: 0;
  display: flex;
  overflow: hidden;
}
.dsh_mr_prefName {
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 600;
  overflow: hidden;
}
.dsh_mr_prefDescription {
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
  overflow: hidden;
}
.dsh_mr_prefChevron {
  color: var(--dsw-alias-label-tertiary);
  flex: none;
  font-size: 13px;
  transition: transform 120ms ease;
}
.dsh_mr_prefChevron[data-open="true"] { transform: rotate(180deg); }
.dsh_mr_prefBody {
  flex-direction: column;
  gap: 12px;
  padding: 0 14px 14px;
  display: flex;
}
.dsh_mr_prefText {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--dsw-alias-label-secondary);
}
/* The display preference row inside that card (label left, switch right). The
   switch is a button[role="switch"] pill with its state mirrored to data-on;
   colors stay on the alias tokens so both themes invert correctly (on-state
   knob = layer-1 over brand track). */
.dsh_mr_livePref {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 9px;
  background: var(--dsw-alias-bg-layer-1);
  font-size: 12.5px;
  color: var(--dsw-alias-label-primary);
}
.dsh_mr_switch {
  appearance: none;
  flex: none;
  display: inline-flex;
  align-items: center;
  width: 32px;
  height: 18px;
  padding: 0 2px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  background: var(--dsw-alias-bg-layer-2);
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.dsh_mr_switch:hover { border-color: var(--dsw-alias-brand-primary); }
.dsh_mr_switch:focus:not(:focus-visible) { outline: none; }
.dsh_mr_switch:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.dsh_mr_switch[data-on="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: var(--dsw-alias-brand-primary);
}
.dsh_mr_switchKnob {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dsw-alias-label-secondary);
  transition: transform 120ms ease, background-color 120ms ease;
}
.dsh_mr_switch[data-on="true"] .dsh_mr_switchKnob {
  background: var(--dsw-alias-bg-layer-1);
  transform: translateX(14px);
}
@media (max-width: 640px) {
  .dsh_mr_trendStats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh_mr_ovRow { grid-template-columns: 18px 16px minmax(0, 1fr) 58px 100px; gap: 5px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh_mr_ovRow,
  .dsh_mr_ovRow::before,
  .dsh_mr_ovBarFill,
  .dsh_mr_barFill,
  .dsh_mr_taskAggregate > span,
  .dsh_mr_liveReadout,
  .dsh_mr_switch,
  .dsh_mr_switchKnob,
  .dsh_mr_prefCard,
  .dsh_mr_prefChevron { transition: none; }
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
var import_react4 = require("react");
var import_react_dom = require("react-dom");

// src/contract.ts
var SOURCE_SITE_URL = "https://deng.codexradar.com";

// src/client/tierMatch.ts
function normalizeModelToken(model) {
  return model.split("/").pop()?.trim().toLowerCase() ?? model.toLowerCase();
}
function matchTier(view, selection) {
  if (selection === void 0) return null;
  const model = normalizeModelToken(selection.model);
  if (model === "") return null;
  const effort = selection.reasoningEffort?.toLowerCase();
  if (effort !== void 0 && effort !== "") {
    const exact = view.tiers.find(
      (tier) => normalizeModelToken(tier.model) === model && tier.effort.toLowerCase() === effort
    );
    if (exact !== void 0) return { tier: exact, approximate: false };
  }
  const base = view.tiers.find((tier) => normalizeModelToken(tier.model) === model);
  if (base !== void 0) return { tier: base, approximate: true };
  const fuzzy = view.tiers.find(
    (tier) => normalizeModelToken(tier.model).includes(model) || model.includes(normalizeModelToken(tier.model))
  );
  return fuzzy === void 0 ? null : { tier: fuzzy, approximate: true };
}

// src/client/liveVisible.ts
var LEGACY_STORAGE_KEY = "model-radar:live-visible";
var CHANGE_EVENT = "dsh-models-radar:live-visible-change";
var PREF_URL = "/model-radar/api/pref";
var cached = null;
var writeSeq = 0;
var initOnce = null;
var readLegacy = () => {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw === null) return null;
    return raw !== "0";
  } catch {
    return null;
  }
};
var removeLegacy = () => {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
  }
};
function liveVisible() {
  if (cached === null) {
    cached = readLegacy() ?? true;
  }
  return cached;
}
async function fetchHostValue() {
  try {
    const response = await fetch(PREF_URL);
    const body = await response.json();
    return body?.ok === true && typeof body.liveVisible === "boolean" ? body.liveVisible : null;
  } catch {
    return null;
  }
}
async function writeHostValue(value) {
  try {
    await fetch(PREF_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ liveVisible: value })
    });
  } catch {
  }
}
function publish(value) {
  cached = value;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
function initLiveVisible() {
  if (initOnce !== null) return initOnce;
  initOnce = (async () => {
    const writesAtStart = writeSeq;
    const legacy = readLegacy();
    const host = await fetchHostValue();
    if (host === null) return;
    if (writeSeq !== writesAtStart) return;
    if (legacy !== null) {
      if (legacy !== host) await writeHostValue(legacy);
      removeLegacy();
      if (liveVisible() !== legacy) publish(legacy);
      return;
    }
    if (liveVisible() !== host) publish(host);
  })();
  return initOnce;
}
function setLiveVisible(visible) {
  writeSeq += 1;
  publish(visible);
  void writeHostValue(visible);
}
var liveVisibleStore = {
  subscribe(listener) {
    window.addEventListener(CHANGE_EVENT, listener);
    return () => window.removeEventListener(CHANGE_EVENT, listener);
  },
  get: liveVisible
};

// src/client/Overview.tsx
var import_react2 = require("react");

// src/client/ScrollFrame.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var IDLE_METRICS = { scrollable: false, thumbTop: 0, thumbHeight: 0 };
function PersistentScrollFrame({ children, viewportClassName, label }) {
  const viewportRef = (0, import_react.useRef)(null);
  const dragRef = (0, import_react.useRef)(null);
  const [metrics, setMetrics] = (0, import_react.useState)(IDLE_METRICS);
  const measure = (0, import_react.useCallback)(() => {
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
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh_mr_scrollFrame", "data-scrollable": metrics.scrollable, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: viewportRef, className: viewportClassName, children }),
    metrics.scrollable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "dsh_mr_scrollRail",
        onPointerDown: (event) => {
          if (event.target === event.currentTarget) scrollFromTrack(event.clientY, event.currentTarget);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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

// src/client/harness.ts
var HARNESS_META = {
  codex: { label: "Codex", color: "#2dd4bf" },
  "claude-code": { label: "Claude Code", color: "#d97757" },
  dsh: { label: "DSH", color: "#4d6bfe" },
  zcode: { label: "ZCode", color: "#06b6d4" },
  grok: { label: "Grok", color: "#f59e0b" },
  "kimi-code": { label: "Kimi Code", color: "#10b981" },
  antigravity: { label: "Antigravity", color: "#8b5cf6" },
  codebuddy: { label: "CodeBuddy", color: "#ec4899" }
};
function harnessMeta(id) {
  return HARNESS_META[id];
}
function harnessOfModel(model) {
  const id = model.trim().toLowerCase();
  if (id.startsWith("dsh-")) return "dsh";
  if (id === "k3") return "kimi-code";
  if (id.startsWith("glm-5.3")) return "zcode";
  if (id === "grok-4.6") return "grok";
  if (id === "gemini-3.7-flash") return "antigravity";
  if (id === "hy4-preview") return "codebuddy";
  if (id === "claude-sonnet-5" || id === "claude-opus-5") return "claude-code";
  if (id.startsWith("gpt-") || id.startsWith("deepseek-v")) return "codex";
  return null;
}
var PRETTY_MODEL = {
  "deepseek-v4-flash": "DeepSeek V4 Flash",
  "dsh-deepseek-v4-flash": "DeepSeek V4 Flash",
  "deepseek-v4-pro": "DeepSeek V4 Pro",
  "dsh-deepseek-v4-pro": "DeepSeek V4 Pro",
  "dsh-deepseek-v4-flash-vision-exp": "DeepSeek V4 Flash Vision Exp",
  k3: "K3",
  "glm-5.3": "GLM-5.3",
  "glm-5.3-flash": "GLM-5.3 Flash",
  "grok-4.6": "Grok 4.6",
  "gemini-3.7-flash": "Gemini 3.7 Flash",
  "hy4-preview": "HY4 Preview",
  "claude-sonnet-5": "Claude Sonnet 5",
  "claude-opus-5": "Claude Opus 5"
};
function prettyModelName(model) {
  const id = model.trim().toLowerCase();
  const known = PRETTY_MODEL[id];
  if (known !== void 0) return known;
  const suffixed = /^gpt-(\d+\.\d+)-([a-z0-9]+)$/.exec(id);
  if (suffixed !== null) return `GPT-${suffixed[1]} ${suffixed[2].charAt(0).toUpperCase()}${suffixed[2].slice(1)}`;
  const bare = /^gpt-(\d+\.\d+)$/.exec(id);
  if (bare !== null) return `GPT-${bare[1]}`;
  return id.replace(/^gpt-/, "");
}
function costModelLabel(model) {
  const id = model.trim().toLowerCase();
  if (id === "deepseek-v4-flash" || id === "deepseek-v4-pro" || id.startsWith("dsh-")) {
    const name = prettyModelName(model).replace(/^DeepSeek V4\s+/, "DSV4 ");
    return { name, billing: "api", harness: harnessOfModel(model) };
  }
  return { name: prettyModelName(model).replace(/^GPT-5\.6\s+/, ""), billing: "subscription", harness: null };
}
function tierOptionLabel(tier) {
  const harness = harnessOfModel(tier.model);
  return harness === null ? `${tier.model} \xB7 ${tier.effort}` : `${tier.model} \xB7 ${tier.effort} \xB7 ${harnessMeta(harness).label}`;
}
var BASE_MODEL_COLORS = {
  "claude-sonnet-5": "#d97757",
  "claude-opus-5": "#a855f7",
  "grok-4.6": "#f59e0b",
  k3: "#10b981",
  "hy4-preview": "#ec4899",
  "gemini-3.7-flash": "#8b5cf6",
  "glm-5.3": "#f5f5f5",
  "glm-5.3-flash": "#f6c453",
  "gpt-5.6-sol": "#eab308",
  "gpt-5.6-terra": "#3b82f6",
  "gpt-5.6-luna": "#c7d2e0",
  "gpt-5.5": "#00e5ff",
  "deepseek-v4-flash": "#4d6bfe",
  "deepseek-v4-pro": "#a78bfa",
  "dsh-deepseek-v4-flash": "#4d6bfe",
  "dsh-deepseek-v4-pro": "#a78bfa",
  "dsh-deepseek-v4-flash-vision-exp": "#22c55e"
};
var EFFICIENCY_MODEL_COLORS = {
  "claude-sonnet-5": "#d97757",
  "claude-opus-5": "#a855f7",
  "gpt-5.5": "#22d3ee",
  "glm-5.3": "#06b6d4",
  "glm-5.3-flash": "#f6c453",
  "grok-4.6": "#f59e0b",
  "gemini-3.7-flash": "#a78bfa",
  "hy4-preview": "#ec4899",
  "gpt-5.6-sol": "#fbbf24",
  "gpt-5.6-terra": "#3b82f6",
  "gpt-5.6-luna": "#d5dbe5",
  "deepseek-v4-flash": "#c026d3",
  "deepseek-v4-pro": "#f472b6",
  "dsh-deepseek-v4-flash": "#c026d3",
  "dsh-deepseek-v4-pro": "#f472b6",
  "dsh-deepseek-v4-flash-vision-exp": "#16a34a"
};
function modelColor(base) {
  return EFFICIENCY_MODEL_COLORS[base] ?? BASE_MODEL_COLORS[base] ?? "var(--dsw-alias-label-secondary)";
}

// src/client/Overview.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function groupByBase(view) {
  const groups = /* @__PURE__ */ new Map();
  for (const tier of view.tiers) {
    const ladder = groups.get(tier.model);
    if (ladder === void 0) groups.set(tier.model, [tier]);
    else if (!ladder.some((existing) => existing.key === tier.key)) ladder.push(tier);
  }
  return [...groups.entries()].map(([base, tiers]) => ({ base, tiers, best: tiers[0] }));
}
function basesHidingSelection(groups, selectedKey) {
  if (selectedKey === null) return [];
  return groups.filter((group) => group.tiers.some((tier) => tier.key === selectedKey && tier.key !== group.best.key)).map((group) => group.base);
}
function DeltaBadge({ points }) {
  const summary = trendSummary(points ?? []);
  if (summary === null) return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovDelta", "data-dir": "none", children: "\u2014" });
  const delta = deltaSignal({ direction: summary.direction, delta: summary.delta24h });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovDelta", "data-dir": summary.direction, title: "24h", children: [
    delta.glyph,
    " ",
    delta.text
  ] });
}
function TierOverview({ view, selectedKey, currentKey, onSelect, t, scroll = true }) {
  const groups = (0, import_react2.useMemo)(() => groupByBase(view), [view]);
  const [expanded, setExpanded] = (0, import_react2.useState)(() => new Set(basesHidingSelection(groups, selectedKey)));
  (0, import_react2.useEffect)(() => {
    setExpanded((previous) => {
      let changed = false;
      const next = new Set(previous);
      for (const base of basesHidingSelection(groups, selectedKey)) {
        if (!next.has(base)) {
          next.add(base);
          changed = true;
        }
      }
      return changed ? next : previous;
    });
  }, [groups, selectedKey]);
  if (groups.length === 0) return null;
  const toggle = (base) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(base)) next.delete(base);
      else next.add(base);
      return next;
    });
  };
  const list = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "dsh_mr_bars", children: groups.map((group, index) => {
    const isOpen = expanded.has(group.base);
    const isSelected = group.best.key === selectedKey;
    const hasSelectedChild = selectedKey !== null && group.tiers.some((tier) => tier.key === selectedKey && tier.key !== group.best.key);
    const isCurrent = currentKey !== null && currentKey !== void 0 && group.tiers.some((tier) => tier.key === currentKey);
    const harness = harnessOfModel(group.base);
    const widthPct = iqProgress(group.best.iq) * 100;
    const band = iqBand(group.best.iq);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_mr_ovGroup", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          className: "dsh_mr_ovRow",
          "data-selected": isSelected,
          "data-group-selected": hasSelectedChild,
          role: "button",
          "aria-current": isSelected ? "true" : void 0,
          tabIndex: 0,
          onClick: () => onSelect(group.best.key),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") onSelect(group.best.key);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovRank", children: index + 1 }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovName", title: group.base, children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovNameText", children: [
                group.base,
                /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovEffort", children: [
                  " \xB7 ",
                  group.best.effort
                ] })
              ] }),
              harness && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
                "span",
                {
                  className: "dsh_mr_ovHarness",
                  "data-harness": harness,
                  title: `Harness \xB7 ${harnessMeta(harness).label}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovHarnessDot" }),
                    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovHarnessLabel", children: harnessMeta(harness).label })
                  ]
                }
              ),
              isCurrent && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovCurrent", children: t("overview.current") })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DeltaBadge, { points: view.series[group.best.key] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovIqCell", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovBarFill", "data-band": band, style: { width: `${widthPct}%` } }),
              band === "leading" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovLevel", children: t("level.leading") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovIqVal", children: group.best.iq.toFixed(1) })
            ] })
          ]
        }
      ),
      isOpen && group.tiers.filter((tier) => tier.key !== group.best.key).map((tier) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
        "div",
        {
          className: "dsh_mr_ovRow dsh_mr_ovChild",
          "data-selected": tier.key === selectedKey,
          role: "button",
          "aria-current": tier.key === selectedKey ? "true" : void 0,
          tabIndex: 0,
          onClick: () => onSelect(tier.key),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") onSelect(tier.key);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovRank" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovChevron" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovName", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovNameText", children: tier.effort }) }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DeltaBadge, { points: view.series[tier.key] }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("span", { className: "dsh_mr_ovIqCell", children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                "span",
                {
                  className: "dsh_mr_ovBarFill",
                  "data-band": iqBand(tier.iq),
                  style: { width: `${iqProgress(tier.iq) * 100}%` }
                }
              ),
              iqBand(tier.iq) === "leading" && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovLevel", children: t("level.leading") }),
              /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_ovIqVal", children: tier.iq.toFixed(1) })
            ] })
          ]
        },
        tier.key
      ))
    ] }, group.base);
  }) });
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "dsh_mr_cardHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_cardTitle", children: t("overview.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "dsh_mr_hint", children: t("overview.hint") })
    ] }),
    scroll ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(PersistentScrollFrame, { viewportClassName: "dsh_mr_ovScroll", label: t("overview.title"), children: list }) : list
  ] });
}

// src/client/format.ts
function pctText(rate) {
  return `${Math.round(rate * 100)}%`;
}
function moneyText(value) {
  return value === null ? "\u2014" : `$${value.toFixed(2)}`;
}
function minutesText(value) {
  return value === null ? "\u2014" : `${value.toFixed(1)} min`;
}

// src/client/charts.tsx
var import_react3 = require("react");

// src/client/plotFrame.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var PLOT_W = 640;
var PLOT_H = 190;
var AXIS_STYLE = { fontSize: 10.5, fill: "var(--dsw-alias-label-secondary)" };
function viewBoxX(event, width) {
  const rect = event.currentTarget.getBoundingClientRect();
  return (event.clientX - rect.left) / rect.width * width;
}
function HGrid({
  y,
  x1,
  x2,
  label,
  dash = "3 4"
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("g", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1, x2, y1: y, y2: y, stroke: "var(--dsw-alias-border-l1)", strokeDasharray: dash }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("text", { x: x1 - 6, y: y + 3.5, textAnchor: "end", style: AXIS_STYLE, children: label })
  ] });
}
function PlotTip({
  x,
  y,
  width,
  height,
  accent,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh_mr_tip", style: { left: `${x / width * 100}%`, top: `${y / height * 100}%`, borderColor: accent }, children });
}

// src/client/plotGeometry.ts
var BAND_BOUNDARIES = [70, 85, 95, 100];
function buildSegments(values, x, y) {
  const pieces = [];
  const add = (color, point) => {
    const last = pieces[pieces.length - 1];
    if (last !== void 0 && last.color === color) {
      last.d.push(`L ${point[0].toFixed(1)} ${point[1].toFixed(1)}`);
      last.x1 = point[0];
    } else {
      pieces.push({ color, d: [`M ${point[0].toFixed(1)} ${point[1].toFixed(1)}`], x0: point[0], x1: point[0] });
    }
  };
  for (let i = 0; i < values.length - 1; i++) {
    const v0 = values[i];
    const v1 = values[i + 1];
    const interior = BAND_BOUNDARIES.filter(
      (boundary) => boundary > Math.min(v0, v1) && boundary < Math.max(v0, v1)
    );
    const stops = (v1 < v0 ? [...interior].reverse() : interior).map(
      (boundary) => ({
        value: boundary,
        point: [x(i) + (x(i + 1) - x(i)) * ((boundary - v0) / (v1 - v0)), y(boundary)]
      })
    );
    let from = [x(i), y(v0)];
    let startValue = v0;
    for (const stop of [...stops, { value: v1, point: [x(i + 1), y(v1)] }]) {
      const color = bandColor(iqBand((startValue + stop.value) / 2));
      add(color, from);
      add(color, stop.point);
      from = stop.point;
      startValue = stop.value;
    }
  }
  return pieces.map(({ color, d, x0, x1 }) => ({ color, path: d.join(" "), x0, x1 }));
}
function fitRange(values) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }
  const slack = (max - min) * 0.08;
  return { lo: min - slack, hi: max + slack };
}
function logDomain(values) {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (!(hi / lo > 1.0000001)) {
    lo /= 3;
    hi *= 3;
  }
  return { lo, hi };
}

// src/client/taskMetrics.ts
var BINARY_CATEGORIES = ["pass", "split", "fail"];
var CONTINUOUS_CATEGORIES = ["excellent", "good", "general", "low"];
function taskMode(benchmark, scoringMode) {
  return benchmark === "deep-swe" || scoringMode === "binary-majority" ? "binary" : "continuous";
}
function classifyBinary(row) {
  const [, rate, majorityPassed] = row;
  if (majorityPassed === true || majorityPassed === void 0 && rate >= 2 / 3) return "pass";
  if (rate > 0) return "split";
  return "fail";
}
function classifyContinuous(row) {
  const rate = row[1];
  if (rate >= 0.75) return "excellent";
  if (rate >= 0.5) return "good";
  if (rate >= 0.25) return "general";
  return "low";
}
var ascending = (a, b) => a.row[1] - b.row[1] || a.row[0].localeCompare(b.row[0]);
function scan(rows, classify) {
  const items = [];
  const countOf = /* @__PURE__ */ new Map();
  let sum = 0;
  for (const row of rows) {
    const category = classify(row);
    items.push({ row, category });
    countOf.set(category, (countOf.get(category) ?? 0) + 1);
    sum += row[1];
  }
  items.sort(ascending);
  const buckets = /* @__PURE__ */ new Map();
  for (const item of items) {
    const bucket = buckets.get(item.category);
    if (bucket === void 0) buckets.set(item.category, [item]);
    else bucket.push(item);
  }
  return { items, buckets, countOf, average: rows.length === 0 ? 0 : sum / rows.length };
}
function legend(categories, buckets, countOf) {
  const byCategory = {};
  const counts = [];
  for (const category of categories) {
    byCategory[category] = buckets.get(category) ?? [];
    counts.push({ category, count: countOf.get(category) ?? 0 });
  }
  return { byCategory, counts };
}
function diagnoseTasks(rows, mode) {
  if (mode === "binary") {
    const { items: items2, buckets: buckets2, countOf: countOf2, average: average2 } = scan(rows, classifyBinary);
    const { byCategory: byCategory2, counts: counts2 } = legend(BINARY_CATEGORIES, buckets2, countOf2);
    const passed = countOf2.get("pass") ?? 0;
    return {
      mode: "binary",
      rows: items2,
      counts: counts2,
      byCategory: byCategory2,
      average: average2,
      summary: { passed, total: rows.length, rate: Math.round(passed / Math.max(1, rows.length) * 100) }
    };
  }
  const { items, buckets, countOf, average } = scan(rows, classifyContinuous);
  const { byCategory, counts } = legend(CONTINUOUS_CATEGORIES, buckets, countOf);
  return {
    mode: "continuous",
    rows: items,
    counts,
    byCategory,
    average,
    summary: { rate: Math.round(average * 100) }
  };
}
function visibleOf(diagnostics, filter) {
  if (filter === "all") return diagnostics.rows;
  const buckets = diagnostics.byCategory;
  return buckets[filter] ?? diagnostics.rows;
}
var LANGUAGES = {
  python: { label: "Py", full: "Python" },
  javascript: { label: "JS", full: "JavaScript" },
  typescript: { label: "TS", full: "TypeScript" },
  go: { label: "Go", full: "Go" },
  rust: { label: "Rust", full: "Rust" }
};
function taskLanguageBadge(language) {
  const full = language?.trim() ?? "";
  if (full === "") return null;
  const known = LANGUAGES[full.toLowerCase()];
  return known !== void 0 ? { id: full.toLowerCase(), label: known.label, full: known.full } : { id: "other", label: full, full };
}

// src/client/charts.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var PAD = { top: 16, right: 14, bottom: 26, left: 46 };
var BAND_LABEL = {
  low: "level.low",
  general: "level.general",
  steady: "level.steady",
  excellent: "level.excellent",
  leading: "level.leading"
};
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
function TrendPanel({
  title,
  emptyText,
  points,
  t
}) {
  const [hoverIndex, setHoverIndex] = (0, import_react3.useState)(null);
  const summary = windowSummary(points);
  const geometry = (0, import_react3.useMemo)(() => {
    if (points.length < 2) return null;
    const { lo: lo2, hi: hi2 } = fitRange(points.map(([, value]) => value));
    const innerW = PLOT_W - PAD.left - PAD.right;
    const innerH = PLOT_H - PAD.top - PAD.bottom;
    const x2 = (index) => PAD.left + index / (points.length - 1) * innerW;
    const y2 = (value) => PAD.top + (1 - (value - lo2) / (hi2 - lo2)) * innerH;
    return {
      lo: lo2,
      hi: hi2,
      x: x2,
      y: y2,
      last: points.length - 1,
      baseline: PLOT_H - PAD.bottom,
      segments: buildSegments(points.map(([, value]) => value), x2, y2),
      bandLines: BAND_BOUNDARIES.map((boundary) => ({ boundary, py: y2(boundary) })).filter(({ py }) => py >= PAD.top - 0.5 && py <= PLOT_H - PAD.bottom + 0.5)
    };
  }, [points]);
  const head = title !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_trendPanelHead", children: title }) : null;
  if (geometry === null || summary === null) {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "dsh_mr_trendPanel", children: [
      head,
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_empty", children: emptyText })
    ] });
  }
  const { lo, hi, x, y, last, baseline, segments, bandLines } = geometry;
  const mid = (lo + hi) / 2;
  const hovered = hoverIndex !== null ? points[hoverIndex] : void 0;
  const changeText = deltaSignal({ direction: summary.direction, delta: summary.change }).text;
  const endpointColor = bandColor(iqBand(points[last][1]));
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("section", { className: "dsh_mr_trendPanel", children: [
    head,
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_trendStats", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_trendStat", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_trendStatLabel", children: t("trend.change") }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { "data-dir": summary.direction, children: changeText })
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
          viewBox: `0 0 ${PLOT_W} ${PLOT_H}`,
          role: "img",
          "aria-label": `${title} \xB7 IQ trend`,
          onMouseMove: (event) => {
            const relX = viewBoxX(event, PLOT_W);
            const ratio = (relX - PAD.left) / (PLOT_W - PAD.left - PAD.right);
            setHoverIndex(clamp(Math.round(ratio * (points.length - 1)), 0, points.length - 1));
          },
          onMouseLeave: () => setHoverIndex(null),
          children: [
            [hi, mid, lo].map((value) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(HGrid, { y: y(value), x1: PAD.left, x2: PLOT_W - PAD.right, label: value.toFixed(1), dash: value === mid ? "none" : "3 4" }, value)),
            bandLines.map(({ boundary, py }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("line", { x1: PAD.left, x2: PLOT_W - PAD.right, y1: py, y2: py, stroke: "var(--dsw-alias-border-l2)", strokeDasharray: "2 4" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: PLOT_W - PAD.right + 6, y: py + 3.5, textAnchor: "start", style: { ...AXIS_STYLE, fontSize: 9 }, children: boundary })
            ] }, boundary)),
            segments.map((segment, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "path",
                {
                  d: `${segment.path} L ${segment.x1.toFixed(1)} ${baseline} L ${segment.x0.toFixed(1)} ${baseline} Z`,
                  fill: segment.color,
                  fillOpacity: "0.09"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: segment.path, fill: "none", stroke: segment.color, strokeWidth: "2", strokeLinejoin: "round", strokeLinecap: "round" })
            ] }, index)),
            hovered !== void 0 && hoverIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("line", { x1: x(hoverIndex), x2: x(hoverIndex), y1: PAD.top, y2: PLOT_H - PAD.bottom, stroke: "var(--dsw-alias-border-l2)" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: x(hoverIndex), cy: y(hovered[1]), r: "3", fill: "var(--dsw-alias-bg-layer-1)", stroke: bandColor(iqBand(hovered[1])), strokeWidth: "2" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("circle", { cx: x(last), cy: y(points[last][1]), r: "3.8", fill: endpointColor }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: x(last), y: y(points[last][1]) - 9, textAnchor: "end", style: { ...AXIS_STYLE, fontWeight: 600, fill: "var(--dsw-alias-label-primary)" }, children: points[last][1].toFixed(1) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: PAD.left, y: PLOT_H - 8, style: AXIS_STYLE, children: formatStamp(points[0][0], false) }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("text", { x: PLOT_W - PAD.right, y: PLOT_H - 8, textAnchor: "end", style: AXIS_STYLE, children: formatStamp(points[last][0], false) })
          ]
        }
      ),
      hovered !== void 0 && hoverIndex !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(PlotTip, { x: x(hoverIndex), y: y(hovered[1]), width: PLOT_W, height: PLOT_H, children: [
        formatStamp(hovered[0], true),
        " \xB7 ",
        hovered[1].toFixed(1),
        " ",
        t(BAND_LABEL[iqBand(hovered[1])])
      ] })
    ] })
  ] });
}
var TREND_WINDOW_KEY = "model-radar:trend-window";
function readTrendWindow() {
  try {
    return localStorage.getItem(TREND_WINDOW_KEY) === "24h" ? "24h" : "7d";
  } catch {
    return "7d";
  }
}
function TrendTabs({ points, t }) {
  const [win, setWin] = (0, import_react3.useState)(readTrendWindow);
  const select = (next) => {
    try {
      localStorage.setItem(TREND_WINDOW_KEY, next);
    } catch {
    }
    setWin(next);
  };
  const points24 = (0, import_react3.useMemo)(() => sliceRecentPoints(points, 24), [points]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_tabBody", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_seg", role: "tablist", "aria-label": t("line.title"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dsh_mr_segBtn", role: "tab", "aria-selected": win === "24h", "data-active": win === "24h", onClick: () => select("24h"), children: t("window.24h") }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dsh_mr_segBtn", role: "tab", "aria-selected": win === "7d", "data-active": win === "7d", onClick: () => select("7d"), children: t("window.7d") })
    ] }),
    win === "24h" ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TrendPanel, { emptyText: t("empty.noRecent"), points: points24, t }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(TrendPanel, { emptyText: t("empty.noSeries"), points, t })
  ] });
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
var COLLAPSED_ROW_COUNT = 8;
function TaskBars({
  rows,
  benchmark,
  scoringMode,
  taskMeta,
  t,
  scroll = true,
  collapsible = false
}) {
  const mode = taskMode(benchmark, scoringMode);
  const [filter, setFilter] = (0, import_react3.useState)("all");
  (0, import_react3.useEffect)(() => setFilter("all"), [mode]);
  const diagnostics = (0, import_react3.useMemo)(() => diagnoseTasks(rows, mode), [rows, mode]);
  const total = rows.length;
  const summary = diagnostics.mode === "binary" ? fmt(t("task.summary.pass"), {
    passed: String(diagnostics.summary.passed),
    total: String(diagnostics.summary.total),
    rate: `${diagnostics.summary.rate}%`
  }) : fmt(t("task.summary.average"), { rate: `${diagnostics.summary.rate}%` });
  const visible = visibleOf(diagnostics, filter);
  const [expanded, setExpanded] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => setExpanded(false), [rows, filter]);
  const collapsed = collapsible && !expanded && visible.length > COLLAPSED_ROW_COUNT;
  const shown = collapsed ? visible.slice(0, COLLAPSED_ROW_COUNT) : visible;
  const bars = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_bars", children: shown.map(({ row: [taskId, rate], category }) => {
    const meta = taskMeta?.[taskId];
    const badge = taskLanguageBadge(meta?.language);
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_barRow", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_barLabelCell", children: [
        meta?.repo !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "a",
          {
            className: "dsh_mr_barLabel",
            href: meta.repo,
            target: "_blank",
            rel: "noopener noreferrer",
            title: taskId,
            children: taskId
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "dsh_mr_barLabel", title: taskId, children: taskId }),
        badge !== null && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            className: "dsh_mr_langBadge",
            "data-lang": badge.id,
            title: fmt(t("task.lang.title"), { language: badge.full }),
            children: badge.label
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_barTrack", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_barFill", "data-band": category, style: { width: `${clamp(rate, 0, 1) * 100}%` } }) }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("span", { className: "dsh_mr_barVal", "data-band": category, children: [
        Math.round(rate * 100),
        "%"
      ] })
    ] }, taskId);
  }) });
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_jsx_runtime4.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_taskSummary", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "dsh_mr_taskSummaryHead", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("strong", { children: summary }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: total })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_taskAggregate", role: "img", "aria-label": summary, children: diagnostics.counts.map(({ category, count }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { "data-band": category, style: { width: `${count / Math.max(1, total) * 100}%` } }, category)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "dsh_mr_taskFilters", children: [{ category: "all", count: total }, ...diagnostics.counts].map(({ category, count }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("button", { type: "button", "data-active": filter === category, "data-band": category, onClick: () => setFilter(category), children: [
      t(FILTER_KEYS[category]),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { children: count })
    ] }, category)) }),
    scroll ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PersistentScrollFrame, { viewportClassName: "dsh_mr_taskScroll", label: t("bar.title"), children: bars }) : bars,
    collapsible && visible.length > COLLAPSED_ROW_COUNT && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { type: "button", className: "dsh_mr_more", onClick: () => setExpanded((value) => !value), children: collapsed ? fmt(t("task.expand"), { count: String(visible.length) }) : t("task.collapse") })
  ] });
}

// src/client/TierDetail.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function TierBadges({ tier, t }) {
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_badges", children: badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_badge", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_badgeVal", "data-accent": badge.accent === true, "data-band": badge.band, children: badge.value }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_badgeLabel", children: badge.label })
  ] }, badge.label)) });
}
function TrendCard({
  tiers,
  value,
  onChange,
  hint,
  points,
  t
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_cardHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_cardTitle", children: t("line.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
        "select",
        {
          className: "dsh_mr_select",
          value,
          onChange: (event) => onChange(event.target.value),
          "aria-label": t("line.title"),
          children: [
            value === "" && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: "", children: "\u2014" }),
            tiers.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("option", { value: candidate.key, children: tierOptionLabel(candidate) }, candidate.key))
          ]
        }
      )
    ] }),
    hint !== void 0 && hint !== null && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_hint", children: hint }),
    points.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TrendTabs, { points, t }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_empty", children: t("empty.noSeries") })
  ] });
}
function TaskCard({
  view,
  tierKey,
  t,
  scroll = true
}) {
  const rows = tierKey !== null ? view.taskRates[tierKey] ?? [] : [];
  const tier = tierKey !== null ? view.tiers.find((candidate) => candidate.key === tierKey) : void 0;
  const label = view.scoreLabel || (tier?.passRate != null ? pctText(tier.passRate) : "");
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "dsh_mr_cardTitle", children: fmt(t("bar.title"), { label }) }),
    rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      TaskBars,
      {
        rows,
        benchmark: view.benchmark,
        scoringMode: view.scoringMode,
        taskMeta: view.taskMeta,
        t,
        scroll,
        collapsible: !scroll
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "dsh_mr_empty", children: t("empty.none") })
  ] });
}

// src/client/LiveCapability.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var REFRESH_INTERVAL_MS = 15 * 6e4;
var POPOVER_WIDTH = 460;
var POPOVER_GAP = 8;
var POPOVER_Z = 1100;
function LiveCapability({ useSession, modelDirectories, loadData: loadData2, t }) {
  const sessionId = useSession((session) => session.sessionId);
  const directory = (0, import_react4.useMemo)(() => modelDirectories.directoryFor(sessionId), [modelDirectories, sessionId]);
  const directoryState = (0, import_react4.useSyncExternalStore)(
    (listener) => directory.store.subscribe(listener),
    () => directory.store.getSnapshot()
  );
  const [view, setView] = (0, import_react4.useState)(null);
  const [open, setOpen] = (0, import_react4.useState)(false);
  const [anchor, setAnchor] = (0, import_react4.useState)(null);
  const [viewTierKey, setViewTierKey] = (0, import_react4.useState)(null);
  const buttonRef = (0, import_react4.useRef)(null);
  const popoverRef = (0, import_react4.useRef)(null);
  const liveVisible2 = (0, import_react4.useSyncExternalStore)(liveVisibleStore.subscribe, liveVisibleStore.get);
  (0, import_react4.useEffect)(() => {
    if (directory.store.getSnapshot().current === null) void directory.load().catch(() => void 0);
  }, [directory]);
  (0, import_react4.useEffect)(() => {
    if (!liveVisible2) return;
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
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [loadData2, sessionId, liveVisible2]);
  const selection = directoryState.current;
  const match = (0, import_react4.useMemo)(
    () => view === null || selection === null ? null : matchTier(view, selection),
    [selection, view]
  );
  const close = (0, import_react4.useCallback)(() => {
    setOpen(false);
    setAnchor(null);
    setViewTierKey(null);
  }, []);
  (0, import_react4.useEffect)(() => {
    if (!liveVisible2) close();
  }, [liveVisible2, close]);
  const onToggle = () => {
    if (open) {
      close();
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect === void 0) return;
    setAnchor({ left: rect.left, top: rect.top, width: rect.width });
    setOpen(true);
  };
  (0, import_react4.useEffect)(() => {
    if (!open) return;
    const measure = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect === void 0) return;
      setAnchor(
        (previous) => previous !== null && previous.left === rect.left && previous.top === rect.top && previous.width === rect.width ? previous : { left: rect.left, top: rect.top, width: rect.width }
      );
    };
    const onPointerDown = (event) => {
      const target = event.target instanceof Node ? event.target : null;
      if (target !== null && (popoverRef.current?.contains(target) === true || buttonRef.current?.contains(target) === true)) return;
      close();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("resize", measure);
    document.addEventListener("scroll", measure, true);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", measure);
      document.removeEventListener("scroll", measure, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);
  (0, import_react4.useEffect)(() => {
    if (open && match === null) close();
  }, [open, match, close]);
  (0, import_react4.useEffect)(() => {
    setViewTierKey(null);
  }, [match?.tier.key]);
  if (!liveVisible2 || view === null || selection === null || match === null) return null;
  const tier = match.tier;
  const detailTier = viewTierKey !== null ? view.tiers.find((candidate) => candidate.key === viewTierKey) ?? tier : tier;
  const viewingSessionTier = detailTier.key === tier.key;
  const displayedIq = `${match.approximate ? "\u2248" : ""}${tier.iq.toFixed(1)}`;
  const detailSeries = view.series[detailTier.key] ?? [];
  const width = Math.min(POPOVER_WIDTH, window.innerWidth - 24);
  const anchorLeft = anchor === null ? 12 : Math.max(12, Math.min(anchor.left + anchor.width / 2 - width / 2, window.innerWidth - width - 12));
  const popoverBottom = anchor === null ? 0 : window.innerHeight - anchor.top + POPOVER_GAP;
  const popover = open && anchor !== null ? (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "section",
      {
        ref: popoverRef,
        className: "dsh_mr_popover",
        role: "region",
        "aria-label": t("popover.title"),
        style: { left: anchorLeft, bottom: popoverBottom, width, zIndex: POPOVER_Z },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("header", { className: "dsh_mr_popoverHead", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("strong", { className: "dsh_mr_popoverTier", children: [
            viewingSessionTier && match.approximate ? "\u2248 " : "",
            detailTier.model,
            " \xB7 ",
            detailTier.effort
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "dsh_mr_popoverBody", children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              TierOverview,
              {
                view,
                selectedKey: detailTier.key,
                currentKey: tier.key,
                onSelect: setViewTierKey,
                t,
                scroll: false
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TierBadges, { tier: detailTier, t }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
              TrendCard,
              {
                tiers: view.tiers,
                value: detailTier.key,
                onChange: setViewTierKey,
                points: detailSeries,
                t
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TaskCard, { view, tierKey: detailTier.key, t, scroll: false })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("footer", { className: "dsh_mr_popoverFooter", children: [
            fmt(t("updated"), { time: new Date(view.fetchedAt).toLocaleString() }),
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("a", { className: "dsh_mr_link", href: SOURCE_SITE_URL, target: "_blank", rel: "noreferrer noopener", children: [
              t("action.openSite"),
              " \u2197"
            ] })
          ] })
        ]
      }
    ),
    document.body
  ) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
      "button",
      {
        ref: buttonRef,
        type: "button",
        className: "dsh_mr_liveReadout",
        "data-band": iqBand(tier.iq),
        "data-open": open,
        "aria-expanded": open,
        onClick: onToggle,
        title: `${selection.model}${selection.reasoningEffort ? ` \xB7 ${selection.reasoningEffort}` : ""} \xB7 ${tier.key}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "dsh_mr_liveLabel", children: t("live.label") }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "strong",
            {
              className: "dsh_mr_liveIq",
              style: {
                color: bandColor(iqBand(tier.iq)),
                background: `color-mix(in srgb, ${bandColor(iqBand(tier.iq))} 12%, transparent)`
              },
              children: displayedIq
            }
          )
        ]
      }
    ),
    popover
  ] });
}

// src/client/RadarSection.tsx
var import_react7 = require("react");

// src/client/costScatter.tsx
var import_react5 = require("react");

// src/client/costMetrics.ts
var COMBINED_SPEED_WEIGHT = Math.log(2.5) / Math.log(1.35);
var DEFAULT_HIDDEN_BASES = ["deepseek-v4-flash", "deepseek-v4-pro"];
var EFFORT_ORDER = ["off", "low", "medium", "high", "xhigh", "max", "ultra"];
function combinedCostIndex(price, minutes) {
  if (price === null || minutes === null || !(price > 0) || !(minutes > 0)) return null;
  return price * Math.pow(minutes / 10, COMBINED_SPEED_WEIGHT) * 100;
}
function combinedIndexText(value) {
  if (value >= 100) return "100";
  const decimals = Math.min(5, Math.max(2, Math.ceil(-Math.log10(value))));
  return String(Number(value.toFixed(decimals)));
}
function tipSampleCounts(tier) {
  return {
    price: tier.tokenSamples !== void 0 && tier.tokenSamples > 0 ? tier.tokenSamples : tier.total,
    minutes: tier.total
  };
}
function listBases(tiers) {
  const bases = [];
  const seen = /* @__PURE__ */ new Set();
  for (const tier of tiers) {
    if (!seen.has(tier.model)) {
      seen.add(tier.model);
      bases.push(tier.model);
    }
  }
  return bases;
}
function costValue(metric, tier) {
  if (metric === "combined") return combinedCostIndex(tier.avgPrice, tier.avgMinutes);
  return metric === "minutes" ? tier.avgMinutes : tier.avgPrice;
}
function buildLadders(points) {
  const byBase = /* @__PURE__ */ new Map();
  for (const point of points) {
    const ladder = byBase.get(point.tier.model);
    if (ladder === void 0) byBase.set(point.tier.model, [point]);
    else ladder.push(point);
  }
  for (const ladder of byBase.values()) {
    ladder.sort(
      (a, b) => EFFORT_ORDER.indexOf(a.tier.effort) - EFFORT_ORDER.indexOf(b.tier.effort) || a.x - b.x
    );
  }
  return [...byBase.values()];
}
function buildCostDataset(visibleTiers) {
  const raw = { combined: [], minutes: [], price: [] };
  for (const tier of visibleTiers) {
    for (const metric of ["combined", "minutes", "price"]) {
      const value = costValue(metric, tier);
      if (value !== null && value > 0) raw[metric].push({ tier, x: value });
    }
  }
  const combinedMax = raw.combined.reduce((max, point) => Math.max(max, point.x), 0);
  const points = {
    combined: combinedMax > 0 ? raw.combined.map((point) => ({ tier: point.tier, x: point.x / combinedMax * 100 })) : [],
    minutes: raw.minutes,
    price: raw.price
  };
  return {
    points,
    ladders: {
      combined: buildLadders(points.combined),
      minutes: buildLadders(points.minutes),
      price: buildLadders(points.price)
    }
  };
}

// src/client/costScatter.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function effortShapePath(effort, cx, cy, r) {
  const x = Number(cx);
  const y = Number(cy);
  const point = (px, py) => `${px.toFixed(1)} ${py.toFixed(1)}`;
  if (effort === "off") {
    return `M${point(x - r * 0.78, y - r * 0.78)} L${point(x + r * 0.78, y + r * 0.78)} M${point(x + r * 0.78, y - r * 0.78)} L${point(x - r * 0.78, y + r * 0.78)}`;
  }
  if (effort === "medium") {
    return `M${point(x, y - r)} L${point(x + r, y + r * 0.85)} L${point(x - r, y + r * 0.85)} Z`;
  }
  if (effort === "high") {
    const s = r * 0.82;
    return `M${point(x - s, y - s)} L${point(x + s, y - s)} L${point(x + s, y + s)} L${point(x - s, y + s)} Z`;
  }
  if (effort === "xhigh") {
    return `M${point(x, y - r)} L${point(x + r, y)} L${point(x, y + r)} L${point(x - r, y)} Z`;
  }
  if (effort === "max") {
    const w = r * 0.86;
    return `M${point(x - w, y - r * 0.5)} L${point(x, y - r)} L${point(x + w, y - r * 0.5)} L${point(x + w, y + r * 0.5)} L${point(x, y + r)} L${point(x - w, y + r * 0.5)} Z`;
  }
  if (effort === "ultra") {
    const star = [];
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      const radius = i % 2 ? r * 0.45 : r;
      star.push(point(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius));
    }
    return `M${star.join(" L")} Z`;
  }
  return `M${point(x - r, y)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${point(x + r, y)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${point(x - r, y)} Z`;
}
function logTicks(min, max) {
  const ticks = [];
  const start = Math.floor(Math.log10(min));
  const end = Math.ceil(Math.log10(max));
  for (let decade = start; decade <= end; decade++) {
    for (const step of [1, 2, 5]) {
      const value = step * 10 ** decade;
      if (value >= min * 0.999 && value <= max * 1.001) ticks.push(value);
    }
  }
  if (ticks.length > 7) return ticks.filter((value) => /(^5|^1)0*$/.test(String(value).replace(".", "")));
  return ticks;
}
function fmtX(metric, value) {
  if (metric === "price") return `$${value < 1 ? value.toFixed(2) : value >= 10 ? Math.round(value) : value.toFixed(1)}`;
  if (metric === "minutes") return `${value < 10 ? value.toFixed(1) : Math.round(value)} \u5206\u949F`;
  return value < 1 ? value.toFixed(2) : value < 10 ? value.toFixed(1) : Math.round(value).toString();
}
var PAD2 = { top: 14, right: 16, bottom: 26, left: 40 };
var IQ_MAX = 120;
function CostTip({ point, metric, t }) {
  const tier = point.tier;
  const label = costModelLabel(tier.model);
  const attribution = [label.name, label.billing === "api" ? "API" : t("cost.tip.sub")];
  if (label.harness !== null) attribution.push(harnessMeta(label.harness).label);
  attribution.push(tier.effort);
  const samples = tipSampleCounts(tier);
  const metricLine = metric === "combined" ? fmt(t("cost.tip.combined"), { index: combinedIndexText(point.x), price: String(samples.price), minutes: String(samples.minutes) }) : metric === "minutes" ? fmt(t("cost.tip.minutes"), { minutes: String(Math.round(point.x)), samples: String(samples.minutes) }) : fmt(t("cost.tip.price"), { price: `$${point.x.toFixed(2)}`, samples: String(samples.price) });
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dsh_mr_tipHead", style: { color: modelColor(tier.model) }, children: attribution.join(" \xB7 ") }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: fmt(t("cost.tip.iq"), { iq: tier.iq.toFixed(1), passed: String(tier.passed), total: String(tier.total) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: metricLine })
  ] });
}
function CostPanel({
  title,
  metric,
  points,
  ladders,
  focus,
  t
}) {
  const [hover, setHover] = (0, import_react5.useState)(null);
  const seriesClass = (model) => {
    if (focus === null) return "dsh_mr_costSeries";
    return focus === model ? "dsh_mr_costSeries is-focused" : "dsh_mr_costSeries is-muted";
  };
  const head = title !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dsh_mr_trendPanelHead", children: title }) : null;
  if (points.length === 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("section", { className: "dsh_mr_trendPanel", children: [
      head,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dsh_mr_empty", children: t("cost.empty") })
    ] });
  }
  const { lo, hi } = logDomain(points.map((point) => point.x));
  const loLog = Math.log10(lo);
  const spanLog = Math.log10(hi) - loLog;
  const innerW = PLOT_W - PAD2.left - PAD2.right;
  const innerH = PLOT_H - PAD2.top - PAD2.bottom;
  const px = (value) => PAD2.left + (Math.log10(value) - loLog) / spanLog * innerW;
  const py = (iq) => PAD2.top + (1 - Math.min(iq, IQ_MAX) / IQ_MAX) * innerH;
  const ticks = logTicks(lo, hi);
  const iqTicks = [0, 20, 40, 60, 80, 100, 120];
  const hovered = hover !== null ? points[hover] : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("section", { className: "dsh_mr_trendPanel", "data-model-focus": focus !== null ? "true" : void 0, children: [
    head,
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_trendWrap", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "svg",
        {
          viewBox: `0 0 ${PLOT_W} ${PLOT_H}`,
          role: "img",
          "aria-label": title,
          onMouseMove: (event) => {
            const relX = viewBoxX(event, PLOT_W);
            let best = 0;
            let bestDist = Number.POSITIVE_INFINITY;
            points.forEach((point, index) => {
              const dist = Math.abs(px(point.x) - relX);
              if (dist < bestDist) {
                bestDist = dist;
                best = index;
              }
            });
            setHover(best);
          },
          onMouseLeave: () => setHover(null),
          children: [
            iqTicks.map((value) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(HGrid, { y: py(value), x1: PAD2.left, x2: PLOT_W - PAD2.right, label: value, dash: value === 0 ? "none" : "3 4" }, value)),
            ticks.map((value) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("line", { x1: px(value), x2: px(value), y1: PAD2.top, y2: PLOT_H - PAD2.bottom, stroke: "var(--dsw-alias-border-l1)", strokeDasharray: "3 4" }),
              /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("text", { x: px(value), y: PLOT_H - 8, textAnchor: "middle", style: AXIS_STYLE, children: fmtX(metric, value) })
            ] }, value)),
            ladders.map(
              (ladder) => ladder.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                "path",
                {
                  className: `${seriesClass(ladder[0].tier.model)} dsh_mr_costLadder`,
                  d: ladder.map((point, index) => `${index ? "L" : "M"}${px(point.x).toFixed(1)} ${py(point.tier.iq).toFixed(1)}`).join(" "),
                  fill: "none",
                  stroke: modelColor(ladder[0].tier.model),
                  strokeWidth: "2.1",
                  strokeLinejoin: "round",
                  strokeLinecap: "round",
                  opacity: "0.78"
                },
                ladder[0].tier.model
              ) : null
            ),
            points.map(({ tier, x }, index) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "path",
              {
                className: seriesClass(tier.model),
                d: effortShapePath(tier.effort, px(x), py(tier.iq), 5),
                fill: "var(--dsw-alias-bg-layer-1)",
                stroke: modelColor(tier.model),
                strokeWidth: hover === index ? 2.6 : 1.8
              },
              tier.key
            ))
          ]
        }
      ),
      hovered !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(PlotTip, { x: px(hovered.x), y: py(hovered.iq), width: PLOT_W, height: PLOT_H, accent: modelColor(hovered.tier.model), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CostTip, { point: hovered, metric, t }) })
    ] })
  ] });
}
var COST_METRIC_KEY = "model-radar:cost-metric";
var COST_METRICS = ["combined", "minutes", "price"];
var COST_TAB_KEYS = {
  combined: "cost.tab.combined",
  minutes: "cost.tab.minutes",
  price: "cost.tab.price"
};
function readCostMetric() {
  try {
    const stored = localStorage.getItem(COST_METRIC_KEY);
    return stored !== null && COST_METRICS.includes(stored) ? stored : "combined";
  } catch {
    return "combined";
  }
}
function CostScatterCard({ view, t }) {
  const [hidden, setHidden] = (0, import_react5.useState)(() => new Set(DEFAULT_HIDDEN_BASES));
  const [metric, setMetric] = (0, import_react5.useState)(readCostMetric);
  const [focus, setFocus] = (0, import_react5.useState)(null);
  const bases = (0, import_react5.useMemo)(() => listBases(view.tiers), [view.tiers]);
  const dataset = (0, import_react5.useMemo)(
    () => buildCostDataset(view.tiers.filter((tier) => !hidden.has(tier.model))),
    [view.tiers, hidden]
  );
  const toggle = (base) => {
    setHidden((previous) => {
      const next = new Set(previous);
      if (next.has(base)) next.delete(base);
      else next.add(base);
      return next;
    });
  };
  const selectMetric = (next) => {
    try {
      localStorage.setItem(COST_METRIC_KEY, next);
    } catch {
    }
    setMetric(next);
  };
  const points = dataset.points[metric];
  const ladders = dataset.ladders[metric];
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_cardHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_costTitleGroup", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dsh_mr_cardTitle", children: t("cost.title") }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dsh_mr_hint", children: t("cost.hint") })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dsh_mr_costLegend", children: EFFORT_ORDER.map((effort) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("span", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("svg", { viewBox: "0 0 12 12", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("path", { className: "dsh_mr_costSymbol", d: effortShapePath(effort, 6, 6, 4) }) }),
        effort
      ] }, effort)) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_costChips", role: "group", "aria-label": t("cost.filter.all"), children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("button", { type: "button", className: "dsh_mr_costChip", "data-all": "", onClick: () => setHidden(/* @__PURE__ */ new Set()), children: t("cost.filter.all") }),
      bases.map((base) => /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
        "button",
        {
          type: "button",
          className: "dsh_mr_costChip",
          "data-active": !hidden.has(base),
          style: { "--chip-color": modelColor(base) },
          onClick: () => toggle(base),
          onMouseEnter: () => setFocus(base),
          onMouseLeave: () => setFocus(null),
          onFocus: () => setFocus(base),
          onBlur: () => setFocus(null),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "dsh_mr_costChipDot" }),
            base
          ]
        },
        base
      ))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "dsh_mr_tabBody", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "dsh_mr_seg", role: "tablist", "aria-label": t("cost.title"), children: COST_METRICS.map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        "button",
        {
          type: "button",
          className: "dsh_mr_segBtn",
          role: "tab",
          "aria-selected": metric === candidate,
          "data-active": metric === candidate,
          onClick: () => selectMetric(candidate),
          children: t(COST_TAB_KEYS[candidate])
        },
        candidate
      )) }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(CostPanel, { metric, points, ladders, focus, t })
    ] })
  ] });
}

// src/client/ratingsCard.tsx
var import_react6 = require("react");

// src/client/ratingsMetrics.ts
var EFFORT_DISPLAY_ORDER = ["ultra", "max", "xhigh", "high", "medium", "low", "off"];
var effortRank = (effort) => {
  const at = EFFORT_DISPLAY_ORDER.indexOf(effort);
  return at === -1 ? EFFORT_DISPLAY_ORDER.length : at;
};
function ratingsSlots(primary, secondary) {
  const seen = /* @__PURE__ */ new Set();
  const slots = [];
  for (const tier of [...primary ?? [], ...secondary ?? []]) {
    if (seen.has(tier.key)) continue;
    seen.add(tier.key);
    slots.push({ key: tier.key, model: tier.model, effort: tier.effort });
  }
  const groupOrder = /* @__PURE__ */ new Map();
  for (const slot of slots) if (!groupOrder.has(slot.model)) groupOrder.set(slot.model, groupOrder.size);
  slots.sort(
    (a, b) => (groupOrder.get(a.model) ?? 0) - (groupOrder.get(b.model) ?? 0) || effortRank(a.effort) - effortRank(b.effort)
  );
  return slots;
}
function ratingsGroups(slots) {
  const groups = [];
  for (const slot of slots) {
    const last = groups[groups.length - 1];
    if (last !== void 0 && last.model === slot.model) last.slots.push(slot);
    else groups.push({ model: slot.model, slots: [slot] });
  }
  return groups;
}
function matchRatingsTier(tiers, selectedKey) {
  if (selectedKey === null) return null;
  const exact = tiers.find((tier) => tier.key === selectedKey);
  if (exact !== void 0) return { tier: exact, approx: false };
  const at = selectedKey.indexOf("@");
  if (at <= 0) return null;
  const base = selectedKey.slice(0, at);
  const candidates = tiers.filter((tier) => tier.model === base);
  if (candidates.length === 0) return null;
  const rated = candidates.filter((tier) => tier.average !== null);
  const pool = rated.length > 0 ? rated : candidates;
  const best = pool.reduce((acc, candidate) => {
    const accScore = acc.average ?? -1;
    const candidateScore = candidate.average ?? -1;
    if (candidateScore !== accScore) return candidateScore > accScore ? candidate : acc;
    return effortRank(candidate.effort) < effortRank(acc.effort) ? candidate : acc;
  });
  return { tier: best, approx: true };
}

// src/client/ratingsCard.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var RATINGS_W = 720;
var RATINGS_H = 224;
var PAD3 = { top: 26, right: 10, bottom: 42, left: 30 };
var SCORE_MAX = 10;
var groupName = (model) => costModelLabel(model).name;
function RatingsCard({
  win,
  onWinChange,
  payloads,
  errors,
  loading,
  onRetry,
  selectedKey,
  t
}) {
  const tiers7d = payloads["7d"]?.data?.tiers;
  const tiers24h = payloads["24h"]?.data?.tiers;
  const slots = (0, import_react6.useMemo)(() => ratingsSlots(tiers7d, tiers24h), [tiers7d, tiers24h]);
  const groups = (0, import_react6.useMemo)(() => ratingsGroups(slots), [slots]);
  const active = payloads[win]?.data ?? null;
  const error = errors[win];
  const busy = loading[win] === true;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "dsh_mr_card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "dsh_mr_cardHead", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "dsh_mr_cardTitle", children: t("ratings.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dsh_mr_seg", role: "tablist", "aria-label": t("ratings.title"), children: ["7d", "24h"].map((candidate) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": candidate === win,
          className: "dsh_mr_segBtn",
          "data-active": candidate === win,
          onClick: () => onWinChange(candidate),
          children: candidate === "7d" ? t("window.7d") : t("window.24h")
        },
        candidate
      )) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dsh_mr_hint", children: t("ratings.hint") }),
    active !== null ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
      payloads[win]?.stale === true && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "warn", children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "dsh_mr_bannerText", children: fmt(t("status.stale"), {
          time: new Date(payloads[win]?.fetchedAt ?? active.fetchedAt).toLocaleString(),
          reason: payloads[win]?.notice ?? ""
        }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: onRetry, children: t("action.retry") })
      ] }),
      active.tiers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dsh_mr_empty", children: t("ratings.empty") }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(RatingsChart, { slots, groups, active: active.tiers, selectedKey, t })
    ] }) : error !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "dsh_mr_empty", children: [
      fmt(t("status.failed"), { reason: error }),
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: onRetry, children: t("action.retry") })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dsh_mr_empty", children: busy ? t("ratings.loading") : t("ratings.empty") })
  ] });
}
function RatingsChart({
  slots,
  groups,
  active,
  selectedKey,
  t
}) {
  const [hover, setHover] = (0, import_react6.useState)(null);
  const geometry = (0, import_react6.useMemo)(() => {
    const innerW = RATINGS_W - PAD3.left - PAD3.right;
    const innerH = RATINGS_H - PAD3.top - PAD3.bottom;
    const baseline2 = PAD3.top + innerH;
    const pitch = innerW / Math.max(1, slots.length);
    const barW2 = Math.min(20, Math.max(6, pitch * 0.6));
    const cx2 = (index) => PAD3.left + pitch * (index + 0.5);
    const y2 = (score) => PAD3.top + (1 - score / SCORE_MAX) * innerH;
    const separators2 = [];
    let runLength = 0;
    for (const group of groups) {
      runLength += group.slots.length;
      if (runLength < slots.length) separators2.push(PAD3.left + pitch * runLength);
    }
    return { innerH, baseline: baseline2, pitch, barW: barW2, cx: cx2, y: y2, separators: separators2 };
  }, [slots.length, groups]);
  const scoreOf = (0, import_react6.useMemo)(() => {
    const map = /* @__PURE__ */ new Map();
    for (const tier of active) map.set(tier.key, tier);
    return map;
  }, [active]);
  const match = (0, import_react6.useMemo)(() => matchRatingsTier(active, selectedKey), [active, selectedKey]);
  const { baseline, barW, cx, y, separators } = geometry;
  const hovered = hover !== null ? slots[hover] : void 0;
  const hoveredScore = hovered !== void 0 ? scoreOf.get(hovered.key) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "dsh_mr_ratingsWrap", children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      "svg",
      {
        viewBox: `0 0 ${RATINGS_W} ${RATINGS_H}`,
        role: "img",
        "aria-label": t("ratings.chart.label"),
        onMouseLeave: () => setHover(null),
        children: [
          [2, 4, 6, 8].map((value) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(HGrid, { y: y(value), x1: PAD3.left, x2: RATINGS_W - PAD3.right, label: value }, value)),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(HGrid, { y: y(0), x1: PAD3.left, x2: RATINGS_W - PAD3.right, label: 0, dash: "none" }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(HGrid, { y: y(SCORE_MAX), x1: PAD3.left, x2: RATINGS_W - PAD3.right, label: SCORE_MAX }),
          separators.map((x) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            "line",
            {
              x1: x,
              x2: x,
              y1: PAD3.top,
              y2: baseline,
              stroke: "var(--dsw-alias-border-l1)",
              strokeDasharray: "2 5"
            },
            x
          )),
          groups.map((group) => {
            const first = slots.indexOf(group.slots[0]);
            const last = first + group.slots.length - 1;
            return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
              "text",
              {
                x: (cx(first) + cx(last)) / 2,
                y: 12,
                textAnchor: "middle",
                style: { fontSize: 9.5, fontWeight: 600, fill: modelColor(group.model) },
                children: groupName(group.model)
              },
              group.model
            );
          }),
          slots.map((slot, index) => {
            const reading = scoreOf.get(slot.key);
            const highlighted = match !== null && match.tier.key === slot.key;
            const color = modelColor(slot.model);
            return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("g", { children: [
              reading !== void 0 && reading.average !== null ? /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(import_jsx_runtime8.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "rect",
                  {
                    x: cx(index) - barW / 2,
                    y: y(reading.average),
                    width: barW,
                    height: baseline - y(reading.average),
                    rx: 2,
                    fill: color,
                    opacity: hover === null || hover === index ? 1 : 0.55,
                    stroke: highlighted ? "var(--dsw-alias-label-primary)" : "none",
                    strokeWidth: highlighted ? 1.5 : 0
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                  "text",
                  {
                    x: cx(index),
                    y: y(reading.average) - 5,
                    textAnchor: "middle",
                    style: { fontSize: 9, fontWeight: 600, fill: color },
                    children: `${match !== null && match.approx && highlighted ? "\u2248" : ""}${reading.average.toFixed(1)}`
                  }
                )
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "text",
                {
                  x: cx(index),
                  y: baseline - 6,
                  textAnchor: "middle",
                  style: { fontSize: 7.5, fill: "var(--dsw-alias-label-secondary)" },
                  children: t("ratings.none")
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "text",
                {
                  x: cx(index) + 2,
                  y: baseline + 7,
                  textAnchor: "end",
                  transform: `rotate(-42 ${cx(index) + 2} ${baseline + 7})`,
                  style: AXIS_STYLE,
                  children: slot.effort
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
                "rect",
                {
                  x: cx(index) - geometry.pitch / 2,
                  y: PAD3.top,
                  width: geometry.pitch,
                  height: baseline - PAD3.top,
                  fill: "transparent",
                  onMouseEnter: () => setHover(index)
                }
              )
            ] }, slot.key);
          })
        ]
      }
    ),
    hovered !== void 0 && hover !== null && /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
      PlotTip,
      {
        x: cx(hover),
        y: PAD3.top + 8,
        width: RATINGS_W,
        height: RATINGS_H,
        accent: modelColor(hovered.model),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "dsh_mr_tipHead", style: { color: modelColor(hovered.model) }, children: `${groupName(hovered.model)} \xB7 ${hovered.effort}` }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { children: hoveredScore?.average != null ? fmt(t("ratings.tip.score"), {
            score: hoveredScore.average.toFixed(1),
            count: String(hoveredScore.count)
          }) : t("ratings.tip.none") })
        ]
      }
    )
  ] });
}

// src/client/RadarSection.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var LS_BENCH = "model-radar:benchmark";
var RATINGS_LS = "model-radar:ratings-window";
var readRatingsWindow = () => typeof localStorage !== "undefined" && localStorage.getItem(RATINGS_LS) === "24h" ? "24h" : "7d";
var FALLBACK_CHANNELS = [
  { id: "deep-swe", title: "DeepSWE", scoreLabel: "Pass rate", isDefault: true },
  { id: "pompeii-adjacency", title: "\u5E9E\u8D1D\u58C1\u753B", scoreLabel: "Adjacency F1", isDefault: false }
];
function RadarSection({ loadData: loadData2, loadRatings: loadRatings2, modelDirectories, useSessions, t }) {
  const [benchmark, setBenchmark] = (0, import_react7.useState)(() => localStorage.getItem(LS_BENCH) ?? "deep-swe");
  const [payload, setPayload] = (0, import_react7.useState)(null);
  const [error, setError] = (0, import_react7.useState)(null);
  const [loading, setLoading] = (0, import_react7.useState)(true);
  const loadSeq = (0, import_react7.useRef)(0);
  const load = (0, import_react7.useCallback)(
    async (target, bypass = false) => {
      const seq = ++loadSeq.current;
      setLoading(true);
      setError(null);
      try {
        const response = await loadData2(target, void 0, bypass);
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
  (0, import_react7.useEffect)(() => {
    void load(benchmark);
  }, [benchmark, load]);
  const view = payload?.data ?? null;
  const currentSessionId = useSessions((state) => state.current);
  const directory = (0, import_react7.useMemo)(() => {
    if (currentSessionId === void 0) return null;
    try {
      return modelDirectories.directoryFor(currentSessionId);
    } catch {
      return null;
    }
  }, [modelDirectories, currentSessionId]);
  const directoryState = (0, import_react7.useSyncExternalStore)(
    (listener) => directory?.store.subscribe(listener) ?? (() => {
    }),
    () => directory?.store.getSnapshot() ?? null
  );
  (0, import_react7.useEffect)(() => {
    if (directory !== null && directory.store.getSnapshot().current === null) {
      void directory.load().catch(() => void 0);
    }
  }, [directory]);
  const sessionSelection = directoryState?.current ?? void 0;
  const selectionPending = directoryState?.status === "loading";
  const [selectedKey, setSelectedKey] = (0, import_react7.useState)(null);
  (0, import_react7.useEffect)(() => {
    setSelectedKey(null);
  }, [benchmark]);
  const sessionMatch = (0, import_react7.useMemo)(
    () => view === null || selectionPending ? null : matchTier(view, sessionSelection),
    [view, selectionPending, sessionSelection]
  );
  const defaultMatch = (0, import_react7.useMemo)(
    () => view === null || selectionPending || sessionMatch !== null ? null : matchTier(view, view.defaultModel),
    [view, selectionPending, sessionMatch]
  );
  const autoKey = sessionMatch?.tier.key ?? defaultMatch?.tier.key ?? null;
  const sessionMatchKey = sessionMatch?.tier.key ?? null;
  const tierKey = selectedKey ?? autoKey;
  const tier = view?.tiers.find((candidate) => candidate.key === tierKey) ?? null;
  const autoSelection = selectionPending ? void 0 : sessionSelection ?? view?.defaultModel;
  const matchHint = view !== null && selectedKey === null && autoKey === null && autoSelection !== void 0 ? fmt(t("match.hint"), { model: autoSelection.model }) : null;
  const selectTier = (key) => {
    setSelectedKey(key);
  };
  const switchBenchmark = (id) => {
    if (id === benchmark) return;
    localStorage.setItem(LS_BENCH, id);
    setBenchmark(id);
  };
  const channels = view !== null && view.channels.length > 0 ? view.channels : FALLBACK_CHANNELS;
  const seriesPoints = tierKey !== null ? view?.series[tierKey] ?? [] : [];
  const [ratingsWin, setRatingsWin] = (0, import_react7.useState)(readRatingsWindow);
  const [ratings, setRatings] = (0, import_react7.useState)({});
  const [ratingsErrors, setRatingsErrors] = (0, import_react7.useState)({});
  const [ratingsLoading, setRatingsLoading] = (0, import_react7.useState)({});
  const ratingsSeqs = (0, import_react7.useRef)({});
  const loadRatingsFor = (0, import_react7.useCallback)(
    async (win, bypass = false) => {
      const seq = (ratingsSeqs.current[win] ?? 0) + 1;
      ratingsSeqs.current[win] = seq;
      setRatingsLoading((prev) => ({ ...prev, [win]: true }));
      try {
        const response = await loadRatings2(win, void 0, bypass);
        if (ratingsSeqs.current[win] !== seq) return;
        if (response.ok) {
          setRatings((prev) => ({ ...prev, [win]: response }));
          setRatingsErrors((prev) => ({ ...prev, [win]: void 0 }));
        } else {
          setRatingsErrors((prev) => ({ ...prev, [win]: response.error }));
        }
      } catch (cause) {
        if (ratingsSeqs.current[win] !== seq) return;
        setRatingsErrors((prev) => ({
          ...prev,
          [win]: cause instanceof Error ? cause.message : String(cause)
        }));
      } finally {
        if (ratingsSeqs.current[win] === seq) setRatingsLoading((prev) => ({ ...prev, [win]: false }));
      }
    },
    [loadRatings2]
  );
  (0, import_react7.useEffect)(() => {
    void loadRatingsFor(ratingsWin);
  }, [ratingsWin, loadRatingsFor]);
  const switchRatingsWindow = (win) => {
    if (win === ratingsWin) return;
    try {
      localStorage.setItem(RATINGS_LS, win);
    } catch {
    }
    setRatingsWin(win);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("section", { className: "dsh_mr_section", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_header", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "dsh_mr_title", children: t("title") }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_subtitle", children: [
          t("subtitle.pre"),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("a", { className: "dsh_mr_link", href: SOURCE_SITE_URL, target: "_blank", rel: "noreferrer noopener", children: "deng.codexradar.com" }),
          t("subtitle.post")
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "dsh_mr_seg", role: "tablist", "aria-label": t("channel.label"), children: channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
    loading && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "info", "aria-live": "polite", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dsh_mr_spin" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dsh_mr_bannerText", children: t("status.refreshing") })
    ] }),
    !loading && payload?.stale === true && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "warn", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dsh_mr_bannerText", children: fmt(t("status.stale"), {
        time: new Date(payload.fetchedAt ?? payload.data?.fetchedAt ?? Date.now()).toLocaleString(),
        reason: payload.notice ?? ""
      }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: () => void load(benchmark), children: t("action.retry") })
    ] }),
    !loading && error !== null && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_banner", "data-tone": "error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dsh_mr_bannerText", children: fmt(t("status.failed"), { reason: error }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("button", { type: "button", className: "dsh_mr_retry", onClick: () => void load(benchmark), children: t("action.retry") })
    ] }),
    view !== null && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TierOverview, { view, selectedKey: tierKey, currentKey: sessionMatchKey, onSelect: selectTier, t }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TierBadges, { tier, t }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        TrendCard,
        {
          tiers: view.tiers,
          value: tierKey ?? "",
          onChange: selectTier,
          hint: matchHint,
          points: seriesPoints,
          t
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(TaskCard, { view, tierKey, t }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(CostScatterCard, { view, t }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        RatingsCard,
        {
          win: ratingsWin,
          onWinChange: switchRatingsWindow,
          payloads: ratings,
          errors: ratingsErrors,
          loading: ratingsLoading,
          onRetry: () => void loadRatingsFor(ratingsWin, true),
          selectedKey: tierKey,
          t
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "dsh_mr_footer", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "span",
          {
            className: "dsh_mr_dot",
            "data-fresh": payload?.stale === true ? "false" : "true",
            title: payload?.stale === true ? "stale snapshot" : "fresh"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: fmt(t("updated"), { time: new Date(view.fetchedAt).toLocaleString() }) }),
        view.sourceUpdatedAt !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { children: [
          "\xB7 ",
          t("source.updated"),
          ": ",
          new Date(view.sourceUpdatedAt).toLocaleString()
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("a", { className: "dsh_mr_link", href: SOURCE_SITE_URL, target: "_blank", rel: "noreferrer noopener", children: [
          t("action.openSite"),
          " \u2197"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "dsh_mr_footerSpacer" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            type: "button",
            className: "dsh_mr_refresh",
            onClick: () => {
              void load(benchmark, true);
              void loadRatingsFor(ratingsWin, true);
            },
            disabled: loading,
            children: t("action.refresh")
          }
        )
      ] })
    ] })
  ] });
}

// src/client/PrefCard.tsx
var import_react8 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
function PrefCard({ t }) {
  const visible = (0, import_react8.useSyncExternalStore)(liveVisibleStore.subscribe, liveVisibleStore.get);
  const [open, setOpen] = (0, import_react8.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("li", { className: "dsh_mr_prefCard", "data-open": open, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
      "button",
      {
        type: "button",
        className: "dsh_mr_prefHeader",
        "aria-expanded": open,
        onClick: () => setOpen(!open),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("span", { className: "dsh_mr_prefHeadText", children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "dsh_mr_prefName", children: t("pref.card.title") }),
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "dsh_mr_prefDescription", children: t("pref.card.description") })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "dsh_mr_prefChevron", "data-open": open, "aria-hidden": "true", children: "\u25BE" })
        ]
      }
    ),
    open && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "dsh_mr_prefBody", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "dsh_mr_livePref", children: [
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { children: t("live.pref.label") }),
        /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "button",
          {
            type: "button",
            role: "switch",
            "aria-checked": visible,
            "aria-label": t("live.pref.label"),
            className: "dsh_mr_switch",
            "data-on": visible,
            onClick: () => setLiveVisible(!visible),
            children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "dsh_mr_switchKnob" })
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "dsh_mr_prefText", children: t("live.pref.hint") }),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "dsh_mr_prefText", children: t("pref.card.pointer") })
    ] })
  ] });
}

// src/client/index.ts
var inject = ["slots", "locale", "modelDirectories"];
async function loadData(benchmark, signal, bypass = false) {
  const url = `/model-radar/api/data?benchmark=${encodeURIComponent(benchmark)}` + (bypass ? "&bypass=1" : "");
  const response = await fetch(url, { signal });
  const body = await response.json();
  if (!response.ok || body.ok !== true) {
    throw new Error(body.ok === false ? body.error : `HTTP ${response.status}`);
  }
  return body;
}
async function loadRatings(window2, signal, bypass = false) {
  const url = `/model-radar/api/ratings?window=${encodeURIComponent(window2)}` + (bypass ? "&bypass=1" : "");
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
  void initLiveVisible();
  const t = ctx.locale.bind(NS);
  const modelDirectories = ctx.get("modelDirectories");
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "model-radar",
    order: 25,
    label: () => t("nav"),
    // The shell matches this against a hardcoded whitelist — shipped shells
    // only special-case "data" / "agent-preset" / "personalization" and fall
    // back to a generic gear for anything else (a "radar" branch exists only
    // in unreleased dev shells). "data" is the closest attributed glyph.
    icon: "data",
    locale: NS,
    inject: () => ({ loadData, loadRatings, modelDirectories })
  }, RadarSection));
  ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
    name: "settings.plugin.item",
    key: "dsh-models-radar",
    id: "model-radar-pref",
    order: 130,
    locale: NS,
    inject: () => ({})
  }, PrefCard));
  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "model-radar-live",
    order: 10,
    locale: NS,
    inject: () => ({ modelDirectories, loadData })
  }, LiveCapability));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
