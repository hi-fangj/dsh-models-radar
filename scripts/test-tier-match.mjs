/**
 * TierMatch interface tests (scripts/test-tier-match.mjs).
 *
 * The three-step rule of CONTEXT.md「档位匹配」: exact model@effort, strongest
 * tier of the same base (IQ-descending first hit), two-way substring fallback;
 * plus normalization (provider prefix, case-fold, empty effort), the
 * own-harness preference each step applies before the bare id, and the null
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

// Own-harness preference. The radar files a DSH session's results under a
// `dsh-` prefixed id while the session reports the bare model id, so a bare id
// is homonymous with whichever OTHER harness ran that model: the radar's
// `deepseek-v4.1-flash` is Codex's row while DSH's own is
// `dsh-deepseek-v4.1-flash`. Every step takes this session's own tier first.
const namesakes = [tier('deepseek-v4.1-flash', 'high', 86), tier('dsh-deepseek-v4.1-flash', 'high', 111)]
assert.deepEqual(matchTier(view(namesakes), { model: 'deepseek-v4.1-flash', reasoningEffort: 'high' }), {
  tier: namesakes[1],
  approximate: false,
})

// ② prefers the own-harness base too, keeping its IQ-descending first hit.
const namesakeBases = [
  tier('deepseek-v4-flash', 'max', 88),
  tier('dsh-deepseek-v4-flash', 'max', 70),
  tier('dsh-deepseek-v4-flash', 'high', 64),
]
assert.deepEqual(matchTier(view(namesakeBases), { model: 'deepseek-v4-flash' }), {
  tier: namesakeBases[1],
  approximate: true,
})

// ③ prefers an own-harness substring hit as well.
const namesakeFragments = [
  tier('deepseek-v4.1-flash-preview', 'high', 90),
  tier('dsh-deepseek-v4.1-flash-preview', 'high', 50),
]
assert.deepEqual(matchTier(view(namesakeFragments), { model: 'deepseek-v4.1-flash' }), {
  tier: namesakeFragments[1],
  approximate: true,
})

// The preference reorders candidates within a step — it never excludes. With no
// own-harness tier at the requested effort, ① still takes the bare id.
const ownHarnessLacksEffort = [
  tier('deepseek-v4.1-flash', 'high', 86),
  tier('dsh-deepseek-v4.1-flash', 'max', 90),
]
assert.deepEqual(matchTier(view(ownHarnessLacksEffort), { model: 'deepseek-v4.1-flash', reasoningEffort: 'high' }), {
  tier: ownHarnessLacksEffort[0],
  approximate: false,
})

// A model this session's harness never ran is untouched: the bare id wins,
// exactly as it did before the preference existed.
const foreignModelOnly = [tier('gpt-5.6-sol', 'high', 96)]
assert.deepEqual(matchTier(view(foreignModelOnly), { model: 'gpt-5.6-sol', reasoningEffort: 'high' }), {
  tier: foreignModelOnly[0],
  approximate: false,
})

// Alias fallback. A provider id the radar's catalog spells differently still
// resolves through the caller-supplied alias — the real case being DSH's own
// `deepseek-flash` against the site's `deepseek-v4.1-flash`.
const aliasTiers = [tier('deepseek-v4.1-flash', 'high', 86), tier('dsh-deepseek-v4.1-flash', 'high', 111)]
assert.deepEqual(
  matchTier(view(aliasTiers), { model: 'deepseek-flash', reasoningEffort: 'high', aliases: ['DeepSeek-V4.1-Flash'] }),
  { tier: aliasTiers[1], approximate: false },
)

// The id always wins: an alias never overrides a direct id hit, even when the
// alias spelling would have resolved to a different tier.
const bothSpellings = [tier('deepseek-flash', 'high', 50), tier('dsh-deepseek-v4.1-flash', 'high', 111)]
assert.deepEqual(
  matchTier(view(bothSpellings), { model: 'deepseek-flash', reasoningEffort: 'high', aliases: ['deepseek-v4.1-flash'] }),
  { tier: bothSpellings[0], approximate: false },
)

// No usable alias (absent, empty, or identical to the id) changes nothing.
assert.equal(matchTier(view(aliasTiers), { model: 'deepseek-flash' }), null)
assert.equal(matchTier(view(aliasTiers), { model: 'deepseek-flash', aliases: [] }), null)
assert.equal(matchTier(view(aliasTiers), { model: 'deepseek-flash', aliases: [''] }), null)
assert.equal(matchTier(view(aliasTiers), { model: 'deepseek-flash', aliases: ['deepseek-flash'] }), null)

console.log('test-tier-match: all assertions passed')
