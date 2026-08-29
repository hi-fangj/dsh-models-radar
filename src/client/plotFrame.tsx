/**
 * Shared plumbing for the two hand-rolled SVG plots (trend panel, cost
 * scatter): canvas constants, the viewport→viewBox pointer conversion, the
 * horizontal gridline row, and the percent-positioned tooltip. Deliberately
 * NOT a chart framework — only pieces with two consumers earn a place here;
 * single-consumer variants (vertical log ticks, band reference lines) stay
 * inline in their charts. Scale math lives in plotGeometry.ts where the node
 * test line can reach it.
 */
import type { MouseEvent, ReactNode } from 'react'

/** Shared canvas size: both plots draw on the same 640×190 viewBox. */
export const PLOT_W = 640
export const PLOT_H = 190

/** Shared axis-label style (was an identical object in both charts). */
export const AXIS_STYLE = { fontSize: 10.5, fill: 'var(--dsw-alias-label-secondary)' } as const

/** Convert a pointer event's client x into the SVG viewBox x of a plot width. */
export function viewBoxX(event: MouseEvent<SVGSVGElement>, width: number): number {
  const rect = event.currentTarget.getBoundingClientRect()
  return ((event.clientX - rect.left) / rect.width) * width
}

/** One horizontal gridline with an end-anchored label on the left edge. */
export function HGrid({
  y,
  x1,
  x2,
  label,
  dash = '3 4',
}: {
  y: number
  x1: number
  x2: number
  label: ReactNode
  /** SVG strokeDasharray; 'none' for the emphasized (zero/mid) line. */
  dash?: string
}) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke="var(--dsw-alias-border-l1)" strokeDasharray={dash} />
      <text x={x1 - 6} y={y + 3.5} textAnchor="end" style={AXIS_STYLE}>{label}</text>
    </g>
  )
}

/** The shared hover tooltip, positioned by viewBox coordinates as percentages. */
export function PlotTip({
  x,
  y,
  width,
  height,
  accent,
  children,
}: {
  x: number
  y: number
  width: number
  height: number
  /** Optional series accent for the border (cost scatter's model color); absent keeps the neutral border. */
  accent?: string
  children: ReactNode
}) {
  return (
    <div className="dsh_mr_tip" style={{ left: `${(x / width) * 100}%`, top: `${(y / height) * 100}%`, borderColor: accent }}>
      {children}
    </div>
  )
}
