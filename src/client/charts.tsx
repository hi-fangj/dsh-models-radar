/** Dependency-free SVG trend and semantic task-progress components. */
import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import type { ModelRadarKey } from './locales.ts'
import { fmt } from './locales.ts'
import { PersistentScrollFrame } from './ScrollFrame.tsx'
import { trendSummary } from './scoreMetrics.ts'

const TREND_W = 640
const TREND_H = 190
const PAD = { top: 16, right: 14, bottom: 26, left: 46 }
const AXIS_STYLE = { fontSize: 10.5, fill: 'var(--dsw-alias-label-secondary)' } as const

type Translate = (key: ModelRadarKey) => string
type TaskRow = [string, number, boolean?]
type TaskCategory = 'pass' | 'split' | 'fail' | 'excellent' | 'good' | 'general' | 'low'
type TaskMode = 'binary' | 'continuous'

const two = (n: number): string => (n < 10 ? `0${n}` : String(n))

function formatStamp(iso: string, withTime: boolean): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const base = `${two(date.getMonth() + 1)}-${two(date.getDate())}`
  return withTime ? `${base} ${two(date.getHours())}:${two(date.getMinutes())}` : base
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** Catmull-Rom points converted to a clamped cubic Bézier SVG path. */
function smoothPath(points: Array<[number, number]>, minY: number, maxY: number): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`
  let path = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[Math.min(points.length - 1, i + 2)]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = clamp(p1[1] + (p2[1] - p0[1]) / 6, minY, maxY)
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = clamp(p2[1] - (p3[1] - p1[1]) / 6, minY, maxY)
    path += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return path
}

export function TrendLine({ points, t }: { points: Array<[string, number]>; t: Translate }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const summary = trendSummary(points)

  const geometry = useMemo(() => {
    if (points.length < 2) return null
    let min = Number.POSITIVE_INFINITY
    let max = Number.NEGATIVE_INFINITY
    for (const [, value] of points) {
      if (value < min) min = value
      if (value > max) max = value
    }
    if (min === max) {
      min -= 0.5
      max += 0.5
    }
    const slack = (max - min) * 0.08
    const lo = min - slack
    const hi = max + slack
    const innerW = TREND_W - PAD.left - PAD.right
    const innerH = TREND_H - PAD.top - PAD.bottom
    const x = (index: number): number => PAD.left + (index / (points.length - 1)) * innerW
    const y = (value: number): number => PAD.top + (1 - (value - lo) / (hi - lo)) * innerH
    const coordinates = points.map(([, value], index): [number, number] => [x(index), y(value)])
    const line = smoothPath(coordinates, PAD.top, TREND_H - PAD.bottom)
    const baseline = TREND_H - PAD.bottom
    const area = `${line} L ${coordinates[coordinates.length - 1][0].toFixed(1)} ${baseline} L ${coordinates[0][0].toFixed(1)} ${baseline} Z`
    return { lo, hi, x, y, line, area, last: points.length - 1 }
  }, [points])

  if (geometry === null || summary === null) return <div className="dsh_mr_empty" />

  const { lo, hi, x, y, line, area, last } = geometry
  const mid = (lo + hi) / 2
  const hovered = hoverIndex !== null ? points[hoverIndex] : undefined
  const deltaText =
    summary.direction === 'flat'
      ? '±0.0'
      : `${summary.delta24h > 0 ? '+' : ''}${summary.delta24h.toFixed(1)}`
  const endpointColor =
    summary.direction === 'up'
      ? 'var(--dsw-alias-state-success-primary)'
      : summary.direction === 'down'
        ? 'var(--dsw-alias-state-error-primary)'
        : 'var(--dsw-alias-brand-primary)'

  return (
    <>
      <div className="dsh_mr_trendStats">
        <span className="dsh_mr_trendStat">
          <span className="dsh_mr_trendStatLabel">{t('trend.delta24h')}</span>
          <strong data-dir={summary.direction}>{deltaText}</strong>
        </span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.min')}</span><strong>{summary.min.toFixed(1)}</strong></span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.average')}</span><strong>{summary.average.toFixed(1)}</strong></span>
        <span className="dsh_mr_trendStat"><span className="dsh_mr_trendStatLabel">{t('trend.max')}</span><strong>{summary.max.toFixed(1)}</strong></span>
      </div>
      <div className="dsh_mr_trendWrap">
        <svg
          viewBox={`0 0 ${TREND_W} ${TREND_H}`}
          role="img"
          aria-label="IQ trend"
          onMouseMove={(event: MouseEvent<SVGSVGElement>) => {
            const rect = event.currentTarget.getBoundingClientRect()
            const relX = ((event.clientX - rect.left) / rect.width) * TREND_W
            const ratio = (relX - PAD.left) / (TREND_W - PAD.left - PAD.right)
            setHoverIndex(clamp(Math.round(ratio * (points.length - 1)), 0, points.length - 1))
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {[hi, mid, lo].map((value) => (
            <g key={value}>
              <line x1={PAD.left} x2={TREND_W - PAD.right} y1={y(value)} y2={y(value)} stroke="var(--dsw-alias-border-l1)" strokeDasharray={value === mid ? 'none' : '3 4'} />
              <text x={PAD.left - 6} y={y(value) + 3.5} textAnchor="end" style={AXIS_STYLE}>{value.toFixed(1)}</text>
            </g>
          ))}
          <path d={area} fill="var(--dsw-alias-brand-primary)" fillOpacity="0.09" />
          <path d={line} fill="none" stroke="var(--dsw-alias-brand-primary)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {hovered !== undefined && hoverIndex !== null && (
            <>
              <line x1={x(hoverIndex)} x2={x(hoverIndex)} y1={PAD.top} y2={TREND_H - PAD.bottom} stroke="var(--dsw-alias-border-l2)" />
              <circle cx={x(hoverIndex)} cy={y(hovered[1])} r="3" fill="var(--dsw-alias-bg-layer-1)" stroke="var(--dsw-alias-brand-primary)" strokeWidth="2" />
            </>
          )}
          <circle cx={x(last)} cy={y(points[last][1])} r="3.8" fill={endpointColor} />
          <text x={x(last)} y={y(points[last][1]) - 9} textAnchor="end" style={{ ...AXIS_STYLE, fontWeight: 600, fill: 'var(--dsw-alias-label-primary)' }}>{points[last][1].toFixed(1)}</text>
          <text x={PAD.left} y={TREND_H - 8} style={AXIS_STYLE}>{formatStamp(points[0][0], false)}</text>
          <text x={TREND_W - PAD.right} y={TREND_H - 8} textAnchor="end" style={AXIS_STYLE}>{formatStamp(points[last][0], false)}</text>
        </svg>
        {hovered !== undefined && hoverIndex !== null && (
          <div className="dsh_mr_tip" style={{ left: `${(x(hoverIndex) / TREND_W) * 100}%`, top: `${(y(hovered[1]) / TREND_H) * 100}%` }}>
            {formatStamp(hovered[0], true)} · {hovered[1].toFixed(1)}
          </div>
        )}
      </div>
    </>
  )
}

function taskMode(benchmark: string, scoringMode?: string): TaskMode {
  return benchmark === 'deep-swe' || scoringMode === 'binary-majority' ? 'binary' : 'continuous'
}

function taskCategory(row: TaskRow, mode: TaskMode): TaskCategory {
  const [, rate, majorityPassed] = row
  if (mode === 'binary') {
    if (majorityPassed === true || (majorityPassed === undefined && rate >= 2 / 3)) return 'pass'
    if (rate > 0) return 'split'
    return 'fail'
  }
  if (rate >= 0.75) return 'excellent'
  if (rate >= 0.5) return 'good'
  if (rate >= 0.25) return 'general'
  return 'low'
}

const FILTER_KEYS: Record<TaskCategory | 'all', ModelRadarKey> = {
  all: 'task.filter.all', pass: 'task.filter.pass', split: 'task.filter.split', fail: 'task.filter.fail',
  excellent: 'task.filter.excellent', good: 'task.filter.good', general: 'task.filter.general', low: 'task.filter.low',
}

export function TaskBars({
  rows,
  benchmark,
  scoringMode,
  t,
}: {
  rows: TaskRow[]
  benchmark: string
  scoringMode?: string
  t: Translate
}) {
  const mode = taskMode(benchmark, scoringMode)
  const categories: TaskCategory[] = mode === 'binary' ? ['pass', 'split', 'fail'] : ['excellent', 'good', 'general', 'low']
  const [filter, setFilter] = useState<TaskCategory | 'all'>('all')
  useEffect(() => setFilter('all'), [mode])

  const enriched = rows
    .map((row) => ({ row, category: taskCategory(row, mode) }))
    .sort((a, b) => a.row[1] - b.row[1] || a.row[0].localeCompare(b.row[0]))
  const counts = Object.fromEntries(categories.map((category) => [category, enriched.filter((item) => item.category === category).length])) as Record<TaskCategory, number>
  const visible = filter === 'all' ? enriched : enriched.filter((item) => item.category === filter)
  const average = rows.length === 0 ? 0 : rows.reduce((sum, row) => sum + row[1], 0) / rows.length
  const passed = counts.pass ?? 0
  const summary =
    mode === 'binary'
      ? fmt(t('task.summary.pass'), { passed: String(passed), total: String(rows.length), rate: `${Math.round((passed / Math.max(1, rows.length)) * 100)}%` })
      : fmt(t('task.summary.average'), { rate: `${Math.round(average * 100)}%` })

  return (
    <>
      <div className="dsh_mr_taskSummary">
        <div className="dsh_mr_taskSummaryHead"><strong>{summary}</strong><span>{rows.length}</span></div>
        <div className="dsh_mr_taskAggregate" role="img" aria-label={summary}>
          {categories.map((category) => (
            <span key={category} data-band={category} style={{ width: `${(counts[category] / Math.max(1, rows.length)) * 100}%` }} />
          ))}
        </div>
      </div>
      <div className="dsh_mr_taskFilters">
        {(['all', ...categories] as Array<TaskCategory | 'all'>).map((category) => {
          const count = category === 'all' ? rows.length : counts[category]
          return (
            <button key={category} type="button" data-active={filter === category} data-band={category} onClick={() => setFilter(category)}>
              {t(FILTER_KEYS[category])} <span>{count}</span>
            </button>
          )
        })}
      </div>
      <PersistentScrollFrame viewportClassName="dsh_mr_taskScroll" label={t('bar.title')}>
        <div className="dsh_mr_bars">
          {visible.map(({ row: [taskId, rate], category }) => (
            <div className="dsh_mr_barRow" key={taskId}>
              <span className="dsh_mr_barLabel" title={taskId}>{taskId}</span>
              <div className="dsh_mr_barTrack">
                <div className="dsh_mr_barFill" data-band={category} style={{ width: `${clamp(rate, 0, 1) * 100}%` }} />
              </div>
              <span className="dsh_mr_barVal" data-band={category}>{Math.round(rate * 100)}%</span>
            </div>
          ))}
        </div>
      </PersistentScrollFrame>
    </>
  )
}
