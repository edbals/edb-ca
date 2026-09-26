import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'U.S. Treasury'
const SOURCE_URL = 'https://fiscaldata.treasury.gov'

/**
 * Average interest rates on outstanding marketable debt. This is a monthly
 * series, not a live yield curve, so the rows carry a "monthly" cadence marker
 * instead of a daily change that would be meaningless here.
 */
const ENDPOINT =
  'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/' +
  'avg_interest_rates?sort=-record_date&page%5Bsize%5D=40&format=json' +
  '&filter=security_type_desc:eq:Marketable'

const WANTED = [
  { securityDesc: 'Treasury Bills', id: 'ust-bills', label: 'Bills' },
  { securityDesc: 'Treasury Notes', id: 'ust-notes', label: 'Notes' },
  { securityDesc: 'Treasury Bonds', id: 'ust-bonds', label: 'Bonds' },
] as const

interface TreasuryRow {
  record_date?: string
  security_desc?: string
  avg_interest_rate_amt?: string
}

interface TreasuryResponse {
  data?: readonly TreasuryRow[]
}

export async function fetchTreasuryRates(): Promise<MarketGroup> {
  const response = await fetchMarketJson<TreasuryResponse>(SOURCE, ENDPOINT)
  const rows = response.data

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new MarketSourceError(SOURCE, 'no rows returned')
  }

  // Sorted newest-first by the request, so the first match per security is the
  // latest published month.
  const latestDate = rows[0]?.record_date

  const quotes = WANTED.map(({ securityDesc, id, label }): MarketQuote | null => {
    const row = rows.find((candidate) => candidate.security_desc === securityDesc)
    const rate = Number(row?.avg_interest_rate_amt)
    if (!Number.isFinite(rate)) return null

    return {
      id,
      label,
      value: `${rate.toFixed(3)}%`,
      direction: 'flat',
      cadence: 'monthly',
    }
  }).filter((quote): quote is MarketQuote => quote !== null)

  if (quotes.length === 0) {
    throw new MarketSourceError(SOURCE, 'none of the requested securities were present')
  }

  return {
    id: 'treasury',
    title: 'U.S. Treasury — average rates',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    asOf: latestDate,
    layout: 'rows',
    quotes,
  }
}
