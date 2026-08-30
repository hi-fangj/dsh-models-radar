/**
 * RadarDataStore interface tests (scripts/test-radar-store.mjs).
 *
 * Every scenario goes through the one external seam — store.get() — with
 * fakes for the three ports (upstream / snapshots / clock). No HTTP, no real
 * disk, no real time. These map the architecture review's verification bar:
 *
 * 1. concurrent same-channel requests produce exactly one set of upstream calls
 * 2. a manual refresh (bypass) still joins in-flight fetches
 * 3. upstream failure still serves data: memory → snapshot → 502-shaped failure
 * 4. snapshot commits serialize per channel in assembly order and the live
 *    response waits for its own commit (disk never regresses behind memory)
 * 5. wholesale fast path / cold-start snapshot serve / snapshot re-windowing
 *    cost zero upstream, and a snapshot serve never backfills the dataset cache
 * 6. bypass ignores freshness windows (forces a full refetch)
 * 7. layered windows: only the expired datasets are refetched (ADR 0002)
 * 8. loose schema tolerance: a benign site-side change cannot break assembly
 */
import assert from 'node:assert/strict'
import { createRadarDataStore } from '../src/store.ts'

/** Deterministic clock: tests place dataset moments inside/outside windows. */
const fakeClock = (start = 1_000_000) => {
  let now = start
  return {
    now: () => now,
    advance: (ms) => {
      now += ms
    },
  }
}

const payloadFor = (kind) => {
  switch (kind) {
    case 'benchmarks':
      return { benchmarks: [{ id: 'deep-swe', title: 'DeepSWE', score_label: 'Pass rate', default: true }] }
    case 'eff':
      return {
        points: [
          {
            model: 'm1',
            effort: 'high',
            iq: 90,
            average_price_usd: 2,
            average_minutes: 10,
            cache_hit_rate: 0.5,
            token_samples: 8,
            passed: 8,
            total: 10,
            runs_24h: 3,
          },
        ],
        scoring_mode: 'binary-majority',
        score_label: 'Pass rate',
      }
    case 'hist':
      // Keyed by base model: exercises the exact-tier → base-model series fallback.
      return { m1: [{ ts: '2026-08-28T00:00:00Z', score: 88 }] }
    case 'lb':
      return { models: [{ model: 'm1', effort: 'high', tasks: { t1: { majority_pass: true, score_rate: 0.9 } } }] }
    default:
      throw new Error(`unexpected kind ${kind}`)
  }
}

/**
 * Raw community-ratings payload (the main-site shape): entries carry dotted
 * tier ids, plus junk rows that normalization must tolerate.
 */
const ratingsPayload = () => ({
  ok: true,
  updated_at: '2026-08-29T14:15:39.742Z',
  models: [
    { id: 'gpt-5.6-sol-ultra', average: 6.8, count: 126 },
    { id: 'gpt-5.6-sol-max', average: 7.3, count: 123 },
    { id: 'gpt-5.5-xhigh', average: 6.7, count: 22 },
    { id: 'junk-entry', average: 5, count: 1 },
    { average: 3, count: 1 },
  ],
})

/**
 * Fake upstream: records every fetch (as `kind:benchmark`), can hold all
 * fetches behind a gate until releaseAll(), and can fail every fetch until
 * clearFailure() — enough to interleave requests deterministically.
 */
const fakeUpstream = ({ gated = true } = {}) => {
  const calls = []
  const pending = []
  let failure = null
  let ratings = ratingsPayload()
  return {
    calls,
    failWith: (message) => {
      failure = message
    },
    clearFailure: () => {
      failure = null
    },
    releaseAll: () => {
      for (const resolve of pending.splice(0)) resolve()
    },
    setRatingsPayload: (next) => {
      ratings = next
    },
    async fetchDataset(kind, benchmark) {
      calls.push(`${kind}:${benchmark}`)
      if (failure !== null) throw new Error(failure)
      if (gated) await new Promise((resolve) => pending.push(resolve))
      return payloadFor(kind)
    },
    async fetchRatings(window) {
      calls.push(`ratings:${window}`)
      if (failure !== null) throw new Error(failure)
      if (gated) await new Promise((resolve) => pending.push(resolve))
      return ratings
    },
  }
}

