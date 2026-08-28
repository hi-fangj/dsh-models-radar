/**
 * Cost × IQ comparison scatter (settings page only): three stacked panels —
 * composite cost, time cost, price cost — over every visible tier, encoded
 * exactly like the radar site: color = base model (site palette), marker
 * shape = reasoning effort, log x-axis, linear IQ axis (0–120).
 *
 * The composite index is derived client-side from fields the contract already
 * carries (avgPrice, avgMinutes) using the site's own trade-off formula
 * ("2.5× price buys 1.35× speed"), normalized per chart to max=100 — no wire
 * or snapshot changes. Tiers missing a metric simply stay off that panel.
 */
import { useMemo, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import type { RadarView } from '../contract.ts'
import type { ModelRadarKey } from './locales.ts'
import {
  buildCostDataset,
  DEFAULT_HIDDEN_BASES,
  EFFORT_ORDER,
  listBases,
  type CostMetric,
  type CostLadder,
  type ScatterPoint,
} from './costMetrics.ts'
import { AXIS_STYLE, HGrid, PLOT_H, PLOT_W, PlotTip, viewBoxX } from './plotFrame.tsx'
import { logDomain } from './plotGeometry.ts'

/** Site-canonical per-base palette (its MODEL_COLORS table, verbatim). */
const MODEL_COLORS: Record<string, string> = {
  'grok-4.6': '#f59e0b',
  k3: '#10b981',
  'glm-5.3': '#f5f5f5',
  'glm-5.3-flash': '#f6c453',
  'gpt-5.6-sol': '#eab308',
  'gpt-5.6-terra': '#3b82f6',
  'gpt-5.6-luna': '#c7d2e0',
  'gpt-5.5': '#00e5ff',
  'deepseek-v4-flash': '#4d6bfe',
  'deepseek-v4-pro': '#a78bfa',
  'dsh-deepseek-v4-flash': '#4d6bfe',
  'dsh-deepseek-v4-pro': '#a78bfa',
  'dsh-deepseek-v4-flash-vision-exp': '#22c55e',
}

function modelColor(base: string): string {
  return MODEL_COLORS[base] ?? 'var(--dsw-alias-label-secondary)'
}

/** Site's efficiencyShapePath: marker shape per reasoning effort. */
function effortShapePath(effort: string, cx: number, cy: number, r: number): string {
  const x = Number(cx)
  const y = Number(cy)
  const point = (px: number, py: number): string => `${px.toFixed(1)} ${py.toFixed(1)}`
  if (effort === 'off') {
    return (
      `M${point(x - r * 0.78, y - r * 0.78)} L${point(x + r * 0.78, y + r * 0.78)} ` +
      `M${point(x + r * 0.78, y - r * 0.78)} L${point(x - r * 0.78, y + r * 0.78)}`
    )
  }
  if (effort === 'medium') {
    return `M${point(x, y - r)} L${point(x + r, y + r * 0.85)} L${point(x - r, y + r * 0.85)} Z`
  }
  if (effort === 'high') {
    const s = r * 0.82
    return `M${point(x - s, y - s)} PLOT_H${(x + s).toFixed(1)} V${(y + s).toFixed(1)} PLOT_H${(x - s).toFixed(1)} Z`
  }
  if (effort === 'xhigh') {
    return `M${point(x, y - r)} L${point(x + r, y)} L${point(x, y + r)} L${point(x - r, y)} Z`
  }
  if (effort === 'max') {
    const w = r * 0.86
    return (
      `M${point(x - w, y - r * 0.5)} L${point(x, y - r)} L${point(x + w, y - r * 0.5)} ` +
      `L${point(x + w, y + r * 0.5)} L${point(x, y + r)} L${point(x - w, y + r * 0.5)} Z`
    )
  }
  if (effort === 'ultra') {
    const star: string[] = []
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5
      const radius = i % 2 ? r * 0.45 : r
      star.push(point(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius))
    }
    return `M${star.join(' L')} Z`
  }
  return `M${point(x - r, y)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${point(x + r, y)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${point(x - r, y)} Z`
}

/** 1-2-5 candidates per decade inside [min, max]; thins out if too dense. */
function logTicks(min: number, max: number): number[] {
  const ticks: number[] = []
  const start = Math.floor(Math.log10(min))
  const end = Math.ceil(Math.log10(max))
  for (let decade = start; decade <= end; decade++) {
    for (const step of [1, 2, 5]) {
      const value = step * 10 ** decade
      if (value >= min * 0.999 && value <= max * 1.001) ticks.push(value)
    }
  }
  if (ticks.length > 7) return ticks.filter((value) => /(^5|^1)0*$/.test(String(value).replace('.', '')))
  return ticks
}

