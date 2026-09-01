/**
 * PlotGeometry interface tests (scripts/test-plot-geometry.mjs).
 *
 * The pure math behind the two SVG plots: capability-band segmentation
 * (buildSegments — merge, boundary interpolation, upper-band ownership,
 * descending crossings, multi-boundary spans), linear range fitting
 * (fitRange — slack + flat guard), the log domain (logDomain —
 * degenerate ×3 guard), and the single-point trend span (singlePointSpan —
 * clock-skew clamp). Plain asserts — no React, no DOM.
 */
import assert from 'node:assert/strict'
import { BAND_BOUNDARIES, buildSegments, fitRange, logDomain, singlePointSpan } from '../src/client/plotGeometry.ts'
import { bandColor } from '../src/client/scoreMetrics.ts'

// Uniform mappings keep the expected paths easy to reason about: x(i)=10i, y(v)=100−v.
const x = (i) => i * 10
const y = (v) => 100 - v

// Band boundaries are the CONTEXT.md 能力等级 cut points.
assert.deepEqual(BAND_BOUNDARIES, [70, 85, 95, 100])

// Same-band adjacent points merge into one piece. (The per-segment `from`
// re-add paints one duplicate L at each joint — same point, no visual
// effect; locked here as documented behavior.)
const merged = buildSegments([80, 82, 84], x, y)
assert.equal(merged.length, 1)
assert.equal(merged[0].color, bandColor('general'))
assert.equal(merged[0].path, 'M 0.0 20.0 L 10.0 18.0 L 10.0 18.0 L 20.0 16.0')
assert.equal(merged[0].x0, 0)
assert.equal(merged[0].x1, 20)

// Ascending crossing of 85: split exactly at the interpolated boundary point;
// the boundary point belongs to the upper (steady) piece.
const up = buildSegments([84, 86], x, y)
assert.deepEqual(
  up.map(({ color, path, x0, x1 }) => ({ color, path, x0, x1 })),
  [
    { color: bandColor('general'), path: 'M 0.0 16.0 L 5.0 15.0', x0: 0, x1: 5 },
    { color: bandColor('steady'), path: 'M 5.0 15.0 L 10.0 14.0', x0: 5, x1: 10 },
  ],
)

// Descending crossing splits the same way, bands in reverse order.
const down = buildSegments([86, 84], x, y)
assert.deepEqual(
  down.map(({ color, path }) => ({ color, path })),
  [
    { color: bandColor('steady'), path: 'M 0.0 14.0 L 5.0 15.0' },
    { color: bandColor('general'), path: 'M 5.0 15.0 L 10.0 16.0' },
  ],
)

// One segment crossing two boundaries ascending: 84 → 96 crosses 85 then 95.
const twoUp = buildSegments([84, 96], x, y)
assert.deepEqual(
  twoUp.map(({ color, path }) => ({ color, path })),
  [
    { color: bandColor('general'), path: 'M 0.0 16.0 L 0.8 15.0' },
    { color: bandColor('steady'), path: 'M 0.8 15.0 L 9.2 5.0' },
    { color: bandColor('excellent'), path: 'M 9.2 5.0 L 10.0 4.0' },
  ],
)

// Descending crossings are walked in reverse so pieces stay ordered along the
// path; each span takes the band of its own interior — the color switches on
// the way down too. (The pre-test-line implementation colored descents with
// the upper band's color throughout; these assertions caught and fixed that.)
const twoDown = buildSegments([96, 84], x, y)
assert.deepEqual(
  twoDown.map(({ color, path }) => ({ color, path })),
  [
    { color: bandColor('excellent'), path: 'M 0.0 4.0 L 0.8 5.0' },
    { color: bandColor('steady'), path: 'M 0.8 5.0 L 9.2 15.0' },
    { color: bandColor('general'), path: 'M 9.2 15.0 L 10.0 16.0' },
  ],
)

// An entirely flat series is one piece.
const flat = buildSegments([80, 80, 80], x, y)
assert.equal(flat.length, 1)
assert.equal(flat[0].color, bandColor('general'))
assert.equal(flat[0].path, 'M 0.0 20.0 L 10.0 20.0 L 10.0 20.0 L 20.0 20.0')

// fitRange: 8% slack around the observed min/max.
let range = fitRange([80, 90])
approx(range.lo, 79.2)
approx(range.hi, 90.8)
range = fitRange([10, 50, 30])
approx(range.lo, 6.8)
approx(range.hi, 53.2)

// Flat series (and a single value) get the ±0.5 spread guard before slack.
range = fitRange([85, 85])
approx(range.lo, 84.42)
approx(range.hi, 85.58)
range = fitRange([90])
approx(range.lo, 89.42)
approx(range.hi, 90.58)

// logDomain: a real span passes through unchanged.
assert.deepEqual(logDomain([10, 1000]), { lo: 10, hi: 1000 })
assert.deepEqual(logDomain([3, 6]), { lo: 3, hi: 6 })

// Degenerate spans (all-equal, single point) widen ×3 both ways.
range = logDomain([50, 50])
approx(range.lo, 50 / 3)
approx(range.hi, 150)
range = logDomain([42])
approx(range.lo, 14)
approx(range.hi, 126)

// singlePointSpan: a lone reading's window runs test time → now, so the
// reading sits at the LEFT edge (CONTEXT.md 趋势: the flat line starts at
// the test time) — the fraction is 0 whenever the reading anchors the
// domain. Clock skew clamps to the right edge (fraction 1) instead of
// inverting the domain; equal stamps degenerate to a zero-width window
// without dividing by zero.
const HOUR = 3_600_000
assert.deepEqual(singlePointSpan(HOUR, 3 * HOUR), { lo: HOUR, hi: 3 * HOUR, pointFraction: 0 })
assert.deepEqual(singlePointSpan(3 * HOUR, HOUR), { lo: HOUR, hi: 3 * HOUR, pointFraction: 1 })
assert.deepEqual(singlePointSpan(HOUR, HOUR), { lo: HOUR, hi: HOUR, pointFraction: 1 })

function approx(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} should be ≈ ${expected}`)
}

console.log('test-plot-geometry: all assertions passed')
