/**
 * dsh-models-radar client half: mounts the「模型雷达」settings section via the
 * additive `settings.section` slot, the plugin-configuration card via
 * `settings.plugin.item`, and registers its locale dictionaries.
 * All codexradar access happens in the host half over the package's
 * same-origin route; this half only renders.
 */
// Type-only: brings ctx.slots / ctx.locale Context merges into scope.
import type {} from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type {
  CommunityRatingsPayload,
  CommunityRatingsResponse,
  RadarPayload,
  RadarResponse,
  RatingsWindow,
} from '../contract.ts'
import { NS, en, zh } from './locales.ts'
import { adoptStyles } from './styles.ts'
import { LiveCapability, type LiveCapabilityInjected } from './LiveCapability.tsx'
import { RadarSection, type RadarInjected } from './RadarSection.tsx'
import { PrefCard } from './PrefCard.tsx'
import { initLiveVisible } from './liveVisible.ts'

/** Required services: slot registry, locale registry, and the official per-session model directory. */
export const inject = ['slots', 'locale', 'modelDirectories']

/** Same-origin GET against the host half's proxy route. `bypass` skips the host's refresh window (manual refresh). */
async function loadData(benchmark: string, signal?: AbortSignal, bypass = false): Promise<RadarPayload> {
  const url =
    `/model-radar/api/data?benchmark=${encodeURIComponent(benchmark)}` + (bypass ? '&bypass=1' : '')
  const response = await fetch(url, { signal })
  const body = (await response.json()) as RadarResponse
  if (!response.ok || body.ok !== true) {
    throw new Error(body.ok === false ? body.error : `HTTP ${response.status}`)
  }
  return body
}

/** Same-origin ratings loader: one response per rolling window (CONTEXT.md 社区体感分). */
async function loadRatings(
  window: RatingsWindow,
  signal?: AbortSignal,
  bypass = false,
): Promise<CommunityRatingsPayload> {
  const url =
    `/model-radar/api/ratings?window=${encodeURIComponent(window)}` + (bypass ? '&bypass=1' : '')
  const response = await fetch(url, { signal })
  const body = (await response.json()) as CommunityRatingsResponse
  if (!response.ok || body.ok !== true) {
    throw new Error(body.ok === false ? body.error : `HTTP ${response.status}`)
  }
  return body
}

/**
 * Compose the settings-tab surface.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => adoptStyles(), 'dsh-models-radar: styles')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-models-radar: dictionaries')
  // Converge the display preference on the Host namespace (and migrate the
  // legacy localStorage choice once). Never rejects; first paint already has
  // the lazy localStorage seed.
  void initLiveVisible()
  const t = ctx.locale.bind(NS)
  const modelDirectories = ctx.get('modelDirectories') as ModelDirectoryResolver

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'model-radar',
    order: 25,
    label: () => t('nav'),
    // The shell matches this against a hardcoded whitelist — shipped shells
    // only special-case "data" / "agent-preset" / "personalization" and fall
    // back to a generic gear for anything else (a "radar" branch exists only
    // in unreleased dev shells). "data" is the closest attributed glyph.
    icon: 'data',
    locale: NS,
    inject: (): RadarInjected => ({ loadData, loadRatings }),
  }, RadarSection))

  // The plugin-configuration card (设置 → 插件 → 可配置插件). The tab
  // dispatches cards keyed by settings namespaces the Host serves, so this
  // key must equal the Host half's registered namespace.
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    key: 'dsh-models-radar',
    id: 'model-radar-pref',
    order: 130,
    locale: NS,
    inject: () => ({}),
  }, PrefCard))

  // The live SWE IQ readout sits in the composer tool row immediately left of
  // the model selector (conversation.input.right renders before the model
  // seat): the score is the selected model's property, so it belongs beside
  // it. Clicking still opens the capability popover; the liveVisible
  // preference governs visibility and polling exactly as before.
  ctx.slots.inject('conversation.input.right', () => ctx.slots.register({
    name: 'conversation.input.right',
    id: 'model-radar-live',
    order: 10,
    locale: NS,
    inject: (): LiveCapabilityInjected => ({ modelDirectories, loadData }),
  }, LiveCapability))
}
