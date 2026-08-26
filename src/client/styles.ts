/**
 * The radar stylesheet, hand-written as a template string and injected once by
 * the plugin body: the web server serves exactly one file per client plugin,
 * so no separate CSS artifact may exist. Tokens come only from the shared
 * `--dsw-alias-*` design platform (no literal colors); class names carry the
 * `dsh_mr` prefix to stay unique in the assembled shell.
 */

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
.dsh_mr_ovRow:hover { background: var(--dsw-alias-bg-layer-2); }
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
.dsh_mr_ovName {
  font-size: 12.5px;
  color: var(--dsw-alias-label-primary);
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
  appearance: none;
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
  font: inherit;
  font-variant-numeric: tabular-nums;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}
.dsh_mr_liveReadout:hover { background: var(--dsw-alias-bg-layer-2); }
.dsh_mr_liveReadout:active { background: var(--dsw-alias-bg-layer-3); }
.dsh_mr_liveReadout:focus:not(:focus-visible) { outline: none; }
.dsh_mr_liveReadout:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.dsh_mr_liveChevron {
  display: inline-block;
  flex: none;
  font-size: 10px;
  line-height: 1;
  color: var(--dsw-alias-label-secondary);
  transition: transform 120ms ease;
}
.dsh_mr_liveReadout[data-open="true"] .dsh_mr_liveChevron { transform: rotate(90deg); }
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
.dsh_mr_popoverChannel {
  flex: none;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
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
@media (max-width: 640px) {
  .dsh_mr_trendStats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dsh_mr_ovRow { grid-template-columns: 18px 16px minmax(0, 1fr) 58px 100px; gap: 5px; }
  .dsh_mr_liveSpark { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh_mr_ovRow,
  .dsh_mr_ovRow::before,
  .dsh_mr_ovBarFill,
  .dsh_mr_barFill,
  .dsh_mr_taskAggregate > span,
  .dsh_mr_liveReadout,
  .dsh_mr_liveChevron { transition: none; }
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
