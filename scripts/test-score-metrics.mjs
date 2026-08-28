/**
 * ScoreMetrics interface tests (scripts/test-score-metrics.mjs).
 *
 * Covers the shared score semantics: band boundaries and colors, the absolute
 * progress scale, the 24h-reference trend summary (incl. the ±0.25 dead zone
 * and head fallback), the window summary, time-based slicing, and the
 * deltaSignal presentation. Plain asserts — no React, no DOM.
 */
import assert from 'node:assert/strict'
import {
  STEADY_COLOR,
  bandColor,
  deltaSignal,
  iqBand,
  iqProgress,
  sliceRecentPoints,
  trendSummary,
  windowSummary,
} from '../src/client/scoreMetrics.ts'

// Band boundaries recorded in CONTEXT.md: 70 / 85 / 95 / 100.
assert.equal(iqBand(69.9), 'low')
assert.equal(iqBand(70), 'general')
assert.equal(iqBand(84.9), 'general')
assert.equal(iqBand(85), 'steady')
assert.equal(iqBand(94.9), 'steady')
assert.equal(iqBand(95), 'excellent')
assert.equal(iqBand(99.9), 'excellent')
assert.equal(iqBand(100), 'leading')
assert.equal(iqBand(110), 'leading')

// Band colors: fixed aliases, steady carries the true brand blue.
assert.equal(bandColor('low'), 'var(--dsw-alias-state-error-primary)')
assert.equal(bandColor('general'), 'var(--dsw-alias-state-warn-primary)')
assert.equal(bandColor('steady'), STEADY_COLOR)
assert.equal(bandColor('excellent'), 'var(--dsw-alias-state-success-primary)')
assert.equal(bandColor('leading'), 'var(--dsw-alias-state-success-primary)')

// Absolute 0–110 progress scale, clamped both sides.
assert.equal(iqProgress(0), 0)
assert.equal(iqProgress(55), 0.5)
assert.equal(iqProgress(110), 1)
assert.equal(iqProgress(-5), 0)
assert.equal(iqProgress(300), 1)

// trendSummary: the 24h reference walk picks the CLOSEST reading at least 24h
// older than the last point (ascending series, equality counts).
const summary = trendSummary([
  ['2026-08-26T00:00:00Z', 80],
  ['2026-08-27T00:30:00Z', 85],
  ['2026-08-28T00:30:00Z', 90],
])
assert.deepEqual(summary, { delta24h: 5, direction: 'up', min: 80, average: 85, max: 90 })

// A reading only 23.5h old does NOT qualify — the walk breaks and falls back
// to the series head.
const headFallback = trendSummary([
  ['2026-08-26T00:00:00Z', 80],
  ['2026-08-27T01:00:00Z', 85],
  ['2026-08-28T00:30:00Z', 90],
])
assert.equal(headFallback.delta24h, 10)

// A series entirely inside the window: reference is the head.
const shortSeries = trendSummary([
  ['2026-08-28T00:00:00Z', 80],
  ['2026-08-28T02:00:00Z', 82],
])
assert.equal(shortSeries.delta24h, 2)
assert.equal(shortSeries.direction, 'up')

// The ±0.25 IQ dead zone: measurement noise must not read as direction.
assert.equal(trendSummary([['2026-08-27T00:00:00Z', 90], ['2026-08-28T00:00:00Z', 90.2]]).direction, 'flat')
assert.equal(trendSummary([['2026-08-27T00:00:00Z', 90], ['2026-08-28T00:00:00Z', 90.26]]).direction, 'up')
assert.equal(trendSummary([['2026-08-27T00:00:00Z', 90], ['2026-08-28T00:00:00Z', 89.7]]).direction, 'down')

// Non-finite values are filtered out of the range stats but skipped, not
// fatal, in the reference walk.
const withNoise = trendSummary([
  ['2026-08-27T00:00:00Z', 80],
  ['not-a-ts', NaN],
  ['2026-08-28T00:00:00Z', 84],
])
assert.deepEqual(withNoise, { delta24h: 4, direction: 'up', min: 80, average: 82, max: 84 })
assert.equal(trendSummary([]), null)

// windowSummary: net change is last minus FIRST of this window — no 24h walk.
const windowed = windowSummary([
  ['2026-08-26T00:00:00Z', 90],
  ['2026-08-28T00:00:00Z', 85],
])
assert.deepEqual(windowed, { change: -5, direction: 'down', min: 85, average: 87.5, max: 90 })
assert.equal(windowSummary([['2026-08-28T00:00:00Z', 10], ['2026-08-28T01:00:00Z', 10.2]]).direction, 'flat')
assert.equal(windowSummary([]), null)

// sliceRecentPoints: time-based cutoff (not last-N), invalid stamps dropped,
// ascending order preserved.
const now = Date.now()
const pts = [
  [new Date(now - 25 * 3_600_000).toISOString(), 80],
  [new Date(now - 1 * 3_600_000).toISOString(), 82],
  ['not-a-ts', 90],
]
assert.deepEqual(sliceRecentPoints(pts, 24), [[pts[1][0], 82]])

// deltaSignal: glyph + signed text per direction; flat reads ±0.0 regardless
// of the raw delta (the dead-zone decision belongs to the summaries).
assert.deepEqual(deltaSignal({ direction: 'up', delta: 0.3 }), { glyph: '↑', text: '+0.3' })
assert.deepEqual(deltaSignal({ direction: 'down', delta: -1.26 }), { glyph: '↓', text: '-1.3' })
assert.deepEqual(deltaSignal({ direction: 'flat', delta: 5 }), { glyph: '→', text: '±0.0' })

// Integration: a summary's direction drives the signal (the adapter maps
// trendSummary's `delta24h` onto deltaSignal's `delta`).
const upSummary = trendSummary([['2026-08-27T00:00:00Z', 90], ['2026-08-28T00:00:00Z', 92]])
assert.deepEqual(
  deltaSignal({ direction: upSummary.direction, delta: upSummary.delta24h }),
  { glyph: '↑', text: '+2.0' },
)

console.log('test-score-metrics: all assertions passed')
