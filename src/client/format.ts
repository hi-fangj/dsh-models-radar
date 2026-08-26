/** Shared number formatters used by the settings section and the capability popover. */

/** Format a pass rate in [0,1] as a whole percent. */
export function pctText(rate: number): string {
  return `${Math.round(rate * 100)}%`
}

/** Format a USD cost, or an em dash when unpublished. */
export function moneyText(value: number | null): string {
  return value === null ? '—' : `$${value.toFixed(2)}`
}

/** Format average run minutes, or an em dash when unpublished. */
export function minutesText(value: number | null): string {
  return value === null ? '—' : `${value.toFixed(1)} min`
}
