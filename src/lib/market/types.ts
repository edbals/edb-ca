/** Which way a figure moved since its previous published observation. */
export type Direction = 'up' | 'down' | 'flat'

/** How a group's figures are laid out in the tape panel. */
export type GroupLayout = 'rows' | 'inline'

/**
 * One line on the tape. Values arrive pre-formatted: the number of decimals a
 * figure is quoted to is a property of the instrument, not of the renderer, so
 * the source that knows it does the formatting.
 */
export interface MarketQuote {
  id: string
  label: string
  /** Display-ready, e.g. "1.4145" or "3.97%". */
  value: string
  /** Display-ready delta, e.g. "0.06%" or "1 bp". Absent when the source
   *  publishes no comparable prior observation. */
  change?: string
  direction: Direction
  /** Oldest to newest, for the sparkline. Omitted when too short to draw. */
  spark?: readonly number[]
  /** Shown in place of a delta, e.g. "monthly" for figures with no daily move. */
  cadence?: string
}

export interface MarketGroup {
  id: string
  title: string
  /** Attribution is not optional: every figure on the page names its source. */
  source: string
  sourceUrl: string
  /** The latest observation date as published, which is often not today. */
  asOf?: string
  layout: GroupLayout
  quotes: readonly MarketQuote[]
}

export interface MarketSnapshot {
  groups: readonly MarketGroup[]
  /** ISO timestamp of the server-side fetch. */
  fetchedAt: string
  /** Sources that failed, so the page can say so instead of going quiet. */
  failures: readonly string[]
  /** True when the optional equities key is unset, so the panel can say that
   *  indices are available rather than silently omitting them. */
  isEquitiesPending: boolean
  /** The next few US data releases. Empty when FRED_API_KEY is unset. */
  calendar: readonly EconomicRelease[]
}

/** One upcoming data release on the economic calendar. */
export interface EconomicRelease {
  id: string
  /** ISO date, e.g. "2026-10-14". */
  date: string
  name: string
}
