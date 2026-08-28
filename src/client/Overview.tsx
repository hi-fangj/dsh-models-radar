/**
 * The「能力总览」card: one screen, every base model's currently strongest tier,
 * ranked. Each row carries an inline magnitude micro-bar behind the IQ value,
 * a 24h trend signal (↑/↓/→ with Δ), and doubles as navigation — clicking a
 * row selects that tier for every chart below. A base model collapses to its
 * best effort; the chevron expands its full effort ladder. A selection that
 * sits on a hidden child (popover follow mode, the settings dropdown) opens
 * its ladder so the gray row never hides behind a collapsed group.
 */
import { useEffect, useMemo, useState } from 'react'
import type { RadarTier, RadarView } from '../contract.ts'
import type { ModelRadarKey } from './locales.ts'
import { PersistentScrollFrame } from './ScrollFrame.tsx'
import { harnessMeta, harnessOfModel } from './harness.ts'
import { deltaSignal, iqBand, iqProgress, trendSummary } from './scoreMetrics.ts'

interface OverviewProps {
  view: RadarView
  /** Currently selected tier key (highlighted row), null when unmatched yet. */
  selectedKey: string | null
  /** The session's matched tier key, marked as the in-use model; null to hide the mark. */
  currentKey?: string | null
  onSelect: (tierKey: string) => void
  t: (key: ModelRadarKey) => string
  /** Wrap the list in the persistent scroll frame; false lets the parent viewport own scrolling. */
  scroll?: boolean
}

/** One base model's ladder plus its strongest tier (tiers arrive IQ-sorted). */
interface BaseGroup {
  base: string
  tiers: RadarTier[]
  best: RadarTier
}

function groupByBase(view: RadarView): BaseGroup[] {
  const groups = new Map<string, RadarTier[]>()
  for (const tier of view.tiers) {
    const ladder = groups.get(tier.model)
    if (ladder === undefined) groups.set(tier.model, [tier])
    else if (!ladder.some((existing) => existing.key === tier.key)) ladder.push(tier)
  }
  return [...groups.entries()].map(([base, tiers]) => ({ base, tiers, best: tiers[0] }))
}

/** Bases whose effort ladder would hide the selected row: the selection sits on a non-best child. */
function basesHidingSelection(groups: BaseGroup[], selectedKey: string | null): string[] {
  if (selectedKey === null) return []
  return groups
    .filter((group) => group.tiers.some((tier) => tier.key === selectedKey && tier.key !== group.best.key))
    .map((group) => group.base)
}

function DeltaBadge({ points }: { points: Array<[string, number]> | undefined }) {
  const summary = trendSummary(points ?? [])
  if (summary === null) return <span className="dsh_mr_ovDelta" data-dir="none">—</span>
  const delta = deltaSignal({ direction: summary.direction, delta: summary.delta24h })
  return (
    <span className="dsh_mr_ovDelta" data-dir={summary.direction} title="24h">
      {delta.glyph} {delta.text}
    </span>
  )
}

