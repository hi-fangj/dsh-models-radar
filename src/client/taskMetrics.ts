/**
 * Task-status semantics behind the task-composition bars (CONTEXT.md
 * 任务状态): per-channel classification, counting, ordering, and summary
 * inputs — DeepSWE majority vote (binary) and continuous F1 bands — in one
 * React-free module, so views only render precomputed data.
 *
 * The two channel kinds are genuinely different vocabularies, so the
 * diagnostics result is a discriminated union: reading a binary category
 * (`pass`/`split`/`fail`) off a continuous result is a type error, closing
 * the cross-mode leak of the shared union this module replaces.
 */

/** One task row from the wire contract's `taskRates`: `[taskId, rate, majorityPassed?]`. */
export type TaskRow = [taskId: string, rate: number, majorityPassed?: boolean]

export type TaskMode = 'binary' | 'continuous'
export type BinaryTaskCategory = 'pass' | 'split' | 'fail'
export type ContinuousTaskCategory = 'excellent' | 'good' | 'general' | 'low'
export type TaskCategory = BinaryTaskCategory | ContinuousTaskCategory
/** What a view can filter by: `'all'` plus either mode's category vocabulary. */
export type TaskFilter = 'all' | TaskCategory

export interface EnrichedTaskRow<C extends TaskCategory = TaskCategory> {
  row: TaskRow
  category: C
}

export interface BinaryTaskDiagnostics {
  mode: 'binary'
  /** All rows sorted (rate ascending, then taskId): the unfiltered view. */
  rows: ReadonlyArray<EnrichedTaskRow<BinaryTaskCategory>>
  /** Per-category counts in aggregate-bar order — every category present, zeros included. */
  counts: ReadonlyArray<{ category: BinaryTaskCategory; count: number }>
  /** Precomputed filter views (same sort as `rows`) for O(1) selection. */
  byCategory: Readonly<Record<BinaryTaskCategory, ReadonlyArray<EnrichedTaskRow<BinaryTaskCategory>>>>
  /** Mean rate over all rows (0 when empty). */
  average: number
  /** Summary text inputs; `rate` is the rounded pass percentage. */
  summary: { passed: number; total: number; rate: number }
}

export interface ContinuousTaskDiagnostics {
  mode: 'continuous'
  rows: ReadonlyArray<EnrichedTaskRow<ContinuousTaskCategory>>
  counts: ReadonlyArray<{ category: ContinuousTaskCategory; count: number }>
  byCategory: Readonly<Record<ContinuousTaskCategory, ReadonlyArray<EnrichedTaskRow<ContinuousTaskCategory>>>>
  average: number
  /** Summary text inputs; `rate` is the rounded mean percentage. */
  summary: { rate: number }
}

export type TaskDiagnostics = BinaryTaskDiagnostics | ContinuousTaskDiagnostics

const BINARY_CATEGORIES: ReadonlyArray<BinaryTaskCategory> = ['pass', 'split', 'fail']
const CONTINUOUS_CATEGORIES: ReadonlyArray<ContinuousTaskCategory> = ['excellent', 'good', 'general', 'low']

/**
 * Channel-kind dispatch: DeepSWE (or an explicit binary-majority scoring
 * mode) classifies by majority vote; everything else — including unknown
 * future scoring modes — classifies on the continuous rate bands.
 */
export function taskMode(benchmark: string, scoringMode?: string): TaskMode {
  return benchmark === 'deep-swe' || scoringMode === 'binary-majority' ? 'binary' : 'continuous'
}

function classifyBinary(row: TaskRow): BinaryTaskCategory {
  const [, rate, majorityPassed] = row
  // Majority vote wins over the rate; legacy rows without the flag infer it
  // from a two-thirds rate.
  if (majorityPassed === true || (majorityPassed === undefined && rate >= 2 / 3)) return 'pass'
  if (rate > 0) return 'split'
  return 'fail'
}

