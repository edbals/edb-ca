import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import { quoteFromSeries } from '../format'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'Bank of Canada'
const SOURCE_URL = 'https://www.bankofcanada.ca/valet/docs'

/** Series codes, in the order they should read down the panel. */
const SERIES = {
  usdCad: 'FXUSDCAD',
  goc10y: 'BD.CDN.10YR.DQ.YLD',
  policyRate: 'V39079',
  corra: 'AVG.INTWO',
} as const

const OBSERVATION_COUNT = 45

const ENDPOINT =
  `https://www.bankofcanada.ca/valet/observations/` +
  `${Object.values(SERIES).join(',')}/json?recent=${OBSERVATION_COUNT}`

/** Valet returns one object per date, carrying only the series it has data for. */
interface ValetResponse {
  observations?: readonly Record<string, string | { v?: string } | undefined>[]
}

/**
 * Pulls one series out of the response as an ascending array of numbers.
 *
 * Valet neither sorts its observations nor reports every series on every
 * date — a weekly series and a daily one come back interleaved — so the dates
 * are sorted here rather than trusted, and gaps are dropped instead of being
 * read as zeroes.
 */
function readSeries(response: ValetResponse, code: string): { series: number[]; asOf?: string } {
  const dated: { date: string; value: number }[] = []

  for (const observation of response.observations ?? []) {
    const date = observation.d
    const cell = observation[code]
    if (typeof date !== 'string' || typeof cell !== 'object' || cell === null) continue

    const parsed = Number(cell.v)
    if (!Number.isFinite(parsed)) continue
    dated.push({ date, value: parsed })
  }

  dated.sort((a, b) => a.date.localeCompare(b.date))

  return {
    series: dated.map((entry) => entry.value),
    asOf: dated[dated.length - 1]?.date,
  }
}

export async function fetchBankOfCanada(): Promise<MarketGroup> {
  const response = await fetchMarketJson<ValetResponse>(SOURCE, ENDPOINT)

  if (!Array.isArray(response.observations) || response.observations.length === 0) {
    throw new MarketSourceError(SOURCE, 'no observations returned')
  }

  const usdCad = readSeries(response, SERIES.usdCad)
  const goc10y = readSeries(response, SERIES.goc10y)
  const policy = readSeries(response, SERIES.policyRate)
  const corra = readSeries(response, SERIES.corra)

  const quotes: (MarketQuote | null)[] = [
    quoteFromSeries({
      id: 'usd-cad',
      label: 'USD/CAD',
      series: usdCad.series,
      decimals: 4,
      changeIn: 'percent',
    }),
    quoteFromSeries({
      id: 'goc-10y',
      label: 'GoC 10-year',
      series: goc10y.series,
      decimals: 2,
      changeIn: 'basisPoints',
      suffix: '%',
    }),
    quoteFromSeries({
      id: 'boc-policy',
      label: 'Policy rate',
      series: policy.series,
      decimals: 2,
      changeIn: 'basisPoints',
      suffix: '%',
    }),
    quoteFromSeries({
      id: 'corra',
      label: 'CORRA',
      series: corra.series,
      decimals: 2,
      changeIn: 'basisPoints',
      suffix: '%',
    }),
  ]

  const resolved = quotes.filter((quote): quote is MarketQuote => quote !== null)

  if (resolved.length === 0) {
    throw new MarketSourceError(SOURCE, 'none of the requested series had values')
  }

  return {
    id: 'canada',
    title: 'Canada — rates & FX',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    asOf: usdCad.asOf ?? goc10y.asOf,
    layout: 'rows',
    quotes: resolved,
  }
}
