import assert from 'node:assert/strict'
import {
  costModelLabel,
  harnessMeta,
  harnessOfModel,
  modelColor,
  prettyModelName,
  tierOptionLabel,
} from '../src/client/harness.ts'

// Harness derivation: positive rules over the site's advertised client
// configs only — anything unlisted stays unbadged, never guessed.
assert.equal(harnessOfModel('dsh-deepseek-v4-pro'), 'dsh')
assert.equal(harnessOfModel('k3'), 'kimi-code')
assert.equal(harnessOfModel('GLM-5.3-Flash'), 'zcode') // case-normalized
assert.equal(harnessOfModel('grok-4.6'), 'grok')
assert.equal(harnessOfModel('gemini-3.7-flash'), 'antigravity')
assert.equal(harnessOfModel('hy4-preview'), 'codebuddy')
assert.equal(harnessOfModel('HY4-Preview'), 'codebuddy') // case-normalized
assert.equal(harnessOfModel('gpt-5.6-sol'), 'codex')
assert.equal(harnessOfModel('deepseek-v4-pro'), 'codex')
assert.equal(harnessOfModel('mystery-model'), null)

// Badge metadata: every id carries the site-canonical label, colors stay
// distinct so the overview dots never collide.
const ids = ['codex', 'dsh', 'zcode', 'grok', 'kimi-code', 'antigravity', 'codebuddy']
const colors = new Set(ids.map((id) => harnessMeta(id).color))
assert.equal(colors.size, ids.length)
assert.equal(harnessMeta('antigravity').label, 'Antigravity')
assert.equal(harnessMeta('codebuddy').label, 'CodeBuddy')

// Selector options append the harness segment only when one matched.
assert.equal(tierOptionLabel({ model: 'gemini-3.7-flash', effort: 'low' }), 'gemini-3.7-flash · low · Antigravity')
assert.equal(tierOptionLabel({ model: 'hy4-preview', effort: 'max' }), 'hy4-preview · max · CodeBuddy')
assert.equal(tierOptionLabel({ model: 'mystery', effort: 'high' }), 'mystery · high')

// Pretty names: site table first, then GPT codename capitalization, then the
// stripped passthrough.
assert.equal(prettyModelName('dsh-deepseek-v4-flash-vision-exp'), 'DeepSeek V4 Flash Vision Exp')
assert.equal(prettyModelName('gpt-5.6-sol'), 'GPT-5.6 Sol')
assert.equal(prettyModelName('gpt-5.5'), 'GPT-5.5')
assert.equal(prettyModelName('hy4-preview'), 'HY4 Preview')
assert.equal(prettyModelName('mystery-model'), 'mystery-model')

// Cost attribution labels mirror the site's efficiencyModelLabel: the
// API-metered DeepSeek V4 family shortens to DSV4 and carries its harness;
// subscription bases render the bare pretty name with no harness segment.
assert.deepEqual(costModelLabel('dsh-deepseek-v4-pro'), { name: 'DSV4 Pro', billing: 'api', harness: 'dsh' })
assert.deepEqual(costModelLabel('deepseek-v4-flash'), { name: 'DSV4 Flash', billing: 'api', harness: 'codex' })
assert.deepEqual(costModelLabel('dsh-deepseek-v4-flash-vision-exp'), {
  name: 'DSV4 Flash Vision Exp',
  billing: 'api',
  harness: 'dsh',
})
assert.deepEqual(costModelLabel('gemini-3.7-flash'), { name: 'Gemini 3.7 Flash', billing: 'subscription', harness: null })
assert.deepEqual(costModelLabel('k3'), { name: 'K3', billing: 'subscription', harness: null })
assert.deepEqual(costModelLabel('gpt-5.6-sol'), { name: 'Sol', billing: 'subscription', harness: null })
assert.deepEqual(costModelLabel('gpt-5.5'), { name: 'GPT-5.5', billing: 'subscription', harness: null })
assert.deepEqual(costModelLabel('hy4-preview'), { name: 'HY4 Preview', billing: 'subscription', harness: null })

// Per-base display colors follow the site's tables; hy4-preview wears its
// signature pink in both the general and efficiency palettes.
assert.equal(modelColor('hy4-preview'), '#ec4899')

console.log('harness tests passed')
