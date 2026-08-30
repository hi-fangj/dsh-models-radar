/**
 * Show/hide preference for the composer live capability readout (the
 * SWE IQ capsule and its capability popover), edited from the plugin's card
 * in the Plugins configuration tab. The committed value lives in the Host's
 * `dsh-models-radar` settings namespace and is read/written over the
 * same-origin /model-radar/api/pref routes, so the choice survives browser
 * storage clears and is shared by every browser of the deployment at page
 * load granularity. Same-document propagation (card writes, readout capsule
 * reads, different slot trees, storage events never fire) stays on the custom
 * window event behind the `useSyncExternalStore`-shaped store face.
 *
 * Bootstrap: the first snapshot call lazily seeds from the legacy localStorage
 * key so the current browser keeps its last expressed choice for first paint;
 * initLiveVisible() then converges on the Host value. One-time migration: a
 * legacy key wins over the Host value, is written through, and is removed —
 * a user who hid the capsule never sees it "revive" after the upgrade.
 */

const LEGACY_STORAGE_KEY = 'model-radar:live-visible'
const CHANGE_EVENT = 'dsh-models-radar:live-visible-change'
const PREF_URL = '/model-radar/api/pref'

/** In-memory mirror: avoids a storage read on every snapshot call. */
let cached: boolean | null = null

/** Bumped by every local write; lets init give up if the user moved first. */
let writeSeq = 0

/** One init per document; the promise is the idempotence guard. */
let initOnce: Promise<void> | null = null

const readLegacy = (): boolean | null => {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (raw === null) return null
    return raw !== '0'
  } catch {
    return null // storage unavailable — nothing to migrate
  }
}

const removeLegacy = (): void => {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // ignore: storage unavailable — the migrated Host value still wins next load
  }
}

/** Current preference; first call seeds from the legacy key for first paint. */
export function liveVisible(): boolean {
  if (cached === null) {
    cached = readLegacy() ?? true
  }
  return cached
}

/** Host value, or null when the route is unreachable or malformed. */
async function fetchHostValue(): Promise<boolean | null> {
  try {
    const response = await fetch(PREF_URL)
    const body = (await response.json()) as { ok?: unknown; liveVisible?: unknown }
    return body?.ok === true && typeof body.liveVisible === 'boolean' ? body.liveVisible : null
  } catch {
    return null // display preference — non-critical
  }
}

/** Persist to the Host namespace; failures are swallowed (non-critical pref). */
async function writeHostValue(value: boolean): Promise<void> {
  try {
    await fetch(PREF_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ liveVisible: value }),
    })
  } catch {
    // ignore: offline / route unavailable — the local mirror already shows it
  }
}

function publish(value: boolean): void {
  cached = value
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Converge the local mirror on the Host namespace, migrating the legacy
 * localStorage choice once. Runs at most once per document; never rejects.
 */
export function initLiveVisible(): Promise<void> {
  if (initOnce !== null) return initOnce
  initOnce = (async () => {
    const writesAtStart = writeSeq
    const legacy = readLegacy()
    const host = await fetchHostValue()
    if (host === null) return // Host unreachable — keep the first-paint value
    // A write landed while the fetch was in flight: it already POSTed a newer
    // value, so adopting the (older) Host snapshot would revert the user.
    if (writeSeq !== writesAtStart) return
    if (legacy !== null) {
      if (legacy !== host) await writeHostValue(legacy)
      removeLegacy()
      if (liveVisible() !== legacy) publish(legacy)
      return
    }
    if (liveVisible() !== host) publish(host)
  })()
  return initOnce
}

/**
 * Persist the preference locally, notify same-document listeners, and write
 * through to the Host. Write failures are ignored — a display preference is
 * non-critical.
 */
export function setLiveVisible(visible: boolean): void {
  writeSeq += 1
  publish(visible)
  void writeHostValue(visible)
}

/** Store face shared by the settings card (writer) and the composer readout (reader). */
export const liveVisibleStore = {
  subscribe(listener: () => void): () => void {
    window.addEventListener(CHANGE_EVENT, listener)
    return () => window.removeEventListener(CHANGE_EVENT, listener)
  },
  get: liveVisible,
}