function classifyContinuous(row: TaskRow): ContinuousTaskCategory {
  const rate = row[1]
  if (rate >= 0.75) return 'excellent'
  if (rate >= 0.5) return 'good'
  if (rate >= 0.25) return 'general'
  return 'low'
}

/** Bars render lowest rate first, ties by task id. */
const ascending = (a: EnrichedTaskRow, b: EnrichedTaskRow): number =>
  a.row[1] - b.row[1] || a.row[0].localeCompare(b.row[0])

interface Scan<C extends TaskCategory> {
  items: Array<EnrichedTaskRow<C>>
  buckets: Map<C, Array<EnrichedTaskRow<C>>>
  countOf: Map<C, number>
  average: number
}

/** One classification scan (count + sum), one sort, one partition pass — buckets carved from the sorted list inherit its order. */
function scan<C extends TaskCategory>(rows: readonly TaskRow[], classify: (row: TaskRow) => C): Scan<C> {
  const items: Array<EnrichedTaskRow<C>> = []
  const countOf = new Map<C, number>()
  let sum = 0
  for (const row of rows) {
    const category = classify(row)
    items.push({ row, category })
    countOf.set(category, (countOf.get(category) ?? 0) + 1)
    sum += row[1]
  }
  items.sort(ascending)
  const buckets = new Map<C, Array<EnrichedTaskRow<C>>>()
  for (const item of items) {
    const bucket = buckets.get(item.category)
    if (bucket === undefined) buckets.set(item.category, [item])
    else bucket.push(item)
  }
  return { items, buckets, countOf, average: rows.length === 0 ? 0 : sum / rows.length }
}

/** One mode's ordered result shape: every category present (zeros included), buckets and counts aligned. */
function legend<C extends TaskCategory>(
  categories: readonly C[],
  buckets: Map<C, Array<EnrichedTaskRow<C>>>,
  countOf: Map<C, number>,
): { byCategory: Record<C, ReadonlyArray<EnrichedTaskRow<C>>>; counts: Array<{ category: C; count: number }> } {
  const byCategory = {} as Record<C, ReadonlyArray<EnrichedTaskRow<C>>>
  const counts: Array<{ category: C; count: number }> = []
  for (const category of categories) {
    byCategory[category] = buckets.get(category) ?? []
    counts.push({ category, count: countOf.get(category) ?? 0 })
  }
  return { byCategory, counts }
}

export function diagnoseTasks(rows: readonly TaskRow[], mode: 'binary'): BinaryTaskDiagnostics
export function diagnoseTasks(rows: readonly TaskRow[], mode: 'continuous'): ContinuousTaskDiagnostics
export function diagnoseTasks(rows: readonly TaskRow[], mode: TaskMode): TaskDiagnostics {
  if (mode === 'binary') {
    const { items, buckets, countOf, average } = scan(rows, classifyBinary)
    const { byCategory, counts } = legend(BINARY_CATEGORIES, buckets, countOf)
    const passed = countOf.get('pass') ?? 0
    return {
      mode: 'binary',
      rows: items,
      counts,
      byCategory,
      average,
      summary: { passed, total: rows.length, rate: Math.round((passed / Math.max(1, rows.length)) * 100) },
    }
  }
  const { items, buckets, countOf, average } = scan(rows, classifyContinuous)
  const { byCategory, counts } = legend(CONTINUOUS_CATEGORIES, buckets, countOf)
  return {
    mode: 'continuous',
    rows: items,
    counts,
    byCategory,
    average,
    summary: { rate: Math.round(average * 100) },
  }
}

/**
 * O(1) filter-view selection. A filter from the other mode's vocabulary is
 * tolerated as `'all'` — a transient state, since views reset the filter
 * when the mode changes.
 */
export function visibleOf(diagnostics: TaskDiagnostics, filter: TaskFilter): ReadonlyArray<EnrichedTaskRow> {
  if (filter === 'all') return diagnostics.rows
  const buckets = diagnostics.byCategory as Readonly<Partial<Record<TaskFilter, ReadonlyArray<EnrichedTaskRow>>>>
  return buckets[filter] ?? diagnostics.rows
}