function fmtX(metric: 'combined' | 'minutes' | 'price', value: number): string {
  if (metric === 'price') return `$${value < 1 ? value.toFixed(2) : value >= 10 ? Math.round(value) : value.toFixed(1)}`
  if (metric === 'minutes') return `${value < 10 ? value.toFixed(1) : Math.round(value)} 分钟`
  return value < 1 ? value.toFixed(2) : value < 10 ? value.toFixed(1) : Math.round(value).toString()
}

const PAD = { top: 14, right: 16, bottom: 26, left: 40 }
const IQ_MAX = 120

/**
 * One log-x panel: IQ gridlines, decade ticks, and one shape marker per
 * visible tier. Hovering surfaces the tier's full reading. The caption is
 * omitted when a tab control already carries the metric context.
 */
function CostPanel({
  title,
  metric,
  points,
  ladders,
  focus,
  t,
}: {
  title?: string
  metric: CostMetric
  points: ScatterPoint[]
  ladders: CostLadder[]
  /** Hovered/focused base model, or null; dims every other series. */
  focus: string | null
  t: (key: ModelRadarKey) => string
}) {
  const [hover, setHover] = useState<number | null>(null)

  const seriesClass = (model: string): string => {
    if (focus === null) return 'dsh_mr_costSeries'
    return focus === model ? 'dsh_mr_costSeries is-focused' : 'dsh_mr_costSeries is-muted'
  }

  const head = title !== undefined ? <div className="dsh_mr_trendPanelHead">{title}</div> : null
  if (points.length === 0) {
    return (
      <section className="dsh_mr_trendPanel">
        {head}
        <div className="dsh_mr_empty">{t('cost.empty')}</div>
      </section>
    )
  }

  const { lo, hi } = logDomain(points.map((point) => point.x))
  const loLog = Math.log10(lo)
  const spanLog = Math.log10(hi) - loLog
  const innerW = PLOT_W - PAD.left - PAD.right
  const innerH = PLOT_H - PAD.top - PAD.bottom
  const px = (value: number): number => PAD.left + ((Math.log10(value) - loLog) / spanLog) * innerW
  const py = (iq: number): number => PAD.top + (1 - Math.min(iq, IQ_MAX) / IQ_MAX) * innerH
  const ticks = logTicks(lo, hi)
  const iqTicks = [0, 20, 40, 60, 80, 100, 120]
  const hovered = hover !== null ? points[hover] : undefined

  return (
    <section className="dsh_mr_trendPanel" data-model-focus={focus !== null ? 'true' : undefined}>
      {head}
      <div className="dsh_mr_trendWrap">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
          role="img"
          aria-label={title}
          onMouseMove={(event: MouseEvent<SVGSVGElement>) => {
            const relX = viewBoxX(event, PLOT_W)
            let best = 0
            let bestDist = Number.POSITIVE_INFINITY
            points.forEach((point, index) => {
              const dist = Math.abs(px(point.x) - relX)
              if (dist < bestDist) {
                bestDist = dist
                best = index
              }
            })
            setHover(best)
          }}
          onMouseLeave={() => setHover(null)}
        >
          {iqTicks.map((value) => (
            <HGrid key={value} y={py(value)} x1={PAD.left} x2={PLOT_W - PAD.right} label={value} dash={value === 0 ? 'none' : '3 4'} />
          ))}
          {ticks.map((value) => (
            <g key={value}>
              <line x1={px(value)} x2={px(value)} y1={PAD.top} y2={PLOT_H - PAD.bottom} stroke="var(--dsw-alias-border-l1)" strokeDasharray="3 4" />
              <text x={px(value)} y={PLOT_H - 8} textAnchor="middle" style={AXIS_STYLE}>{fmtX(metric, value)}</text>
            </g>
          ))}
          {/* Same-base ladder lines beneath the markers, site parity: points
              joined in effort-strength order (off→ultra), round 2.1 stroke at
              0.78 opacity, skipped for single-point bases. */}
          {ladders.map((ladder) =>
            ladder.length > 1 ? (
              <path
                key={ladder[0].tier.model}
                className={`${seriesClass(ladder[0].tier.model)} dsh_mr_costLadder`}
                d={ladder.map((point, index) => `${index ? 'L' : 'M'}${px(point.x).toFixed(1)} ${py(point.tier.iq).toFixed(1)}`).join(' ')}
                fill="none"
                stroke={modelColor(ladder[0].tier.model)}
                strokeWidth="2.1"
                strokeLinejoin="round"
                strokeLinecap="round"
                opacity="0.78"
              />
            ) : null,
          )}
          {points.map(({ tier, x }, index) => (
            <path
              key={tier.key}
              className={seriesClass(tier.model)}
              d={effortShapePath(tier.effort, px(x), py(tier.iq), 5)}
              fill="var(--dsw-alias-bg-layer-1)"
              stroke={modelColor(tier.model)}
              strokeWidth={hover === index ? 2.6 : 1.8}
            />
          ))}
        </svg>
        {hovered !== undefined && (
          <PlotTip x={px(hovered.x)} y={py(hovered.iq)} width={PLOT_W} height={PLOT_H}>
            {hovered.tier.model} · {hovered.tier.effort} · IQ {hovered.tier.iq.toFixed(1)} · {fmtX(metric, hovered.x)}
          </PlotTip>
        )}
      </div>
    </section>
  )
}

