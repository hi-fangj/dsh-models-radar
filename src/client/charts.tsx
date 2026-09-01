/** Dependency-free SVG trend and semantic task-progress components. */
import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import type { ModelRadarKey } from './locales.ts'
import { fmt } from './locales.ts'
import type { RadarView } from '../contract.ts'
import { PersistentScrollFrame } from './ScrollFrame.tsx'
import { bandColor, deltaSignal, iqBand, sliceRecentPoints, windowSummary } from './scoreMetrics.ts'
import type { IqBand } from './scoreMetrics.ts'
import { AXIS_STYLE, HGrid, PLOT_H, PLOT_W, PlotTip, viewBoxX } from './plotFrame.tsx'
import { BAND_BOUNDARIES, buildSegments, fitRange, singlePointSpan } from './plotGeometry.ts'
import { diagnoseTasks, taskLanguageBadge, taskMode, visibleOf } from './taskMetrics.ts'
import type { TaskFilter, TaskRow } from './taskMetrics.ts'

const PAD = { top: 16, right: 14, bottom: 26, left: 46 }

/** Band display names (tooltip), keyed into the model-radar locale namespace. */
const BAND_LABEL: Record<IqBand, ModelRadarKey> = {
  low: 'level.low',
  general: 'level.general',
  steady: 'level.steady',
  excellent: 'level.excellent',
  leading: 'level.leading',
}

type Translate = (key: ModelRadarKey) => string

const two = (n: number): string => (n < 10 ? `0${n}` : String(n))

function formatStamp(iso: string | number, withTime: boolean): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const base = `${two(date.getMonth() + 1)}-${two(date.getDate())}`
  return withTime ? `${base} ${two(date.getHours())}:${two(date.getMinutes())}` : base
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * One time-window trend panel: captioned chart with its own symmetric stats
 * row (net change / low / average / high over this window). A lone point
 * renders the flat line from its test time to the current moment (CONTEXT.md
 * 趋势) instead of a chart-with-curve; an empty window renders the
 * empty-state text. The caption is omitted when a tab control already
 * carries the window context.
 */
