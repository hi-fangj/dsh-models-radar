/**
 * TierMatch interface tests (scripts/test-tier-match.mjs).
 *
 * The three-step rule of CONTEXT.md「档位匹配」: exact model@effort, strongest
 * tier of the same base (IQ-descending first hit), two-way substring fallback;
 * plus normalization (provider prefix, case-fold, empty effort) and the null
 * outcomes. Plain asserts — no React, no DOM.
 */
import assert from 'node:assert/strict'
import { matchTier } from '../src/client/tierMatch.ts'

const tier = (model, effort, iq) => ({
  key: `${model}@${effort}`,
  model,
  effort,
  iq,
  avgPrice: null,
  avgMinutes: null,
  cacheHit: null,
  passed: 0,
  total: 0,
  passRate: null,
  runs24h: 0,
})

const view = (tiers) => ({
  benchmark: 'deep-swe',
  scoreLabel: 'Pass rate',
  fetchedAt: '2026-08-28T00:00:00Z',
  channels: [],
  tiers,
  taskRates: {},
  series: {},
})

const tiers = [
  tier('gpt-5.6-sol', 'high', 96),
  tier('glm-5.3', 'high', 90),
  tier('glm-5.3', 'low', 70),
  tier('deepseek-v4-pro', 'medium', 60),
]

// ① Exact model@effort hits are not approximate.
assert.deepEqual(matchTier(view(tiers), { model: 'gpt-5.6-sol', reasoningEffort: 'high' }), {
  tier: tiers[0],
  approximate: false,
})

// Normalization works on both sides: case-folding, provider prefixes on the
// selection, and — the drift the unified rule locks in — provider prefixes on
// the tier side too.
assert.deepEqual(matchTier(view(tiers), { model: 'GPT-5.6-Sol', reasoningEffort: 'High' }), {
  tier: tiers[0],
  approximate: false,
})
assert.deepEqual(matchTier(view(tiers), { model: 'openai/gpt-5.6-sol', reasoningEffort: 'high' }), {
  tier: tiers[0],
  approximate: false,
})
const prefixedTiers = [tier('openai/m1', 'high', 90)]
assert.deepEqual(matchTier(view(prefixedTiers), { model: 'm1', reasoningEffort: 'high' }), {
  tier: prefixedTiers[0],
  approximate: false,
})

// ② No effort (or an empty effort string — it counts as no effort) resolves to
// the strongest tier of the same base: tiers arrive IQ-descending, so the
// first hit is the base's best.
assert.deepEqual(matchTier(view(tiers), { model: 'glm-5.3' }), { tier: tiers[1], approximate: true })
assert.deepEqual(matchTier(view(tiers), { model: 'glm-5.3', reasoningEffort: '' }), { tier: tiers[1], approximate: true })
assert.deepEqual(matchTier(view(tiers), { model: 'glm-5.3', reasoningEffort: 'xhigh' }), { tier: tiers[1], approximate: true })

// ③ Two-way substring fallback, same normalization on both sides.
assert.deepEqual(matchTier(view(tiers), { model: 'glm' }), { tier: tiers[1], approximate: true })
assert.deepEqual(matchTier(view(tiers), { model: 'v4' }), { tier: tiers[3], approximate: true })

// Fuzzy hits take the first tier in IQ order — no "best substring" guessing.
const tight = view([tier('m1', 'high', 90), tier('m2', 'high', 70)])
assert.deepEqual(matchTier(tight, { model: 'm' }), { tier: tight.tiers[0], approximate: true })

// Null outcomes: absent selection, empty model token, no step matches.
assert.equal(matchTier(view(tiers)), null)
assert.equal(matchTier(view(tiers), { model: '' }), null)
assert.equal(matchTier(view(tiers), { model: 'kimi-k3' }), null)

// The approximate flag appears only for steps ② and ③.
const onlyFuzzy = view([tier('glm-5.3-flash', 'high', 88)])
assert.equal(matchTier(onlyFuzzy, { model: 'glm' }).approximate, true)
assert.equal(matchTier(onlyFuzzy, { model: 'glm-5.3-flash', reasoningEffort: 'high' }).approximate, false)

console.log('test-tier-match: all assertions passed')