/** In-memory snapshot stand-in: read/commit plus commit-gate and failure hooks for ordering tests. */
const fakeSnapshots = () => {
  const store = new Map()
  const ratingsStore = new Map()
  const commitsLog = []
  let blocked = null
  let failingCommits = 0
  const gate = async () => {
    if (failingCommits > 0) {
      failingCommits--
      throw new Error('disk full')
    }
    if (blocked !== null) await new Promise((resolve) => blocked.push(resolve))
  }
  return {
    store,
    ratingsStore,
    commitsLog,
    async read(benchmark) {
      return store.get(benchmark)
    },
    async commit(benchmark, view, timelineLine) {
      await gate()
      store.set(benchmark, view)
      commitsLog.push({ benchmark, fetchedAt: view.fetchedAt, defaultModel: view.defaultModel, timelineLine })
    },
    async readRatings(window) {
      return ratingsStore.get(window)
    },
    async commitRatings(window, ratings) {
      await gate()
      ratingsStore.set(window, ratings)
      commitsLog.push({ window, fetchedAt: ratings.fetchedAt })
    },
    blockCommits: () => {
      blocked = []
    },
    releaseCommits: () => {
      if (blocked === null) return
      for (const resolve of blocked.splice(0)) resolve()
      blocked = null
    },
    failNextCommits: (n) => {
      failingCommits = n
    },
  }
}

const savedView = (fetchedAt, benchmark = 'deep-swe') => ({
  benchmark,
  scoreLabel: 'Pass rate',
  fetchedAt,
  channels: [{ id: benchmark, title: benchmark, scoreLabel: 'Pass rate', isDefault: true }],
  tiers: [],
  taskRates: {},
  series: {},
})

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const tests = []
const test = (label, fn) => tests.push([label, fn])

test('并发同频道请求只产生一组上游请求（single-flight）', async () => {
  const upstream = fakeUpstream()
  const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
  const first = store.get({ benchmark: 'deep-swe', bypass: true, defaultModel: { provider: 'p', model: 'm1' } })
  const second = store.get({ benchmark: 'deep-swe', bypass: true })
  upstream.releaseAll()
  const [a, b] = await Promise.all([first, second])
  assert.deepEqual(
    [...upstream.calls].sort(),
    ['benchmarks:deep-swe', 'eff:deep-swe', 'hist:deep-swe', 'lb:deep-swe'],
  )
  assert.ok(a.ok && b.ok)
  // Joiners count the shared upstream work (preserved semantics): both non-throttled.
  assert.equal(a.throttled, undefined)
  assert.equal(b.throttled, undefined)
  // Same assembled content for both; each request carries its own defaultModel.
  assert.deepEqual(a.data.tiers, b.data.tiers)
  assert.deepEqual(a.data.defaultModel, { provider: 'p', model: 'm1' })
  assert.equal(b.data.defaultModel, undefined)
  // Series attach via the exact-tier → base-model fallback; task rows carry majority vote.
  assert.deepEqual(a.data.series['m1@high'], [['2026-08-28T00:00:00Z', 88]])
  assert.deepEqual(a.data.taskRates['m1@high'], [['t1', 0.9, true]])
  // Cost sample count flows through for the site-format tooltip.
  assert.equal(a.data.tiers[0].tokenSamples, 8)
})

test('bypass 仍并入 in-flight（手动刷新不重复打上游）', async () => {
  const upstream = fakeUpstream()
  const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
  const normal = store.get({ benchmark: 'deep-swe', bypass: false })
  const manual = store.get({ benchmark: 'deep-swe', bypass: true })
  upstream.releaseAll()
  const [a, b] = await Promise.all([normal, manual])
  assert.equal(upstream.calls.length, 4)
  assert.ok(a.ok && b.ok)
  // Starter and bypass joiner alike report non-throttled (upstream work happened).
  assert.equal(a.throttled, undefined)
  assert.equal(b.throttled, undefined)
})

