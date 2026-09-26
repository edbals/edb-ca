import type { MarketSnapshot } from './types'

export type StatusTone = 'fresh' | 'closed' | 'stale'

export interface MarketStatus {
  tone: StatusTone
  /** Short label for the section heading, e.g. "Markets closed". */
  label: string
  /** The newest observation date across every source, formatted. */
  asOf?: string
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const SATURDAY = 6
const SUNDAY = 0

/** A published date is a calendar date, so it must be read in local time.
 *  `new Date('2026-08-31')` is UTC midnight, which is the 30th in Vancouver. */
function parseObservation(value: string): Date | null {
  const parsed = new Date(DATE_ONLY.test(value) ? `${value}T00:00:00` : value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatShort(date: Date): string {
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/**
 * Describes how current the panel actually is.
 *
 * The old indicator said "Live" unconditionally, which was wrong twice over:
 * these are end-of-day published observations rather than intraday quotes, and
 * on a weekend the newest of them is two days old. Rather than claim an
 * exchange state this reports what can actually be verified — how fresh the
 * newest observation on the panel is — and names the weekend explicitly,
 * because that is the case where a reader is most likely to think the page has
 * broken.
 */
export function marketStatus(snapshot: MarketSnapshot, now = new Date()): MarketStatus {
  const observed = snapshot.groups
    .map((group) => group.asOf)
    .filter((value): value is string => Boolean(value))
    .map(parseObservation)
    .filter((date): date is Date => date !== null)

  const newest = observed.reduce<Date | null>(
    (latest, date) => (latest === null || date > latest ? date : latest),
    null,
  )

  const asOf = newest ? formatShort(newest) : undefined
  const day = now.getDay()
  const isWeekend = day === SATURDAY || day === SUNDAY

  if (isWeekend) {
    return { tone: 'closed', label: 'Markets closed', asOf }
  }

  if (newest && isSameDay(newest, now)) {
    return { tone: 'fresh', label: 'Updated today', asOf }
  }

  // A weekday with nothing from today is normal early in the morning, before
  // the day's rates are published — and is also what a public holiday looks
  // like. Both are honestly described by naming the date rather than guessing.
  return { tone: 'stale', label: asOf ? `Last updated ${asOf}` : 'Awaiting data', asOf }
}
