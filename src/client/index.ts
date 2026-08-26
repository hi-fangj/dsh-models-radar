/**
 * dsh-models-radar client half: mounts the「模型能力」settings section via the
 * additive `settings.section` slot and registers its locale dictionaries.
 * All codexradar access happens in the host half over the package's
 * same-origin route; this half only renders.
 */
// Type-only: brings ctx.slots / ctx.locale Context merges into scope.
import type {} from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type { ModelDirectoryResolver } from '@deepseek-ai/dsh-client-ui-model-selection/client'
import type { RadarPayload, RadarResponse } from '../contract.ts'
import { NS, en, zh } from './locales.ts'
import { adoptStyles } from './styles.ts'
import { LiveCapability, type LiveCapabilityInjected } from './LiveCapability.tsx'
import { RadarSection, type RadarInjected } from './RadarSection.tsx'

/** Required services: slot registry, locale registry, and the official per-session model directory. */
export const inject = ['slots', 'locale', 'modelDirectories']

/** Same-origin GET against the host half's proxy route. */
async function loadData(benchmark: string, signal?: AbortSignal): Promise<RadarPayload> {
  const url = `/model-radar/api/data?benchmark=${encodeURIComponent(benchmark)}`
  const response = await fetch(url, { signal })
  const body = (await response.json()) as RadarResponse
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
  const t = ctx.locale.bind(NS)
  const modelDirectories = ctx.get('modelDirectories') as ModelDirectoryResolver

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'model-radar',
    order: 25,
    label: () => t('nav'),
    locale: NS,
    inject: (): RadarInjected => ({ loadData }),
  }, RadarSection))

  ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'model-radar-live',
    order: 10,
    locale: NS,
    inject: (): LiveCapabilityInjected => ({ modelDirectories, loadData }),
  }, LiveCapability))
}