test('上游失败兜底：内存视图 → 磁盘快照 → 502', async () => {
  // (a) memory fallback after a prior success
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
    const good = await store.get({ benchmark: 'deep-swe', bypass: true })
    assert.ok(good.ok)
    upstream.failWith('upstream 500')
    clock.advance(16 * 60_000) // leave every window so the next request must go live
    const fallback = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(fallback.ok, true)
    assert.equal(fallback.fresh, false)
    assert.equal(fallback.stale, true)
    assert.equal(fallback.notice, 'upstream 500')
    assert.equal(fallback.fetchedAt, good.fetchedAt)
    assert.equal(fallback.data, good.data)
  }
  // (b) cold start with only a disk snapshot — the failure fallback ignores windows
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const snapshots = fakeSnapshots()
    const saved = savedView(new Date(clock.now() - 60 * 60_000).toISOString())
    snapshots.store.set('deep-swe', saved)
    const store = createRadarDataStore(upstream, snapshots, clock)
    upstream.failWith('upstream 500')
    const fallback = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(fallback.ok, true)
    assert.equal(fallback.stale, true)
    assert.equal(fallback.data, saved)
  }
  // (c) nothing anywhere → the RadarFailure the route maps to 502
  {
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
    upstream.failWith('upstream 500')
    const failure = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(failure.ok, false)
    assert.equal(failure.error, 'upstream 500')
  }
})

test('快照提交按成功组装顺序串行，响应等待自己的提交', async () => {
  const upstream = fakeUpstream()
  const snapshots = fakeSnapshots()
  const store = createRadarDataStore(upstream, snapshots, fakeClock())
  snapshots.blockCommits()
  const first = store.get({ benchmark: 'deep-swe', bypass: true, defaultModel: { provider: 'p', model: 'm1' } })
  const second = store.get({ benchmark: 'deep-swe', bypass: true, defaultModel: { provider: 'p', model: 'm2' } })
  upstream.releaseAll()
  // Neither live-refresh response resolves while its commit is blocked.
  assert.equal(
    await Promise.race([first.then(() => 'resolved'), second.then(() => 'resolved'), delay(15).then(() => 'blocked')]),
    'blocked',
  )
  snapshots.releaseCommits()
  await Promise.all([first, second])
  // Commits observed in assembly order, not response-arrival order.
  assert.deepEqual(
    snapshots.commitsLog.map((entry) => entry.defaultModel?.model),
    ['m1', 'm2'],
  )
  // Same IQ content → the timeline line is appended exactly once.
  assert.ok(snapshots.commitsLog[0].timelineLine !== undefined)
  assert.equal(snapshots.commitsLog[1].timelineLine, undefined)
  // The snapshot store ends at the newest assembly.
  assert.equal(snapshots.store.get('deep-swe').defaultModel?.model, 'm2')
})

test('提交失败不失败响应，下次成功重试追加 timeline', async () => {
  const upstream = fakeUpstream({ gated: false })
  const snapshots = fakeSnapshots()
  const store = createRadarDataStore(upstream, snapshots, fakeClock())
  snapshots.failNextCommits(1)
  const first = await store.get({ benchmark: 'deep-swe', bypass: true })
  // An upstream-successful assembly is never turned into a false failure...
  assert.ok(first.ok && first.fresh)
  assert.equal(first.throttled, undefined)
  // ...and the failed commit left nothing durable behind.
  assert.equal(snapshots.commitsLog.length, 0)
  // Next success retries: the hash was never recorded, so the timeline line
  // is appended now instead of being lost with the failed write.
  const second = await store.get({ benchmark: 'deep-swe', bypass: true })
  assert.ok(second.ok)
  assert.equal(snapshots.commitsLog.length, 1)
  assert.ok(snapshots.commitsLog[0].timelineLine !== undefined)
})

