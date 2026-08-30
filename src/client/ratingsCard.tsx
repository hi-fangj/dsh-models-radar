/**
 * The community-ratings card (settings page only, CONTEXT.md 社区体感分):
 * base-grouped effort bars over a fixed 0–10 axis, 近7天 / 近24小时 tabs, the
 * 未评分 placeholder for unrated slots, and a read-only highlight of the
 * section's selected tier (≈ marks the same-base stand-in). The bars encode
 * 颜色＝基座 with the site palette shared via harness.modelColor; score sits
 * on the bar top, effort under the column, counts in the hover tip.
 *
 * Data arrives through the section's ratings loader (one payload per window,
 * each with its own server-side freshness window); this component is
 * presentational plus the slot/match math in ratingsMetrics.ts.
 */
import { useMemo, useState } from 'react'
import type { CommunityRatingTier, CommunityRatingsPayload, RatingsWindow } from '../contract.ts'
import { costModelLabel, modelColor } from './harness.ts'
import type { ModelRadarKey } from './locales.ts'
import { fmt } from './locales.ts'
import { AXIS_STYLE, HGrid, PlotTip } from './plotFrame.tsx'
import { matchRatingsTier, ratingsGroups, ratingsSlots } from './ratingsMetrics.ts'
import type { RatingsSlot } from './ratingsMetrics.ts'

type Translate = (key: ModelRadarKey) => string

/** The ratings plot draws on its own canvas: 27+ columns need more width, and
 * the rotated effort labels more bottom pad, than the shared 640×190 frame. */
const RATINGS_W = 720
const RATINGS_H = 224
const PAD = { top: 26, right: 10, bottom: 42, left: 30 }
const SCORE_MAX = 10

/** Group header label: the cost chart's compact base names (Sol / DSV4 Flash / …). */
const groupName = (model: string): string => costModelLabel(model).name

/**
 * The community-ratings card body. `payloads`/`errors`/`loading` are keyed by
 * window; the active window's payload wins once present, so tab switches
 * render cached data immediately while a refresh is in flight.
 */
export function RatingsCard({
  win,
  onWinChange,
  payloads,
  errors,
  loading,
  onRetry,
  selectedKey,
  t,
}: {
  win: RatingsWindow
  onWinChange: (win: RatingsWindow) => void
  payloads: Partial<Record<RatingsWindow, CommunityRatingsPayload>>
  errors: Partial<Record<RatingsWindow, string>>
  loading: Partial<Record<RatingsWindow, boolean>>
  onRetry: () => void
  selectedKey: string | null
  t: Translate
}) {
  const tiers7d = payloads['7d']?.data?.tiers
  const tiers24h = payloads['24h']?.data?.tiers
  const slots = useMemo(() => ratingsSlots(tiers7d, tiers24h), [tiers7d, tiers24h])
  const groups = useMemo(() => ratingsGroups(slots), [slots])
  const active = payloads[win]?.data ?? null
  const error = errors[win]
  const busy = loading[win] === true

  return (
    <div className="dsh_mr_card">
      <div className="dsh_mr_cardHead">
        <span className="dsh_mr_cardTitle">{t('ratings.title')}</span>
        <div className="dsh_mr_seg" role="tablist" aria-label={t('ratings.title')}>
          {(['7d', '24h'] as const).map((candidate) => (
            <button
              key={candidate}
              type="button"
              role="tab"
              aria-selected={candidate === win}
              className="dsh_mr_segBtn"
              data-active={candidate === win}
              onClick={() => onWinChange(candidate)}
            >
              {candidate === '7d' ? t('window.7d') : t('window.24h')}
            </button>
          ))}
        </div>
      </div>
      <div className="dsh_mr_hint">{t('ratings.hint')}</div>
      {active !== null ? (
        <>
          {payloads[win]?.stale === true && (
            <div className="dsh_mr_banner" data-tone="warn">
              <span className="dsh_mr_bannerText">
                {fmt(t('status.stale'), {
                  time: new Date(payloads[win]?.fetchedAt ?? active.fetchedAt).toLocaleString(),
                  reason: payloads[win]?.notice ?? '',
                })}
              </span>
              <button type="button" className="dsh_mr_retry" onClick={onRetry}>
                {t('action.retry')}
              </button>
            </div>
          )}
          {active.tiers.length === 0 ? (
            <div className="dsh_mr_empty">{t('ratings.empty')}</div>
          ) : (
            <RatingsChart slots={slots} groups={groups} active={active.tiers} selectedKey={selectedKey} t={t} />
          )}
        </>
      ) : error !== undefined ? (
        <div className="dsh_mr_empty">
          {fmt(t('status.failed'), { reason: error })}{' '}
          <button type="button" className="dsh_mr_retry" onClick={onRetry}>
            {t('action.retry')}
          </button>
        </div>
      ) : (
        <div className="dsh_mr_empty">{busy ? t('ratings.loading') : t('ratings.empty')}</div>
      )}
    </div>
  )
}

/**
 * The grouped bar chart. Columns are the stable slot list (both windows'
 * union); scores come from the active window's tier map, so a slot absent
 * there renders the 未评分 placeholder — column positions never jump.
 */
