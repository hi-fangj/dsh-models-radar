/**
 * The radar stylesheet, hand-written as a template string and injected once by
 * the plugin body: the web server serves exactly one file per client plugin,
 * so no separate CSS artifact may exist. Tokens come only from the shared
 * `--dsw-alias-*` design platform (no literal colors); class names carry the
 * `dsh_mr` prefix to stay unique in the assembled shell.
 */

/** The steady/good band semantic color; see scoreMetrics.STEADY_COLOR. */
import { STEADY_COLOR } from './scoreMetrics.ts'

/** Stable `<style>` element id (idempotent injection across HMR re-runs). */
export const STYLE_ID = 'dsh-models-radar-style'

/** The section's injected stylesheet text. */
export const cssText = `
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
   hover/drag) — never the brand token, which is near-black in the light
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
/* Site harnessbar palette; codex — the site's default harness — wears its
   default accent, since #8b5cf6 is antigravity's slot there. */
.dsh_mr_ovHarness[data-harness='codex'] { --dsh-mr-harness-color: #2dd4bf; }
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
/* Cost × IQ scatter card: filter chip row + effort shape legend.
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
   series alone — others fade to 0.16, the focused ladder thickens. */
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
   the model selector): compact text form — no pill chrome of its own, the
   band-tinted IQ chip carries the color. flex:none keeps it whole; the shell's
   trailing group wraps to its own line when the card runs out of width.
   Typography mirrors the model trigger (13/20/500) instead of inheriting the
   composer's metrics: identical line boxes are what keep the two controls on
   one text band — every item here shares the trigger's 20px line. */
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
/* Plugin-configuration card (设置 → 插件 → 可配置插件), the collapsible
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
`

/** Inject or update the stylesheet and return its fiber-scoped disposer. */
export function adoptStyles(): () => void {
  let element = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (element === null) {
    element = document.createElement('style')
    element.id = STYLE_ID
    document.head.appendChild(element)
  }
  element.textContent = cssText
  return () => {
    element?.remove()
  }
}