test('快路径：窗口内零上游、冷启动读盘、快照视图再窗口化', async () => {
  // Wholesale fast path: within all windows → zero upstream, throttled.
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
    const first = await store.get({ benchmark: 'deep-swe', bypass: true })
    assert.equal(upstream.calls.length, 4)
    clock.advance(10 * 60_000)
    const second = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(upstream.calls.length, 4)
    assert.ok(second.ok && second.fresh && second.throttled)
    assert.equal(second.data, first.data)
  }
  // Cold start: a persisted snapshot within its window serves wholesale, and a
  // snapshot serve never populates the per-dataset cache.
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const snapshots = fakeSnapshots()
    const saved = savedView(new Date(clock.now() - 5 * 60_000).toISOString())
    snapshots.store.set('deep-swe', saved)
    const store = createRadarDataStore(upstream, snapshots, clock)
    const served = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(upstream.calls.length, 0)
    assert.ok(served.ok && served.fresh && served.throttled)
    assert.equal(served.fetchedAt, saved.fetchedAt)
    // Re-window: a snapshot-served view keeps serving within the window.
    clock.advance(5 * 60_000)
    const again = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(upstream.calls.length, 0)
    assert.ok(again.ok && again.throttled)
    assert.equal(again.fetchedAt, saved.fetchedAt)
    // Past the window the next request goes live — proof the snapshot serve
    // did not backfill the dataset cache.
    clock.advance(16 * 60_000)
    const live = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(upstream.calls.length, 4)
    assert.ok(live.ok)
  }
  // A persisted snapshot older than its window does not serve cold.
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const snapshots = fakeSnapshots()
    snapshots.store.set('deep-swe', savedView(new Date(clock.now() - 16 * 60_000).toISOString()))
    const store = createRadarDataStore(upstream, snapshots, clock)
    const live = await store.get({ benchmark: 'deep-swe', bypass: false })
    assert.equal(upstream.calls.length, 4)
    assert.ok(live.ok && live.fresh && live.throttled === undefined)
  }
})

test('bypass 绕过新鲜窗口强制全量重拉', async () => {
  const clock = fakeClock()
  const upstream = fakeUpstream({ gated: false })
  const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
  await store.get({ benchmark: 'deep-swe', bypass: true })
  clock.advance(1_000) // still deep inside every window
  const manual = await store.get({ benchmark: 'deep-swe', bypass: true })
  assert.equal(upstream.calls.length, 8)
  assert.ok(manual.ok && manual.throttled === undefined)
})

test('分层窗口：只有过期的数据集被重拉（mixed assembly）', async () => {
  const clock = fakeClock()
  const upstream = fakeUpstream({ gated: false })
  const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
  const first = await store.get({ benchmark: 'deep-swe', bypass: true })
  clock.advance(16 * 60_000) // eff + lb (15min) stale; benchmarks + hist (60min) fresh
  const mixed = await store.get({ benchmark: 'deep-swe', bypass: false })
  assert.deepEqual(upstream.calls.slice(4), ['eff:deep-swe', 'lb:deep-swe'])
  assert.ok(mixed.ok && mixed.fresh)
  assert.equal(mixed.throttled, undefined) // this request did hit upstream
  // fetchedAt honestly reports the oldest dataset moment (still the first fetch).
  assert.equal(mixed.fetchedAt, first.fetchedAt)
})

