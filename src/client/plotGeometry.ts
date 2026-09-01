/**
 * Pure geometry for the hand-rolled SVG plots: capability-band segmentation,
 * linear range fitting, and the log-domain guard. Plain math on numbers — no
 * React, no DOM — so the node test line reaches the most bug-prone
 * interpolation in the repo. Band semantics: CONTEXT.md 能力等级.
 */
import { bandColor, iqBand } from './scoreMetrics.ts'

/** Capability-band boundaries drawn as reference lines; see CONTEXT.md. */
export const BAND_BOUNDARIES = [70, 85, 95, 100]

/** One painted polyline piece: a band color plus an SVG path and its x extent. */
export interface PaintedPiece {
  color: string
  path: string
  x0: number
  x1: number
}

/**
 * Split a trend into capability-band-colored polylines. Adjacent sample
 * points in the same band merge into one path; a segment crossing a band
 * boundary is split exactly at the boundary IQ (linear interpolation), and
 * the color switches at every boundary in BOTH travel directions (CONTEXT.md
 * 趋势: 穿过边界时换色) — the stroke up to the boundary keeps the upper
 * band's color, the stroke beyond it takes the lower one.
 */
export function buildSegments(values: number[], x: (index: number) => number, y: (value: number) => number): PaintedPiece[] {
  const pieces: Array<{ color: string; d: string[]; x0: number; x1: number }> = []
  const add = (color: string, point: [number, number]): void => {
    const last = pieces[pieces.length - 1]
    if (last !== undefined && last.color === color) {
      last.d.push(`L ${point[0].toFixed(1)} ${point[1].toFixed(1)}`)
      last.x1 = point[0]
    } else {
      pieces.push({ color, d: [`M ${point[0].toFixed(1)} ${point[1].toFixed(1)}`], x0: point[0], x1: point[0] })
    }
  }
  for (let i = 0; i < values.length - 1; i++) {
    const v0 = values[i]
    const v1 = values[i + 1]
    const interior = BAND_BOUNDARIES.filter(
      (boundary) => boundary > Math.min(v0, v1) && boundary < Math.max(v0, v1),
    )
    // Stops in travel order: v0 → interior boundaries → v1. Each boundary's
    // path position interpolates linearly by value, so a descent splits like
    // an ascent.
    const stops = (v1 < v0 ? [...interior].reverse() : interior).map(
      (boundary): { value: number; point: [number, number] } => ({
        value: boundary,
        point: [x(i) + (x(i + 1) - x(i)) * ((boundary - v0) / (v1 - v0)), y(boundary)],
      }),
    )
    let from: [number, number] = [x(i), y(v0)]
    let startValue = v0
    for (const stop of [...stops, { value: v1, point: [x(i + 1), y(v1)] as [number, number] }]) {
      // No boundary lies strictly inside a span between consecutive stops, so
      // the span's color is the band of its open interval — the midpoint's
      // band. Coloring by the crossed boundary instead would keep the upper
      // band's color all the way down on descents.
      const color = bandColor(iqBand((startValue + stop.value) / 2))
      add(color, from)
      add(color, stop.point)
      from = stop.point
      startValue = stop.value
    }
  }
  return pieces.map(({ color, d, x0, x1 }) => ({ color, path: d.join(' '), x0, x1 }))
}

/**
 * Fit a linear y-domain around the observed values: 8% slack on both sides,
 * with a ±0.5 spread guard when every value is identical (a flat series must
 * not divide by a zero-height range). Precondition: values non-empty.
 */
export function fitRange(values: number[]): { lo: number; hi: number } {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  for (const value of values) {
    if (value < min) min = value
    if (value > max) max = value
  }
  if (min === max) {
    min -= 0.5
    max += 0.5
  }
  const slack = (max - min) * 0.08
  return { lo: min - slack, hi: max + slack }
}

/**
 * Fit a log x-domain over positive values, widening a degenerate (or
 * single-point) span by ×3 in both directions so the axis never works with a
 * zero-width log range. Precondition: values non-empty and positive.
 */
export function logDomain(values: number[]): { lo: number; hi: number } {
  let lo = Math.min(...values)
  let hi = Math.max(...values)
  if (!(hi / lo > 1.0000001)) {
    lo /= 3
    hi *= 3
  }
  return { lo, hi }
}

/** Time domain of a one-reading trend window, plus where the reading sits in it. */
export interface SinglePointSpan {
  /** Domain edges in epoch ms, lo ≤ hi. */
  lo: number
  hi: number
  /** The reading's fraction across [lo, hi]: 0 = test-time edge, 1 = now edge. */
  pointFraction: number
}

/**
 * Single-point trend span (CONTEXT.md 趋势: a lone reading in a window draws
 * a flat line from its test time to the current moment): the domain runs
 * reading → now. A future-dated reading (clock skew) clamps to the right
 * edge instead of inverting the domain; equal stamps degenerate to a
 * zero-width domain that still places the point without dividing by zero.
 */
export function singlePointSpan(testTs: number, nowTs: number): SinglePointSpan {
  const lo = Math.min(testTs, nowTs)
  const hi = Math.max(testTs, nowTs)
  const width = hi - lo
  return { lo, hi, pointFraction: width > 0 ? (testTs - lo) / width : 1 }
}
