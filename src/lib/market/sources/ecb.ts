import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import { quoteFromSeries } from '../format'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'European Central Bank'
const SOURCE_URL = 'https://frankfurter.dev'

/** Enough sessions to derive a move and draw a shape, allowing for holidays. */
const WINDOW_DAYS = 60

/**
 * Frankfurter serves the ECB's daily reference rates, quoted per unit of the
 * base. A USD base therefore gives USD/JPY directly, but EUR/USD and GBP/USD
 * are the reciprocals — those pairs are conventionally quoted the other way
 * round, and showing "USD/EUR 0.877" would be technically true and useless.
 */
const PAIRS = [
  { id: 'eur-usd', label: 'EUR/USD', symbol: 'EUR', invert: true, decimals: 4 },
  { id: 'gbp-usd', label: 'GBP/USD', symbol: 'GBP', invert: true, decimals: 4 },
  { id: 'usd-jpy', label: 'USD/JPY', symbol: 'JPY', invert: false, decimals: 2 },
] as const

const SYMBOLS = PAIRS.map((pair) => pair.symbol).join(',')

interface FrankfurterResponse {
  end_date?: string
  rates?: Record<string, Record<string, number> | undefined>
}

function startDate(): string {
  const from = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000)
  return from.toISOString().slice(0, 10)
}

export async function fetchEcbRates(): Promise<MarketGroup> {
  const endpoint = `https://api.frankfurter.dev/v1/${startDate()}..?base=USD&symbols=${SYMBOLS}`
  const response = await fetchMarketJson<FrankfurterResponse>(SOURCE, endpoint)

  const byDate = response.rates
  if (!byDate || Object.keys(byDate).length === 0) {
    throw new MarketSourceError(SOURCE, 'no rates returned')
  }

  // Frankfurter keys its series by date; ordering is not guaranteed.
  const dates = Object.keys(byDate).sort()

  const quotes = PAIRS.map(({ id, label, symbol, invert, decimals }) => {
    const series: number[] = []

    for (const date of dates) {
      const rate = byDate[date]?.[symbol]
      if (!Number.isFinite(rate) || rate === 0) continue
      series.push(invert ? 1 / (rate as number) : (rate as number))
    }

    return quoteFromSeries({ id, label, series, decimals, changeIn: 'percent' })
  }).filter((quote): quote is MarketQuote => quote !== null)

  if (quotes.length === 0) {
    throw new MarketSourceError(SOURCE, 'none of the requested pairs had values')
  }

  return {
    id: 'fx',
    title: 'Foreign exchange',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    asOf: response.end_date ?? dates[dates.length - 1],
    layout: 'rows',
    quotes,
  }
}
