/**
 * TaskMetrics interface tests (scripts/test-task-metrics.mjs).
 *
 * Maps the architecture review's verification bar for candidate 2 onto the
 * pure module — majority vote (incl. legacy two-field rows), continuous F1
 * boundaries, empty list, filtered sorting, summary params, and the
 * one-linear-scan shape — via plain asserts, no React, no DOM.
 */
import assert from 'node:assert/strict'
import { diagnoseTasks, taskLanguageBadge, taskMode, visibleOf } from '../src/client/taskMetrics.ts'

// Mode dispatch: DeepSWE or an explicit binary-majority scoring mode is
// majority vote; unknown benchmarks/modes fall to the continuous bands.
assert.equal(taskMode('deep-swe'), 'binary')
assert.equal(taskMode('deep-swe', 'continuous-macro'), 'binary')
assert.equal(taskMode('pompeii-adjacency'), 'continuous')
assert.equal(taskMode('pompeii-adjacency', 'binary-majority'), 'binary')
assert.equal(taskMode('unknown-channel'), 'continuous')
assert.equal(taskMode('unknown-channel', 'something-else'), 'continuous')

// Majority vote: the flag wins over the rate (explicit true at rate 0 passes,
// explicit false at positive rate splits); legacy two-field rows infer from 2/3.
const binary = diagnoseTasks(
  [
    ['flag-wins-at-zero', 0, true],
    ['explicit-false-positive-rate', 0.9, false],
    ['explicit-false-zero', 0, false],
    ['legacy-two-thirds-boundary', 2 / 3],
    ['legacy-just-below', 0.66],
    ['legacy-full', 1],
  ],
  'binary',
)
const categoryOf = (taskId) => binary.rows.find(({ row }) => row[0] === taskId).category
assert.equal(categoryOf('flag-wins-at-zero'), 'pass')
assert.equal(categoryOf('explicit-false-positive-rate'), 'split')
assert.equal(categoryOf('explicit-false-zero'), 'fail')
assert.equal(categoryOf('legacy-two-thirds-boundary'), 'pass')
assert.equal(categoryOf('legacy-just-below'), 'split')
assert.equal(categoryOf('legacy-full'), 'pass')

// Sorted ascending by rate, ties by taskId (bars render lowest first).
assert.deepEqual(
  binary.rows.map(({ row }) => row[0]),
  [
    'explicit-false-zero',
    'flag-wins-at-zero',
    'legacy-just-below',
    'legacy-two-thirds-boundary',
    'explicit-false-positive-rate',
    'legacy-full',
  ],
)

// Counts in aggregate-bar order — every category present, in mode order.
assert.deepEqual(binary.counts, [
  { category: 'pass', count: 3 },
  { category: 'split', count: 2 },
  { category: 'fail', count: 1 },
])
assert.deepEqual(binary.summary, { passed: 3, total: 6, rate: 50 })

// Bucket views keep the same sort as the full list.
assert.deepEqual(
  binary.byCategory.split.map(({ row }) => row[0]),
  ['legacy-just-below', 'explicit-false-positive-rate'],
)

// Filter views: O(1) bucket selection; a foreign filter (other mode's
// vocabulary) degrades to the full list until the view resets it.
assert.equal(visibleOf(binary, 'all'), binary.rows)
assert.deepEqual(
  visibleOf(binary, 'split').map(({ row }) => row[0]),
  ['legacy-just-below', 'explicit-false-positive-rate'],
)
assert.equal(visibleOf(binary, 'excellent'), binary.rows)

