import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import { directionOf, formatNumber } from '../format'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'CoinGecko'
const SOURCE_URL = 'https://www.coingecko.com'

/** Quoted to whole dollars above this level; cents stop carrying information. */
const WHOLE_DOLLAR_THRESHOLD = 1000

const COINS = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ether' },
] as const

const ENDPOINT =
  `https://api.coingecko.com/api/v3/simple/price?ids=${COINS.map((c) => c.id).join(',')}` +
  `&vs_currencies=usd&include_24hr_change=true`

type CoinGeckoResponse = Record<string, { usd?: number; usd_24h_change?: number } | undefined>

export async function fetchCrypto(): Promise<MarketGroup> {
  const response = await fetchMarketJson<CoinGeckoResponse>(SOURCE, ENDPOINT)

  const quotes = COINS.map(({ id, label }): MarketQuote | null => {
    const entry = response[id]
    const price = entry?.usd
    if (!Number.isFinite(price)) return null

    const decimals = (price as number) >= WHOLE_DOLLAR_THRESHOLD ? 0 : 2
    const change = entry?.usd_24h_change

    if (!Number.isFinite(change)) {
      return { id, label, value: formatNumber(price as number, decimals), direction: 'flat' }
    }

    return {
      id,
      label,
      value: formatNumber(price as number, decimals),
      change: `${Math.abs(change as number).toFixed(2)}%`,
      direction: directionOf(change as number),
    }
  }).filter((quote): quote is MarketQuote => quote !== null)

  if (quotes.length === 0) {
    throw new MarketSourceError(SOURCE, 'no prices returned')
  }

  return {
    id: 'crypto',
    title: 'Digital assets',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    layout: 'rows',
    quotes,
  }
}
