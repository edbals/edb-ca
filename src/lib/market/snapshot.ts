import { fetchBankOfCanada } from './sources/bank-of-canada'
import { fetchCrypto } from './sources/coingecko'
import { fetchEcbRates } from './sources/ecb'
import { fetchEquityIndices, isEquitiesConfigured } from './sources/equities'
import { fetchEconomicCalendar, isCalendarConfigured } from './sources/fred-calendar'
import { fetchTreasuryRates } from './sources/treasury'
import type { EconomicRelease, MarketGroup, MarketSnapshot } from './types'

export { MARKET_REVALIDATE_SECONDS } from './fetch-json'

/** Panel order, chosen so the reader moves from local to global to speculative. */
const SOURCES = [
  { name: 'Bank of Canada', load: fetchBankOfCanada },
  { name: 'European Central Bank', load: fetchEcbRates },
  { name: 'U.S. Treasury', load: fetchTreasuryRates },
  { name: 'CoinGecko', load: fetchCrypto },
] as const

/**
 * Collects every source into one snapshot.
 *
 * Sources are independent and fetched together, and one failing must not cost
 * the reader the other three: `allSettled` keeps whatever resolved and records
 * the rest by name so the panel can state plainly which feed is down. A
 * snapshot with no groups at all is still a valid snapshot — the component
 * renders the outage instead of throwing the page away.
 */
export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const optional = isEquitiesConfigured()
    ? [{ name: 'Twelve Data', load: fetchEquityIndices } as const]
    : []

  // Equities lead when configured: an index level is the figure a reader
  // looks for first, and burying it under CORRA would be a strange order.
  const sources = [...optional, ...SOURCES]

  // The calendar is fetched alongside the panels rather than after them, and
  // its failure is recorded like any other source: a missing calendar must not
  // cost the reader the figures.
  const [settled, calendarResult] = await Promise.all([
    Promise.allSettled(sources.map((source) => source.load())),
    isCalendarConfigured()
      ? Promise.allSettled([fetchEconomicCalendar()])
      : Promise.resolve([] as PromiseSettledResult<readonly EconomicRelease[]>[]),
  ])

  const groups: MarketGroup[] = []
  const failures: string[] = []

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      groups.push(result.value)
      return
    }

    const { name } = sources[index]
    failures.push(name)
    // Logged server-side with the real cause; the page only ever shows the name.
    console.error(`[market] ${name} failed:`, result.reason)
  })

  let calendar: readonly EconomicRelease[] = []
  const calendarSettled = calendarResult[0]

  if (calendarSettled?.status === 'fulfilled') {
    calendar = calendarSettled.value
  } else if (calendarSettled?.status === 'rejected') {
    failures.push('FRED')
    console.error('[market] FRED calendar failed:', calendarSettled.reason)
  }

  return {
    groups,
    failures,
    calendar,
    fetchedAt: new Date().toISOString(),
    isEquitiesPending: !isEquitiesConfigured(),
  }
}