export function TrendPanel({
  title,
  emptyText,
  points,
  t,
}: {
  title?: string
  emptyText: string
  points: Array<[string, number]>
  t: Translate
}) {
  // Hover trace: the sampled point's index plus its viewBox x — multi-point
  // panels ride the curve by index, the single-point panel pins index 0 and
  // follows the pointer so the one reading is reachable everywhere.
  const [hover, setHover] = useState<{ index: number; px: number } | null>(null)
  const summary = windowSummary(points)

  const geometry = useMemo(() => {
    if (points.length === 0) return null
    const { lo, hi } = fitRange(points.map(([, value]) => value))
    const innerW = PLOT_W - PAD.left - PAD.right
    const innerH = PLOT_H - PAD.top - PAD.bottom
    const y = (value: number): number => PAD.top + (1 - (value - lo) / (hi - lo)) * innerH
    const baseline = PLOT_H - PAD.bottom
    const bandLines = BAND_BOUNDARIES.map((boundary) => ({ boundary, py: y(boundary) }))
      .filter(({ py }) => py >= PAD.top - 0.5 && py <= PLOT_H - PAD.bottom + 0.5)
    if (points.length === 1) {
      const testTs = new Date(points[0][0]).getTime()
      const now = Date.now()
      const span = singlePointSpan(Number.isNaN(testTs) ? now : testTs, now)
      return {
        kind: 'single' as const,
        lo,
        hi,
        y,
        baseline,
        bandLines,
        value: points[0][1],
        pointX: PAD.left + span.pointFraction * innerW,
        endX: PAD.left + innerW,
        loTs: span.lo,
        hiTs: span.hi,
      }
    }
    const x = (index: number): number => PAD.left + (index / (points.length - 1)) * innerW
    return {
      kind: 'multi' as const,
      lo,
      hi,
      y,
      baseline,
      bandLines,
      x,
      last: points.length - 1,
      segments: buildSegments(points.map(([, value]) => value), x, y),
    }
  }, [points])

  const head = title !== undefined ? <div className="dsh_mr_trendPanelHead">{title}</div> : null
  if (geometry === null || summary === null) {
    return (
      <section className="dsh_mr_trendPanel">
        {head}
        <div className="dsh_mr_empty">{emptyText}</div>
      </section>
    )
  }

  const { lo, hi, y, baseline, bandLines } = geometry
  const mid = (lo + hi) / 2
  const single = geometry.kind === 'single' ? geometry : null
  const multi = geometry.kind === 'multi' ? geometry : null
  const hovered = hover !== null ? points[hover.index] : undefined
  const changeText = deltaSignal({ direction: summary.direction, delta: summary.change }).text
  // The endpoint and hover markers carry the capability band color: the
  // momentum semantics live in the delta badge and trend stats instead.
  const endpointValue = geometry.kind === 'single' ? geometry.value : points[geometry.last][1]
  const endpointColor = bandColor(iqBand(endpointValue))
  const endpointY = y(endpointValue)
  // The lone reading's value label reads rightward while the point hugs the
  // left edge; a clock-skewed clamp parks it on the right edge, where the
  // label flips to read leftward to stay inside the plot.
  const singleLabelAnchor = single !== null && single.pointX > PLOT_W - PAD.right - 60 ? ('end' as const) : ('start' as const)
  const onMove = (event: MouseEvent<SVGSVGElement>): void => {
    if (geometry === null) return
    const relX = viewBoxX(event, PLOT_W)
    if (geometry.kind === 'single') {
      setHover({ index: 0, px: clamp(relX, PAD.left, PLOT_W - PAD.right) })
      return
    }
    const ratio = (relX - PAD.left) / (PLOT_W - PAD.left - PAD.right)
    const index = clamp(Math.round(ratio * (points.length - 1)), 0, points.length - 1)
    setHover({ index, px: geometry.x(index) })
  }

  return (
    <section className="dsh_mr_trendPanel">
      {head}
      <div className="dsh_mr_trendStats">
        <span className="dsh_mr_trendStat">
          <span className="dsh_mr_trendStatLabel">{t('trend.change')}</span>
          <strong data-dir={summary.direction}>{changeText}</strong>
        </span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.min')}</span><strong>{summary.min.toFixed(1)}</strong></span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.average')}</span><strong>{summary.average.toFixed(1)}</strong></span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.max')}</span><strong>{summary.max.toFixed(1)}</strong></span>
      </div>
      <div className="dsh_mr_trendWrap">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
          role="img"
          aria-label={`${title} · IQ trend`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        >
          {[hi, mid, lo].map((value) => (
            <HGrid key={value} y={y(value)} x1={PAD.left} x2={PLOT_W - PAD.right} label={value.toFixed(1)} dash={value === mid ? 'none' : '3 4'} />
          ))}
          {bandLines.map(({ boundary, py }) => (
            <g key={boundary}>
              <line x1={PAD.left} x2={PLOT_W - PAD.right} y1={py} y2={py} stroke="var(--dsw-alias-border-l2)" strokeDasharray="2 4" />
              <text x={PLOT_W - PAD.right + 6} y={py + 3.5} textAnchor="start" style={{ ...AXIS_STYLE, fontSize: 9 }}>{boundary}</text>
            </g>
          ))}
          {multi !== null && multi.segments.map((segment, index) => (
            <g key={index}>
              <path
                d={`${segment.path} L ${segment.x1.toFixed(1)} ${baseline} L ${segment.x0.toFixed(1)} ${baseline} Z`}
                fill={segment.color}
                fillOpacity="0.09"
              />
              <path d={segment.path} fill="none" stroke={segment.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          ))}
          {single !== null && (
            <>
              {/* The lone reading extends flat to the current moment (CONTEXT.md
                  趋势): fill and stroke share the reading's band color, exactly
                  how an all-equal multi-point series paints. */}
              <path
                d={`M ${single.pointX.toFixed(1)} ${endpointY.toFixed(1)} L ${single.endX.toFixed(1)} ${endpointY.toFixed(1)} L ${single.endX.toFixed(1)} ${baseline} L ${single.pointX.toFixed(1)} ${baseline} Z`}
                fill={endpointColor}
                fillOpacity="0.09"
              />
              <path
                d={`M ${single.pointX.toFixed(1)} ${endpointY.toFixed(1)} L ${single.endX.toFixed(1)} ${endpointY.toFixed(1)}`}
                fill="none"
                stroke={endpointColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
          {hovered !== undefined && hover !== null && (
            <>
              <line x1={hover.px} x2={hover.px} y1={PAD.top} y2={PLOT_H - PAD.bottom} stroke="var(--dsw-alias-border-l2)" />
              <circle cx={hover.px} cy={y(hovered[1])} r="3" fill="var(--dsw-alias-bg-layer-1)" stroke={bandColor(iqBand(hovered[1]))} strokeWidth="2" />
            </>
          )}
          {multi !== null && (
            <>
              <circle cx={multi.x(multi.last)} cy={endpointY} r="3.8" fill={endpointColor} />
              <text x={multi.x(multi.last)} y={endpointY - 9} textAnchor="end" style={{ ...AXIS_STYLE, fontWeight: 600, fill: 'var(--dsw-alias-label-primary)' }}>{endpointValue.toFixed(1)}</text>
            </>
          )}
          {single !== null && (
            <>
              <circle cx={single.pointX} cy={endpointY} r="3.8" fill={endpointColor} />
              <text x={single.pointX} y={endpointY - 9} textAnchor={singleLabelAnchor} style={{ ...AXIS_STYLE, fontWeight: 600, fill: 'var(--dsw-alias-label-primary)' }}>{single.value.toFixed(1)}</text>
            </>
          )}
          {multi !== null && (
            <>
              <text x={PAD.left} y={PLOT_H - 8} style={AXIS_STYLE}>{formatStamp(points[0][0], false)}</text>
              <text x={PLOT_W - PAD.right} y={PLOT_H - 8} textAnchor="end" style={AXIS_STYLE}>{formatStamp(points[multi.last][0], false)}</text>
            </>
          )}
          {single !== null && (
            <>
              <text x={PAD.left} y={PLOT_H - 8} style={AXIS_STYLE}>{formatStamp(single.loTs, true)}</text>
              <text x={PLOT_W - PAD.right} y={PLOT_H - 8} textAnchor="end" style={AXIS_STYLE}>{formatStamp(single.hiTs, true)}</text>
            </>
          )}
        </svg>
        {hovered !== undefined && hover !== null && (
          <PlotTip x={hover.px} y={y(hovered[1])} width={PLOT_W} height={PLOT_H}>
            {formatStamp(hovered[0], true)} · {hovered[1].toFixed(1)} {t(BAND_LABEL[iqBand(hovered[1])])}
          </PlotTip>
        )}
      </div>
    </section>
  )
}

const TREND_WINDOW_KEY = 'model-radar:trend-window'
type TrendWindow = '24h' | '7d'

function readTrendWindow(): TrendWindow {
  try {
    return localStorage.getItem(TREND_WINDOW_KEY) === '24h' ? '24h' : '7d'
  } catch {
    return '7d'
  }
}

/**
 * The trend card body: near-24h and near-7d windows as tab-switched views of
 * the same hourly series (time-sliced; some tiers carry sub-hourly readings).
 * One window visible at a time — the page stays compact; the choice persists
 * like the benchmark/tier selections. Each window scales its own y-axis and
 * carries its own stats.
 */
export function TrendTabs({ points, t }: { points: Array<[string, number]>; t: Translate }) {
  const [win, setWin] = useState<TrendWindow>(readTrendWindow)
  const select = (next: TrendWindow): void => {
    try {
      localStorage.setItem(TREND_WINDOW_KEY, next)
    } catch {
      // Persistence is best-effort; the tab still switches for this visit.
    }
    setWin(next)
  }
  const points24 = useMemo(() => sliceRecentPoints(points, 24), [points])

  return (
    <div className="dsh_mr_tabBody">
      <div className="dsh_mr_seg" role="tablist" aria-label={t('line.title')}>
        <button type="button" className="dsh_mr_segBtn" role="tab" aria-selected={win === '24h'} data-active={win === '24h'} onClick={() => select('24h')}>
          {t('window.24h')}
        </button>
        <button type="button" className="dsh_mr_segBtn" role="tab" aria-selected={win === '7d'} data-active={win === '7d'} onClick={() => select('7d')}>
          {t('window.7d')}
        </button>
      </div>
      {win === '24h' ? (
        <TrendPanel emptyText={t('empty.noRecent')} points={points24} t={t} />
      ) : (
        <TrendPanel emptyText={t('empty.noSeries')} points={points} t={t} />
      )}
    </div>
  )
}

/** Filter-button labels keyed by TaskFilter (locale namespace); order comes from the diagnostics. */
const FILTER_KEYS: Record<TaskFilter, ModelRadarKey> = {
  all: 'task.filter.all', pass: 'task.filter.pass', split: 'task.filter.split', fail: 'task.filter.fail',
  excellent: 'task.filter.excellent', good: 'task.filter.good', general: 'task.filter.general', low: 'task.filter.low',
}

/** Rows shown before the list collapses behind the expand toggle (popover context). */
const COLLAPSED_ROW_COUNT = 8

/**
 * The task-composition card: aggregate stacked bar, category filter buttons,
 * and the sorted per-task bars. All classification, counting, ordering and
 * summary derivation lives in taskMetrics.ts; this component owns only the
 * filter state, locale text, and presentation.
 */
export function TaskBars({
  rows,
  benchmark,
  scoringMode,
  taskMeta,
  t,
  scroll = true,
  collapsible = false,
}: {
  rows: TaskRow[]
  benchmark: string
  scoringMode?: string
  /** Task id → repo link + language (contract.taskMeta); absent → plain titles, no badges. */
  taskMeta?: RadarView['taskMeta']
  t: Translate
  /** Wrap the list in the persistent scroll frame; false lets the parent viewport own scrolling. */
  scroll?: boolean
  /** Cap the list at COLLAPSED_ROW_COUNT rows behind an expand toggle; the settings scroll frame never needs it. */
  collapsible?: boolean
}) {
  const mode = taskMode(benchmark, scoringMode)
  const [filter, setFilter] = useState<TaskFilter>('all')
  useEffect(() => setFilter('all'), [mode])
  // The scan+sort depends only on rows+mode; a filter click just swaps the
  // O(1) bucket reference (visibleOf), never recomputes this.
  const diagnostics = useMemo(() => diagnoseTasks(rows, mode), [rows, mode])
  const total = rows.length
  const summary =
    diagnostics.mode === 'binary'
      ? fmt(t('task.summary.pass'), {
          passed: String(diagnostics.summary.passed),
          total: String(diagnostics.summary.total),
          rate: `${diagnostics.summary.rate}%`,
        })
      : fmt(t('task.summary.average'), { rate: `${diagnostics.summary.rate}%` })
  const visible = visibleOf(diagnostics, filter)
  // Default-collapsed: show the head rows only until expanded; data or filter
  // changes return the list to that default so a stale expand never resurfaces.
  const [expanded, setExpanded] = useState(false)
  useEffect(() => setExpanded(false), [rows, filter])
  const collapsed = collapsible && !expanded && visible.length > COLLAPSED_ROW_COUNT
  const shown = collapsed ? visible.slice(0, COLLAPSED_ROW_COUNT) : visible

  const bars = (
    <div className="dsh_mr_bars">
      {shown.map(({ row: [taskId, rate], category }) => {
        const meta = taskMeta?.[taskId]
        const badge = taskLanguageBadge(meta?.language)
        return (
          <div className="dsh_mr_barRow" key={taskId}>
            <span className="dsh_mr_barLabelCell">
              {meta?.repo !== undefined ? (
                <a
                  className="dsh_mr_barLabel"
                  href={meta.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={taskId}
                >
                  {taskId}
                </a>
              ) : (
                <span className="dsh_mr_barLabel" title={taskId}>{taskId}</span>
              )}
              {badge !== null && (
                <span
                  className="dsh_mr_langBadge"
                  data-lang={badge.id}
                  title={fmt(t('task.lang.title'), { language: badge.full })}
                >
                  {badge.label}
                </span>
              )}
            </span>
            <div className="dsh_mr_barTrack">
              <div className="dsh_mr_barFill" data-band={category} style={{ width: `${clamp(rate, 0, 1) * 100}%` }} />
            </div>
            <span className="dsh_mr_barVal" data-band={category}>{Math.round(rate * 100)}%</span>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <div className="dsh_mr_taskSummary">
        <div className="dsh_mr_taskSummaryHead"><strong>{summary}</strong><span>{total}</span></div>
        <div className="dsh_mr_taskAggregate" role="img" aria-label={summary}>
          {diagnostics.counts.map(({ category, count }) => (
            <span key={category} data-band={category} style={{ width: `${(count / Math.max(1, total)) * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="dsh_mr_taskFilters">
        {([{ category: 'all' as TaskFilter, count: total }, ...diagnostics.counts]).map(({ category, count }) => (
          <button key={category} type="button" data-active={filter === category} data-band={category} onClick={() => setFilter(category)}>
            {t(FILTER_KEYS[category])} <span>{count}</span>
          </button>
        ))}
      </div>
      {scroll ? (
        <PersistentScrollFrame viewportClassName="dsh_mr_taskScroll" label={t('bar.title')}>
          {bars}
        </PersistentScrollFrame>
      ) : (
        bars
      )}
      {collapsible && visible.length > COLLAPSED_ROW_COUNT && (
        <button type="button" className="dsh_mr_more" onClick={() => setExpanded((value) => !value)}>
          {collapsed ? fmt(t('task.expand'), { count: String(visible.length) }) : t('task.collapse')}
        </button>
      )}
    </>
  )
}
