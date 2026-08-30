/**
 * Community-ratings display logic tests (scripts/test-ratings-metrics.mjs):
 * the tier-id parsing in the store and the slot/match helpers the ratings
 * card renders from. All pure data — no React, no DOM.
 */
import assert from 'node:assert/strict'
import { parseRatingTierId } from '../src/store.ts'
import { matchRatingsTier, ratingsGroups, ratingsSlots } from '../src/client/ratingsMetrics.ts'

const tier = (key, average, count = 3) => {
  const at = key.indexOf('@')
  return { key, model: key.slice(0, at), effort: key.slice(at + 1), average, count }
}

// --- parseRatingTierId ------------------------------------------------------

assert.deepEqual(parseRatingTierId('gpt-5.6-sol-ultra'), { model: 'gpt-5.6-sol', effort: 'ultra' })
assert.deepEqual(parseRatingTierId('gpt-5.5-xhigh'), { model: 'gpt-5.5', effort: 'xhigh' })
assert.deepEqual(parseRatingTierId('deepseek-v4-flash-off'), { model: 'deepseek-v4-flash', effort: 'off' })
// A trailing token that is not an effort fails tolerance (caller skips it).
assert.equal(parseRatingTierId('junk-entry'), null)
assert.equal(parseRatingTierId('weird-model-super'), null)
assert.equal(parseRatingTierId('ultra'), null) // no separator → no split

// --- ratingsSlots -----------------------------------------------------------

// Primary (7d) seeds group order and effort display order (ultra→off).
const win7d = [
  tier('gpt-5.6-sol@ultra', 6.8),
  tier('gpt-5.6-sol@max', 7.3),
  tier('gpt-5.6-sol@high', 6.4),
  tier('gpt-5.6-luna@max', 8.4),
]
const win24h = [
  tier('gpt-5.6-sol@ultra', 6.2), // duplicate key: deduped
  tier('gpt-5.6-sol@off', 5.0), // 24h-only tier joins its group
  tier('gpt-5.6-terra@max', 8.0), // new group appended after
]
assert.deepEqual(
  ratingsSlots(win7d, win24h).map((slot) => slot.key),
  [
    'gpt-5.6-sol@ultra',
    'gpt-5.6-sol@max',
    'gpt-5.6-sol@high',
    'gpt-5.6-sol@off', // effort display order puts off last
    'gpt-5.6-luna@max',
    'gpt-5.6-terra@max',
  ],
)
// Slots work from either window alone (24h opened before 7d ever loaded).
assert.deepEqual(
  ratingsSlots(undefined, win24h).map((slot) => slot.key),
  ['gpt-5.6-sol@ultra', 'gpt-5.6-sol@off', 'gpt-5.6-terra@max'],
)
// Both windows absent → no slots, no crash.
assert.deepEqual(ratingsSlots(undefined, undefined), [])

// --- ratingsGroups ----------------------------------------------------------

const slots = ratingsSlots(win7d, win24h)
const groups = ratingsGroups(slots)
assert.deepEqual(
  groups.map((group) => [group.model, group.slots.length]),
  [
    ['gpt-5.6-sol', 4],
    ['gpt-5.6-luna', 1],
    ['gpt-5.6-terra', 1],
  ],
)

// --- matchRatingsTier -------------------------------------------------------

const ratings = [
  tier('gpt-5.6-sol@ultra', 6.8, 126),
  tier('gpt-5.6-sol@max', 7.3, 123),
  tier('gpt-5.6-sol@low', null, 0),
  tier('gpt-5.6-terra@max', 8.0, 6),
]
// Exact hit: not approximate.
assert.deepEqual(matchRatingsTier(ratings, 'gpt-5.6-sol@ultra'), { tier: ratings[0], approx: false })
// Missing effort, same base present → best-rated stand-in with ≈.
assert.deepEqual(matchRatingsTier(ratings, 'gpt-5.6-sol@medium'), { tier: ratings[1], approx: true })
// Unrated-only base would fall back to effort order; here low is unrated and
// the best rated wins regardless of position.
assert.deepEqual(matchRatingsTier(ratings, 'gpt-5.6-sol@off'), { tier: ratings[1], approx: true })
// A base absent from the ratings list → no highlight at all.
assert.equal(matchRatingsTier(ratings, 'glm-5.3@high'), null)
// Null selection → no highlight.
assert.equal(matchRatingsTier(ratings, null), null)

console.log('ratingsMetrics tests passed')