const COST_METRIC_KEY = 'model-radar:cost-metric'
type CostMetric = 'combined' | 'minutes' | 'price'
const COST_METRICS: CostMetric[] = ['combined', 'minutes', 'price']
const COST_TAB_KEYS: Record<CostMetric, ModelRadarKey> = {
  combined: 'cost.tab.combined',
  minutes: 'cost.tab.minutes',
  price: 'cost.tab.price',
}

function readCostMetric(): CostMetric {
  try {
    const stored = localStorage.getItem(COST_METRIC_KEY) as CostMetric | null
    return stored !== null && COST_METRICS.includes(stored) ? stored : 'combined'
  } catch {
    return 'combined'
  }
}

/**
 * The「成本 × IQ」card: model filter chips (site parity, synced across all
 * three tabs), the effort shape legend, then the active metric panel —
 * composite / time / price switched by tabs (default composite, choice
 * remembered) so the page stays compact.
 */
export function CostScatterCard({ view, t }: { view: RadarView; t: (key: ModelRadarKey) => string }) {
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(DEFAULT_HIDDEN_BASES))
  const [metric, setMetric] = useState<CostMetric>(readCostMetric)
  /** Base model whose chip is hovered: the chart focuses its series alone. */
  const [focus, setFocus] = useState<string | null>(null)
  // Chip row lists every base (hidden ones stay clickable to re-enable);
  // panels derive from the caller-filtered visible tiers only.
  const bases = useMemo(() => listBases(view.tiers), [view.tiers])
  const dataset = useMemo(
    () => buildCostDataset(view.tiers.filter((tier) => !hidden.has(tier.model))),
    [view.tiers, hidden],
  )

  const toggle = (base: string): void => {
    setHidden((previous) => {
      const next = new Set(previous)
      if (next.has(base)) next.delete(base)
      else next.add(base)
      return next
    })
  }

  const selectMetric = (next: CostMetric): void => {
    try {
      localStorage.setItem(COST_METRIC_KEY, next)
    } catch {
      // Persistence is best-effort; the tab still switches for this visit.
    }
    setMetric(next)
  }

  const points = dataset.points[metric]
  const ladders = dataset.ladders[metric]

  return (
    <div className="dsh_mr_card">
      <div className="dsh_mr_cardHead">
        <div className="dsh_mr_costTitleGroup">
          <span className="dsh_mr_cardTitle">{t('cost.title')}</span>
          <span className="dsh_mr_hint">{t('cost.hint')}</span>
        </div>
        <span className="dsh_mr_costLegend">
          {EFFORT_ORDER.map((effort) => (
            <span key={effort}>
              <svg viewBox="0 0 12 12" aria-hidden="true">
                <path className="dsh_mr_costSymbol" d={effortShapePath(effort, 6, 6, 4)} />
              </svg>
              {effort}
            </span>
          ))}
        </span>
      </div>
      <div className="dsh_mr_costChips" role="group" aria-label={t('cost.filter.all')}>
        <button type="button" className="dsh_mr_costChip" data-all="" onClick={() => setHidden(new Set())}>
          {t('cost.filter.all')}
        </button>
        {bases.map((base) => (
          <button
            key={base}
            type="button"
            className="dsh_mr_costChip"
            data-active={!hidden.has(base)}
            style={{ '--chip-color': modelColor(base) } as CSSProperties}
            onClick={() => toggle(base)}
            onMouseEnter={() => setFocus(base)}
            onMouseLeave={() => setFocus(null)}
            onFocus={() => setFocus(base)}
            onBlur={() => setFocus(null)}
          >
            <span className="dsh_mr_costChipDot" />
            {base}
          </button>
        ))}
      </div>
      <div className="dsh_mr_tabBody">
        <div className="dsh_mr_seg" role="tablist" aria-label={t('cost.title')}>
          {COST_METRICS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              className="dsh_mr_segBtn"
              role="tab"
              aria-selected={metric === candidate}
              data-active={metric === candidate}
              onClick={() => selectMetric(candidate)}
            >
              {t(COST_TAB_KEYS[candidate])}
            </button>
          ))}
        </div>
        <CostPanel metric={metric} points={points} ladders={ladders} focus={focus} t={t} />
      </div>
    </div>
  )
}
