/**
 * Tier presentation shared by the settings section and the capability
 * popover: the badge grid, the IQ-trend card (title + tier select + trend
 * tabs/empty), and the task-composition card (title + bars/empty). Both
 * surfaces compose these; per-surface semantics stay at the call sites — the
 * settings select persists its choice, the popover select is a temporary
 * viewing.
 */
import type { RadarTier, RadarView } from '../contract.ts'
import type { ModelRadarKey } from './locales.ts'
import { fmt } from './locales.ts'
import { iqBand } from './scoreMetrics.ts'
import { moneyText, minutesText, pctText } from './format.ts'
import { TaskBars, TrendTabs } from './charts.tsx'
import { tierOptionLabel } from './harness.ts'

type Translate = (key: ModelRadarKey) => string

/** The five-badge grid (IQ / price / minutes / cache / 24h runs); a null tier renders em dashes. */
export function TierBadges({ tier, t }: { tier: RadarTier | null; t: Translate }) {
  const badges: Array<{ label: string; value: string; accent?: boolean; band?: string }> = [
    {
      label: t('badge.iq'),
      value: tier !== null ? tier.iq.toFixed(1) : '—',
      accent: true,
      band: tier !== null ? iqBand(tier.iq) : undefined,
    },
    { label: t('badge.price'), value: moneyText(tier?.avgPrice ?? null) },
    { label: t('badge.minutes'), value: minutesText(tier?.avgMinutes ?? null) },
    { label: t('badge.cache'), value: tier?.cacheHit != null ? pctText(tier.cacheHit) : '—' },
    { label: t('badge.runs'), value: tier !== null ? String(tier.runs24h) : '—' },
  ]
  return (
    <div className="dsh_mr_badges">
      {badges.map((badge) => (
        <div className="dsh_mr_badge" key={badge.label}>
          <span className="dsh_mr_badgeVal" data-accent={badge.accent === true} data-band={badge.band}>
            {badge.value}
          </span>
          <span className="dsh_mr_badgeLabel">{badge.label}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * The IQ-trend card: head with a tier select (options labeled via
 * tierOptionLabel, title/aria both `line.title`), an optional hint line, then
 * the trend tabs or the empty state. An empty `value` renders the dash
 * placeholder option — the settings page passes `tierKey ?? ''` while the
 * popover always passes a concrete tier key.
 */
export function TrendCard({
  tiers,
  value,
  onChange,
  hint,
  points,
  t,
}: {
  tiers: RadarTier[]
  value: string
  onChange: (tierKey: string) => void
  hint?: string | null
  points: Array<[string, number]>
  t: Translate
}) {
  return (
    <div className="dsh_mr_card">
      <div className="dsh_mr_cardHead">
        <span className="dsh_mr_cardTitle">{t('line.title')}</span>
        <select
          className="dsh_mr_select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={t('line.title')}
        >
          {value === '' && <option value="">—</option>}
          {tiers.map((candidate) => (
            <option key={candidate.key} value={candidate.key}>
              {tierOptionLabel(candidate)}
            </option>
          ))}
        </select>
      </div>
      {hint !== undefined && hint !== null && <div className="dsh_mr_hint">{hint}</div>}
      {points.length >= 1 ? (
        <TrendTabs points={points} t={t} />
      ) : (
        <div className="dsh_mr_empty">{t('empty.noSeries')}</div>
      )}
    </div>
  )
}

/**
 * The task-composition card: title (scoreLabel, falling back to the shown
 * tier's pass rate when the channel publishes no label) over the per-task
 * bars or the empty state.
 */
export function TaskCard({
  view,
  tierKey,
  t,
  scroll = true,
}: {
  view: RadarView
  tierKey: string | null
  t: Translate
  /** Wrap the bar list in the persistent scroll frame; false lets the popover viewport own scrolling. */
  scroll?: boolean
}) {
  const rows = tierKey !== null ? (view.taskRates[tierKey] ?? []) : []
  const tier = tierKey !== null ? view.tiers.find((candidate) => candidate.key === tierKey) : undefined
  const label = view.scoreLabel || (tier?.passRate != null ? pctText(tier.passRate) : '')
  return (
    <div className="dsh_mr_card">
      <span className="dsh_mr_cardTitle">{fmt(t('bar.title'), { label })}</span>
      {rows.length > 0 ? (
        <TaskBars
          rows={rows}
          benchmark={view.benchmark}
          scoringMode={view.scoringMode}
          taskMeta={view.taskMeta}
          t={t}
          scroll={scroll}
          collapsible={!scroll}
        />
      ) : (
        <div className="dsh_mr_empty">{t('empty.none')}</div>
      )}
    </div>
  )
}
