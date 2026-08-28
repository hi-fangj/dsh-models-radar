import assert from 'node:assert/strict'
import {
  buildCostDataset,
  combinedCostIndex,
  DEFAULT_HIDDEN_BASES,
  listBases,
} from '../src/client/costMetrics.ts'

const tier = (model, effort, iq, avgPrice, avgMinutes, keySuffix = '') => ({
  key: `${model}@${effort}${keySuffix}`,
  model,
  effort,
  iq,
  avgPrice,
  avgMinutes,
  cacheHit: null,
  passed: 0,
  total: 0,
  passRate: null,
  runs24h: 0,
})

assert.equal(combinedCostIndex(null, 1), null)
assert.equal(combinedCostIndex(1, 0), null)
assert.equal(combinedCostIndex(-1, 5), null)
assert.equal(combinedCostIndex(2, 10), 200)

assert.deepEqual(DEFAULT_HIDDEN_BASES, ['deepseek-v4-flash', 'deepseek-v4-pro'])

// Chip row must list every base — hidden ones included — in first-seen order.
assert.deepEqual(
  listBases([tier('alpha', 'high', 90, 2, 10), tier('beta', 'low', 70, 1, 5), tier('deepseek-v4-flash', 'high', 88, 1, 8)]),
  ['alpha', 'beta', 'deepseek-v4-flash'],
)

const alphaHigh = tier('alpha', 'high', 90, 2, 10)
const alphaOff = tier('alpha', 'off', 80, 4, 20)
const betaMissing = tier('beta', 'medium', 70, null, 12)
const gammaZeroPrice = tier('gamma', 'low', 60, 0, 5)
const deltaWeird = tier('delta', 'weird', 75, 1, 10)
const deltaHigh = tier('delta', 'high', 85, 1.5, 12)
const epsLowExpensive = tier('eps', 'low', 50, 3, 15, '-a')
const epsLowCheap = tier('eps', 'low', 55, 1, 15, '-b')
const visible = [alphaHigh, alphaOff, betaMissing, gammaZeroPrice, deltaWeird, deltaHigh, epsLowExpensive, epsLowCheap]

// Structural probe: the module must iterate the tier list exactly once —
// integer index reads above one pass would mean a per-metric rescan.
let indexGets = 0
const proxied = new Proxy(visible, {
  get(target, prop, receiver) {
    if (typeof prop === 'string' && /^\d+$/.test(prop)) indexGets++
    return Reflect.get(target, prop, receiver)
  },
})
const dataset = buildCostDataset(proxied)

assert.ok(indexGets <= visible.length + 2, `expected one pass over tiers, saw ${indexGets} index reads`)

const modelsOf = (points) => points.map(({ tier: item }) => item.model)
const ladderFor = (ladders, model) => ladders.find((ladder) => ladder[0].tier.model === model)

// Missing (null) and non-positive values stay off combined/price but keep minutes.
assert.equal(dataset.points.combined.length, 6)
assert.equal(dataset.points.minutes.length, 8)
assert.equal(dataset.points.price.length, 6)
assert.ok(!modelsOf(dataset.points.combined).includes('beta'))
assert.ok(!modelsOf(dataset.points.price).includes('beta'))
assert.ok(!modelsOf(dataset.points.price).includes('gamma'))
assert.ok(modelsOf(dataset.points.minutes).includes('beta'))
assert.ok(modelsOf(dataset.points.minutes).includes('gamma'))

// Composite normalization: the largest visible raw index maps to exactly 100 (alpha/off).
assert.equal(Math.max(...dataset.points.combined.map(({ x }) => x)), 100)
assert.equal(dataset.points.combined.find(({ tier: item }) => item.model === 'alpha' && item.effort === 'off').x, 100)

// Ladder ordering: effort rank (unknown effort first, matching indexOf semantics),
// then x ascending within the same effort; single-point ladders are kept for the panel to skip.
assert.equal(dataset.ladders.minutes.length, 5)
assert.deepEqual(ladderFor(dataset.ladders.minutes, 'alpha').map(({ tier: item }) => item.effort), ['off', 'high'])
assert.deepEqual(ladderFor(dataset.ladders.minutes, 'delta').map(({ tier: item }) => item.effort), ['weird', 'high'])
assert.deepEqual(ladderFor(dataset.ladders.minutes, 'eps').map(({ x }) => x), [15, 15])
assert.equal(ladderFor(dataset.ladders.minutes, 'gamma').length, 1)
assert.equal(dataset.ladders.price.length, 3)
assert.deepEqual(ladderFor(dataset.ladders.price, 'alpha').map(({ tier: item }) => item.effort), ['off', 'high'])
assert.deepEqual(ladderFor(dataset.ladders.price, 'eps').map(({ x }) => x), [1, 3])
assert.deepEqual(ladderFor(dataset.ladders.combined, 'alpha').map(({ tier: item }) => item.effort), ['off', 'high'])
const epsCombinedXs = ladderFor(dataset.ladders.combined, 'eps').map(({ x }) => x)
assert.ok(epsCombinedXs[0] < epsCombinedXs[1], 'combined ladder keeps x ascending after normalization')

// Hidden-base filtering is the caller's job: the module itself sees only what it is given.
const filtered = buildCostDataset(visible.filter((item) => !DEFAULT_HIDDEN_BASES.includes(item.model)))
assert.ok(!modelsOf(filtered.points.minutes).includes('deepseek-v4-flash'))

console.log('costMetrics tests passed')