test('schema 容错：良性站点侧变更不弄崩视图组装', async () => {
  const upstream = {
    async fetchDataset(kind) {
      switch (kind) {
        case 'benchmarks':
          return { benchmarks: [{ id: 'deep-swe' }, { title: 'no id' }, 42] }
        case 'eff':
          return {
            points: [
              { model: 'm1', effort: 'high' },
              { model: 'm2', effort: 'xhigh', iq: 80, total: 0 },
              'junk',
            ],
          }
        case 'hist':
          return { unexpected: 'shape' }
        case 'lb':
          // Missing effort → the model is skipped entirely.
          return { models: [{ model: 'm1', tasks: { t1: { majority_pass: true } } }] }
        default:
          return {}
      }
    },
    async fetchRatings() {
      return {}
    },
  }
  const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
  const response = await store.get({ benchmark: 'deep-swe', bypass: true })
  assert.ok(response.ok)
  // Only the id-carrying benchmark survives; missing title falls back to id.
  assert.equal(response.data.channels.length, 1)
  assert.equal(response.data.channels[0].title, 'deep-swe')
  assert.equal(response.data.tiers.length, 2)
  assert.equal(response.data.tiers[0].key, 'm2@xhigh') // sorted by iq desc
  assert.equal(response.data.tiers[0].iq, 80)
  assert.equal(response.data.tiers[0].passRate, null) // total 0 → null, not NaN
  assert.equal(response.data.tiers[1].iq, 0) // missing iq tolerated as 0
  assert.equal(response.data.tiers[1].avgPrice, null)
  assert.deepEqual(response.data.taskRates, {})
  assert.deepEqual(response.data.series, {}) // unexpected history shape → no series
})

// ---------------------------------------------------------------------------
// Community ratings (社区体感分): global datasets, one per window.
// ---------------------------------------------------------------------------

test('ratings 归一化：dotted id → 档位键，junk 行跳过', async () => {
  const upstream = fakeUpstream({ gated: false })
  const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
  const response = await store.getRatings({ window: '7d', bypass: true })
  assert.ok(response.ok && response.fresh)
  assert.equal(response.data.window, '7d')
  assert.equal(response.data.updatedAt, '2026-08-29T14:15:39.742Z')
  assert.deepEqual(
    response.data.tiers.map((tier) => [tier.key, tier.average, tier.count]),
    [
      ['gpt-5.6-sol@ultra', 6.8, 126],
      ['gpt-5.6-sol@max', 7.3, 123],
      ['gpt-5.5@xhigh', 6.7, 22],
    ],
  )
})

test('ratings 单飞行 + 新鲜窗口：并发一次拉取、窗口内零上游', async () => {
  const clock = fakeClock()
  const upstream = fakeUpstream()
  const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
  const first = store.getRatings({ window: '24h', bypass: true })
  const second = store.getRatings({ window: '24h', bypass: true })
  upstream.releaseAll()
  const [a, b] = await Promise.all([first, second])
  assert.deepEqual(upstream.calls, ['ratings:24h'])
  assert.ok(a.ok && b.ok)
  assert.equal(a.throttled, undefined) // this request did the upstream work
  assert.equal(b.throttled, undefined) // joiners share it (preserved semantics)
  // Windows are independent datasets: 7d is a separate fetch.
  const otherPending = store.getRatings({ window: '7d', bypass: true })
  upstream.releaseAll()
  const other = await otherPending
  assert.deepEqual(upstream.calls, ['ratings:24h', 'ratings:7d'])
  assert.ok(other.ok && other.data.window === '7d')
  // Back to 24h inside its window → wholesale serve, zero upstream.
  clock.advance(10 * 60_000)
  const cached = await store.getRatings({ window: '24h', bypass: false })
  assert.deepEqual(upstream.calls, ['ratings:24h', 'ratings:7d'])
  assert.ok(cached.ok && cached.throttled)
  assert.equal(cached.data, a.data)
})

