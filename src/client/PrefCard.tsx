/**
 * The plugin's card in 设置 → 插件 → 可配置插件 (the `settings.plugin.item`
 * slot, keyed by the Host-side `dsh-models-radar` settings namespace). A
 * collapsible disclosure like the ecosystem plugin cards: a full-width
 * header button (name + description + chevron) over a conditionally rendered
 * body holding the display-preference switch and its explanation lines.
 * Writes go through the same liveVisible store the dock capsule reads, so a
 * toggle here hides the capsule instantly. Disclosure state stays local —
 * the plugins tab keeps visited tabs mounted, so it survives tab switches.
 */
import { useState, useSyncExternalStore } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import { liveVisibleStore, setLiveVisible } from './liveVisible.ts'

/** Card props: the locale seat (the store is module-level, no inject face). */
export type PrefCardProps = PropsLocale<'model-radar'>

/**
 * Render the collapsible plugin-configuration card.
 * @param props - the locale binder `t`.
 * @returns the card element tree.
 */
export function PrefCard({ t }: PrefCardProps) {
  const visible = useSyncExternalStore(liveVisibleStore.subscribe, liveVisibleStore.get)
  const [open, setOpen] = useState(false)
  return (
    <li className="dsh_mr_prefCard" data-open={open}>
      <button
        type="button"
        className="dsh_mr_prefHeader"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="dsh_mr_prefHeadText">
          <span className="dsh_mr_prefName">{t('pref.card.title')}</span>
          <span className="dsh_mr_prefDescription">{t('pref.card.description')}</span>
        </span>
        <span className="dsh_mr_prefChevron" data-open={open} aria-hidden="true">▾</span>
      </button>
      {open && (
        <div className="dsh_mr_prefBody">
          <div className="dsh_mr_livePref">
            <span>{t('live.pref.label')}</span>
            <button
              type="button"
              role="switch"
              aria-checked={visible}
              aria-label={t('live.pref.label')}
              className="dsh_mr_switch"
              data-on={visible}
              onClick={() => setLiveVisible(!visible)}
            >
              <span className="dsh_mr_switchKnob" />
            </button>
          </div>
          <p className="dsh_mr_prefText">{t('live.pref.hint')}</p>
          <p className="dsh_mr_prefText">{t('pref.card.pointer')}</p>
        </div>
      )}
    </li>
  )
}