// Continuous F1 boundaries: exactly 0.75/0.5/0.25 belong to the upper band.
const continuous = diagnoseTasks(
  [
    ['top', 1],
    ['excellent-boundary', 0.75],
    ['just-below-excellent', 0.749],
    ['good-boundary', 0.5],
    ['just-below-good', 0.499],
    ['general-boundary', 0.25],
    ['just-below-general', 0.249],
    ['zero', 0],
  ],
  'continuous',
)
assert.deepEqual(continuous.counts, [
  { category: 'excellent', count: 2 },
  { category: 'good', count: 2 },
  { category: 'general', count: 2 },
  { category: 'low', count: 2 },
])
const mean = [1, 0.75, 0.749, 0.5, 0.499, 0.25, 0.249, 0].reduce((a, b) => a + b) / 8
assert.ok(Math.abs(continuous.average - mean) < 1e-12)
assert.deepEqual(continuous.summary, { rate: Math.round(mean * 100) })
assert.equal(visibleOf(continuous, 'pass'), continuous.rows)

// Zero-count categories still get their buckets: filtering by an empty
// category must return [] — not fall back to the full list.
const lopsided = diagnoseTasks([['only-excellent', 1]], 'continuous')
assert.deepEqual(lopsided.counts.map(({ category, count }) => `${category}:${count}`), [
  'excellent:1',
  'good:0',
  'general:0',
  'low:0',
])
assert.deepEqual(lopsided.byCategory.low, [])
assert.deepEqual(visibleOf(lopsided, 'low'), [])

// Empty list: zero counts in order, zero average, zero summary, working filters.
const empty = diagnoseTasks([], 'binary')
assert.equal(empty.rows.length, 0)
assert.deepEqual(empty.counts, [
  { category: 'pass', count: 0 },
  { category: 'split', count: 0 },
  { category: 'fail', count: 0 },
])
assert.deepEqual(empty.byCategory, { pass: [], split: [], fail: [] })
assert.equal(empty.average, 0)
assert.deepEqual(empty.summary, { passed: 0, total: 0, rate: 0 })
assert.deepEqual(visibleOf(empty, 'pass'), [])

// The input is never mutated (sorting happens on owned copies).
const input = [
  ['b', 0],
  ['a', 1],
]
const snapshot = JSON.parse(JSON.stringify(input))
diagnoseTasks(input, 'binary')
assert.deepEqual(input, snapshot)

// Structural probe: classification must be one pass over the rows — more
// index reads than that would mean a per-category rescan like the old view.
let indexGets = 0
const rowsForProbe = [
  ['t1', 0.1],
  ['t2', 0.2],
  ['t3', 0.3],
  ['t4', 0.4],
  ['t5', 0.5],
]
const proxied = new Proxy(rowsForProbe, {
  get(target, prop, receiver) {
    if (typeof prop === 'string' && /^\d+$/.test(prop)) indexGets++
    return Reflect.get(target, prop, receiver)
  },
})
diagnoseTasks(proxied, 'continuous')
assert.ok(indexGets <= rowsForProbe.length + 2, `expected one pass over rows, saw ${indexGets} index reads`)

// Language badge (site TASK_LANGUAGE_BADGES vocabulary): short label per known
// language, the raw string for anything else, no badge without a language.
assert.deepEqual(taskLanguageBadge('typescript'), { id: 'typescript', label: 'TS', full: 'TypeScript' })
assert.deepEqual(taskLanguageBadge('python'), { id: 'python', label: 'Py', full: 'Python' })
assert.deepEqual(taskLanguageBadge('javascript'), { id: 'javascript', label: 'JS', full: 'JavaScript' })
assert.deepEqual(taskLanguageBadge('go'), { id: 'go', label: 'Go', full: 'Go' })
assert.deepEqual(taskLanguageBadge('rust'), { id: 'rust', label: 'Rust', full: 'Rust' })
// Case-insensitive match on the known vocabulary.
assert.deepEqual(taskLanguageBadge('Python'), { id: 'python', label: 'Py', full: 'Python' })
// Unknown language keeps its raw string (e.g. pompeii's vision tasks) under 'other'.
assert.deepEqual(taskLanguageBadge('vision'), { id: 'other', label: 'vision', full: 'vision' })
// Absent / blank → no badge at all.
assert.equal(taskLanguageBadge(undefined), null)
assert.equal(taskLanguageBadge(''), null)
assert.equal(taskLanguageBadge('  '), null)

console.log('taskMetrics tests passed')