test('ratings 失败兜底：内存 → 磁盘快照 → 失败响应；bypass 强制重拉', async () => {
  // (a) memory fallback after a prior success
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
    const good = await store.getRatings({ window: '7d', bypass: true })
    assert.ok(good.ok)
    upstream.failWith('ratings upstream 500')
    clock.advance(16 * 60_000)
    const fallback = await store.getRatings({ window: '7d', bypass: false })
    assert.equal(fallback.ok, true)
    assert.equal(fallback.fresh, false)
    assert.equal(fallback.stale, true)
    assert.equal(fallback.notice, 'ratings upstream 500')
    assert.equal(fallback.data, good.data)
  }
  // (b) cold start with only a disk snapshot; past the window it goes live again
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const snapshots = fakeSnapshots()
    snapshots.ratingsStore.set('24h', {
      window: '24h',
      fetchedAt: new Date(clock.now() - 5 * 60_000).toISOString(),
      tiers: [{ key: 'm1@high', model: 'm1', effort: 'high', average: 6, count: 2 }],
    })
    const store = createRadarDataStore(upstream, snapshots, clock)
    const served = await store.getRatings({ window: '24h', bypass: false })
    assert.equal(upstream.calls.length, 0)
    assert.ok(served.ok && served.throttled)
    clock.advance(16 * 60_000)
    const live = await store.getRatings({ window: '24h', bypass: false })
    assert.deepEqual(upstream.calls, ['ratings:24h'])
    assert.ok(live.ok && live.fresh)
  }
  // (c) nothing anywhere → the failure the route maps to 502
  {
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), fakeClock())
    upstream.failWith('ratings upstream 500')
    const failure = await store.getRatings({ window: '7d', bypass: false })
    assert.equal(failure.ok, false)
    assert.equal(failure.error, 'ratings upstream 500')
  }
  // (d) manual refresh bypasses the window even deep inside it
  {
    const clock = fakeClock()
    const upstream = fakeUpstream({ gated: false })
    const store = createRadarDataStore(upstream, fakeSnapshots(), clock)
    await store.getRatings({ window: '7d', bypass: true })
    clock.advance(1_000)
    const manual = await store.getRatings({ window: '7d', bypass: true })
    assert.deepEqual(upstream.calls, ['ratings:7d', 'ratings:7d'])
    assert.ok(manual.ok && manual.throttled === undefined)
  }
})

test('ratings 快照：成功后落盘、内容不变不重写、提交失败不失败响应', async () => {
  const clock = fakeClock()
  const upstream = fakeUpstream({ gated: false })
  const snapshots = fakeSnapshots()
  const store = createRadarDataStore(upstream, snapshots, clock)
  const first = await store.getRatings({ window: '7d', bypass: true })
  assert.ok(first.ok)
  assert.equal(snapshots.commitsLog.length, 1) // first success persisted
  assert.ok(snapshots.ratingsStore.get('7d'))
  // Cache expired, identical content → the refetch happens but the hash-dedupe
  // skips the snapshot rewrite.
  clock.advance(16 * 60_000)
  const second = await store.getRatings({ window: '7d', bypass: false })
  assert.ok(second.ok && second.throttled === undefined) // this request went live
  assert.deepEqual(second.data.tiers, first.data.tiers) // identical content
  assert.equal(snapshots.commitsLog.length, 1)
  // A failed commit is diagnostic: the response still succeeds...
  clock.advance(16 * 60_000)
  upstream.setRatingsPayload({
    ...ratingsPayload(),
    models: [...ratingsPayload().models, { id: 'gpt-5.5-high', average: 5.8, count: 17 }],
  })
  snapshots.failNextCommits(1)
  const third = await store.getRatings({ window: '7d', bypass: true })
  assert.ok(third.ok && third.fresh)
  assert.equal(snapshots.commitsLog.length, 1) // the failed write left nothing
  // ...and the next success retries the snapshot with the new content (the
  // hash was never recorded by the failed attempt).
  const fourth = await store.getRatings({ window: '7d', bypass: true })
  assert.ok(fourth.ok)
  assert.equal(snapshots.commitsLog.length, 2)
  assert.equal(snapshots.ratingsStore.get('7d').tiers.length, 4)
})

for (const [label, fn] of tests) {
  try {
    await fn()
    console.log(`ok - ${label}`)
  } catch (error) {
    console.error(`fail - ${label}`)
    throw error
  }
}

console.log('radarDataStore tests passed')