export function TierOverview({ view, selectedKey, currentKey, onSelect, t, scroll = true }: OverviewProps) {
  const groups = useMemo(() => groupByBase(view), [view])
  // Seed open with ladders that would otherwise hide the selected child row.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(basesHidingSelection(groups, selectedKey)))
  // Keep following the selection: a pick landing on a collapsed ladder's child
  // re-opens that ladder so the gray row stays visible. The chevron can still
  // collapse it afterwards — this only re-fires when the selection moves again.
  useEffect(() => {
    setExpanded((previous) => {
      let changed = false
      const next = new Set(previous)
      for (const base of basesHidingSelection(groups, selectedKey)) {
        if (!next.has(base)) {
          next.add(base)
          changed = true
        }
      }
      return changed ? next : previous
    })
  }, [groups, selectedKey])
  if (groups.length === 0) return null

  const toggle = (base: string): void => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(base)) next.delete(base)
      else next.add(base)
      return next
    })
  }

  const list = (
    <div className="dsh_mr_bars">
      {groups.map((group, index) => {
        const isOpen = expanded.has(group.base)
        const isSelected = group.best.key === selectedKey
        const hasSelectedChild =
          selectedKey !== null && group.tiers.some((tier) => tier.key === selectedKey && tier.key !== group.best.key)
        const isCurrent = currentKey !== null && currentKey !== undefined && group.tiers.some((tier) => tier.key === currentKey)
        const harness = harnessOfModel(group.base)
        const widthPct = iqProgress(group.best.iq) * 100
        const band = iqBand(group.best.iq)
        return (
          <div className="dsh_mr_ovGroup" key={group.base}>
            <div
              className="dsh_mr_ovRow"
              data-selected={isSelected}
              data-group-selected={hasSelectedChild}
              role="button"
              aria-current={isSelected ? 'true' : undefined}
              tabIndex={0}
              onClick={() => onSelect(group.best.key)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') onSelect(group.best.key)
              }}
            >
              <span className="dsh_mr_ovRank">{index + 1}</span>
              <button
                type="button"
                className="dsh_mr_ovChevron"
                aria-label={isOpen ? 'collapse' : 'expand'}
                data-open={isOpen}
                onClick={(event) => {
                  event.stopPropagation()
                  toggle(group.base)
                }}
              >
                ▸
              </button>
              {/* The truncating text lives in an inner span so the current-model
                  mark stays outside the ellipsis flow: nested inside it, a long
                  name would clip the badge into a broken empty outline. */}
              <span className="dsh_mr_ovName" title={group.base}>
                <span className="dsh_mr_ovNameText">
                  {group.base}
                  <span className="dsh_mr_ovEffort"> · {group.best.effort}</span>
                </span>
                {/* Harness badge sits outside the truncating flow (same
                    flex:none pattern as the current-model mark): it states
                    which runner produced this base's scores. Unmatched bases
                    render no badge at all — attribution is never guessed. */}
                {harness && (
                  <span
                    className="dsh_mr_ovHarness"
                    data-harness={harness}
                    title={`Harness · ${harnessMeta(harness).label}`}
                  >
                    <span className="dsh_mr_ovHarnessDot" />
                    <span className="dsh_mr_ovHarnessLabel">{harnessMeta(harness).label}</span>
                  </span>
                )}
                {isCurrent && <span className="dsh_mr_ovCurrent">{t('overview.current')}</span>}
              </span>
              <DeltaBadge points={view.series[group.best.key]} />
              <span className="dsh_mr_ovIqCell">
                <span className="dsh_mr_ovBarFill" data-band={band} style={{ width: `${widthPct}%` }} />
                {band === 'leading' && <span className="dsh_mr_ovLevel">{t('level.leading')}</span>}
                <span className="dsh_mr_ovIqVal">{group.best.iq.toFixed(1)}</span>
              </span>
            </div>
            {isOpen &&
              group.tiers
                .filter((tier) => tier.key !== group.best.key)
                .map((tier) => (
                  <div
                    key={tier.key}
                    className="dsh_mr_ovRow dsh_mr_ovChild"
                    data-selected={tier.key === selectedKey}
                    role="button"
                    aria-current={tier.key === selectedKey ? 'true' : undefined}
                    tabIndex={0}
                    onClick={() => onSelect(tier.key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') onSelect(tier.key)
                    }}
                  >
                    <span className="dsh_mr_ovRank" />
                    <span className="dsh_mr_ovChevron" />
                    <span className="dsh_mr_ovName">
                      <span className="dsh_mr_ovNameText">{tier.effort}</span>
                    </span>
                    <DeltaBadge points={view.series[tier.key]} />
                    <span className="dsh_mr_ovIqCell">
                      <span
                        className="dsh_mr_ovBarFill"
                        data-band={iqBand(tier.iq)}
                        style={{ width: `${iqProgress(tier.iq) * 100}%` }}
                      />
                      {iqBand(tier.iq) === 'leading' && <span className="dsh_mr_ovLevel">{t('level.leading')}</span>}
                      <span className="dsh_mr_ovIqVal">{tier.iq.toFixed(1)}</span>
                    </span>
                  </div>
                ))}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="dsh_mr_card">
      <div className="dsh_mr_cardHead">
        <span className="dsh_mr_cardTitle">{t('overview.title')}</span>
        <span className="dsh_mr_hint">{t('overview.hint')}</span>
      </div>
      {scroll ? (
        <PersistentScrollFrame viewportClassName="dsh_mr_ovScroll" label={t('overview.title')}>
          {list}
        </PersistentScrollFrame>
      ) : (
        list
      )}
    </div>
  )
}
