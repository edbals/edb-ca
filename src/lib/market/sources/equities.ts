import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import { directionOf, formatNumber } from '../format'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'Twelve Data'
const SOURCE_URL = 'https://twelvedata.com'

/**
 * The only group behind an API key. Everything else on the tape comes from an
 * open, keyless, official source; broad equity index data does not exist on
 * those terms, so indices are opt-in.
 *
 * Set TWELVEDATA_API_KEY (their free tier is enough) and this group appears.
 * Leave it unset and the panel says indices are available rather than
 * pretending the section does not exist.
 *
 * ETF proxies rather than the indices themselves: SPY, QQQ and DIA are
 * available on the free plan where ^GSPC and ^IXIC are not.
 */
const SYMBOLS = [
  { symbol: 'SPY', label: 'S&P 500 (SPY)' },
  { symbol: 'QQQ', label: 'Nasdaq 100 (QQQ)' },
  { symbol: 'DIA', label: 'Dow 30 (DIA)' },
] as const

interface TwelveDataQuote {
  symbol?: string
  close?: string
  percent_change?: string
  datetime?: string
  status?: string
  code?: number
  message?: string
}

/** A single symbol returns a bare object; several return a map keyed by symbol. */
type TwelveDataResponse = TwelveDataQuote | Record<string, TwelveDataQuote | undefined>

export function isEquitiesConfigured(): boolean {
  return Boolean(process.env.TWELVEDATA_API_KEY)
}

function rowsFrom(response: TwelveDataResponse): Map<string, TwelveDataQuote> {
  const rows = new Map<string, TwelveDataQuote>()

  // A plan or quota error comes back as a flat object with a code, not as a
  // per-symbol map, so it must not be read as a quote.
  if (typeof (response as TwelveDataQuote).code === 'number') {
    const failure = response as TwelveDataQuote
    throw new MarketSourceError(SOURCE, failure.message ?? `responded code ${failure.code}`)
  }

  for (const [key, value] of Object.entries(response as Record<string, TwelveDataQuote>)) {
    if (value && typeof value === 'object') rows.set(key, value)
  }

  return rows
}

export async function fetchEquityIndices(): Promise<MarketGroup> {
  const apiKey = process.env.TWELVEDATA_API_KEY
  if (!apiKey) {
    throw new MarketSourceError(SOURCE, 'TWELVEDATA_API_KEY is not set')
  }

  const symbols = SYMBOLS.map((entry) => entry.symbol).join(',')
  const endpoint = `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${apiKey}`
  const rows = rowsFrom(await fetchMarketJson<TwelveDataResponse>(SOURCE, endpoint))

  let asOf: string | undefined

  const quotes = SYMBOLS.map(({ symbol, label }): MarketQuote | null => {
    const row = rows.get(symbol)
    const close = Number(row?.close)
    if (!Number.isFinite(close)) return null

    asOf ??= row?.datetime
    const percentChange = Number(row?.percent_change)

    if (!Number.isFinite(percentChange)) {
      return { id: symbol.toLowerCase(), label, value: formatNumber(close, 2), direction: 'flat' }
    }

    return {
      id: symbol.toLowerCase(),
      label,
      value: formatNumber(close, 2),
      change: `${Math.abs(percentChange).toFixed(2)}%`,
      direction: directionOf(percentChange),
    }
  }).filter((quote): quote is MarketQuote => quote !== null)

  if (quotes.length === 0) {
    throw new MarketSourceError(SOURCE, 'no quotes returned for the requested symbols')
  }

  return {
    id: 'equities',
    title: 'Equity indices',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    asOf,
    layout: 'rows',
    quotes,
  }
}