function RatingsChart({
  slots,
  groups,
  active,
  selectedKey,
  t,
}: {
  slots: RatingsSlot[]
  groups: ReturnType<typeof ratingsGroups>
  active: readonly CommunityRatingTier[]
  selectedKey: string | null
  t: Translate
}) {
  const [hover, setHover] = useState<number | null>(null)

  const geometry = useMemo(() => {
    const innerW = RATINGS_W - PAD.left - PAD.right
    const innerH = RATINGS_H - PAD.top - PAD.bottom
    const baseline = PAD.top + innerH
    const pitch = innerW / Math.max(1, slots.length)
    const barW = Math.min(20, Math.max(6, pitch * 0.6))
    const cx = (index: number): number => PAD.left + pitch * (index + 0.5)
    const y = (score: number): number => PAD.top + (1 - score / SCORE_MAX) * innerH
    // Column boundary x between consecutive groups, for the faint separators.
    const separators: number[] = []
    let runLength = 0
    for (const group of groups) {
      runLength += group.slots.length
      if (runLength < slots.length) separators.push(PAD.left + pitch * runLength)
    }
    return { innerH, baseline, pitch, barW, cx, y, separators }
  }, [slots.length, groups])

  const scoreOf = useMemo(() => {
    const map = new Map<string, { average: number | null; count: number }>()
    for (const tier of active) map.set(tier.key, tier)
    return map
  }, [active])
  const match = useMemo(() => matchRatingsTier(active, selectedKey), [active, selectedKey])

  const { baseline, barW, cx, y, separators } = geometry
  const hovered = hover !== null ? slots[hover] : undefined
  const hoveredScore = hovered !== undefined ? scoreOf.get(hovered.key) : undefined

  return (
    <div className="dsh_mr_ratingsWrap">
      <svg
        viewBox={`0 0 ${RATINGS_W} ${RATINGS_H}`}
        role="img"
        aria-label={t('ratings.chart.label')}
        onMouseLeave={() => setHover(null)}
      >
        {[2, 4, 6, 8].map((value) => (
          <HGrid key={value} y={y(value)} x1={PAD.left} x2={RATINGS_W - PAD.right} label={value} />
        ))}
        <HGrid y={y(0)} x1={PAD.left} x2={RATINGS_W - PAD.right} label={0} dash="none" />
        <HGrid y={y(SCORE_MAX)} x1={PAD.left} x2={RATINGS_W - PAD.right} label={SCORE_MAX} />
        {separators.map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={PAD.top}
            y2={baseline}
            stroke="var(--dsw-alias-border-l1)"
            strokeDasharray="2 5"
          />
        ))}
        {groups.map((group) => {
          const first = slots.indexOf(group.slots[0])
          const last = first + group.slots.length - 1
          return (
            <text
              key={group.model}
              x={(cx(first) + cx(last)) / 2}
              y={12}
              textAnchor="middle"
              style={{ fontSize: 9.5, fontWeight: 600, fill: modelColor(group.model) }}
            >
              {groupName(group.model)}
            </text>
          )
        })}
        {slots.map((slot, index) => {
          const reading = scoreOf.get(slot.key)
          const highlighted = match !== null && match.tier.key === slot.key
          const color = modelColor(slot.model)
          return (
            <g key={slot.key}>
              {reading !== undefined && reading.average !== null ? (
                <>
                  <rect
                    x={cx(index) - barW / 2}
                    y={y(reading.average)}
                    width={barW}
                    height={baseline - y(reading.average)}
                    rx={2}
                    fill={color}
                    opacity={hover === null || hover === index ? 1 : 0.55}
                    stroke={highlighted ? 'var(--dsw-alias-label-primary)' : 'none'}
                    strokeWidth={highlighted ? 1.5 : 0}
                  />
                  <text
                    x={cx(index)}
                    y={y(reading.average) - 5}
                    textAnchor="middle"
                    style={{ fontSize: 9, fontWeight: 600, fill: color }}
                  >
                    {`${match !== null && match.approx && highlighted ? '≈' : ''}${reading.average.toFixed(1)}`}
                  </text>
                </>
              ) : (
                <text
                  x={cx(index)}
                  y={baseline - 6}
                  textAnchor="middle"
                  style={{ fontSize: 7.5, fill: 'var(--dsw-alias-label-secondary)' }}
                >
                  {t('ratings.none')}
                </text>
              )}
              <text
                x={cx(index) + 2}
                y={baseline + 7}
                textAnchor="end"
                transform={`rotate(-42 ${cx(index) + 2} ${baseline + 7})`}
                style={AXIS_STYLE}
              >
                {slot.effort}
              </text>
              {/* Full-column hover capture: bars and placeholders read alike. */}
              <rect
                x={cx(index) - geometry.pitch / 2}
                y={PAD.top}
                width={geometry.pitch}
                height={baseline - PAD.top}
                fill="transparent"
                onMouseEnter={() => setHover(index)}
              />
            </g>
          )
        })}
      </svg>
      {hovered !== undefined && hover !== null && (
        <PlotTip
          x={cx(hover)}
          y={PAD.top + 8}
          width={RATINGS_W}
          height={RATINGS_H}
          accent={modelColor(hovered.model)}
        >
          <div className="dsh_mr_tipHead" style={{ color: modelColor(hovered.model) }}>
            {`${groupName(hovered.model)} · ${hovered.effort}`}
          </div>
          <div>
            {hoveredScore?.average != null
              ? fmt(t('ratings.tip.score'), {
                  score: hoveredScore.average.toFixed(1),
                  count: String(hoveredScore.count),
                })
              : t('ratings.tip.none')}
          </div>
        </PlotTip>
      )}
    </div>
  )
}
