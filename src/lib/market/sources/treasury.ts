import { fetchMarketText, MarketSourceError } from '../fetch-json'
import { quoteFromSeries } from '../format'
import type { MarketGroup, MarketQuote } from '../types'

const SOURCE = 'U.S. Treasury'
const SOURCE_URL =
  'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_par_yield_curve'

/**
 * The daily par yield curve: the Treasury's official closing yields, published
 * every business day. This replaced the average rates on outstanding debt,
 * which are a monthly series and so always read a month or more old.
 */
const TENORS = [
  { column: '3 Mo', id: 'ust-3m', label: '3-month' },
  { column: '2 Yr', id: 'ust-2y', label: '2-year' },
  { column: '10 Yr', id: 'ust-10y', label: '10-year' },
  { column: '30 Yr', id: 'ust-30y', label: '30-year' },
] as const

/** Enough closes for the sparkline. Early in January the year's file is
 *  short, so the previous year is read as well. */
const MIN_ROWS = 40

function endpoint(year: number): string {
  return (
    'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/' +
    `daily-treasury-rates.csv/${year}/all?type=daily_treasury_yield_curve` +
    `&field_tdr_date_value=${year}&page&_format=csv`
  )
}

function cells(line: string): string[] {
  return line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''))
}

/** "10/30/2026" to "2026-10-30", so dates sort as text and read as the panel's other dates. */
function isoDate(usDate: string): string | undefined {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(usDate)
  if (!match) return undefined
  const [, month, day, year] = match
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

interface Row {
  date: string
  values: Record<string, number>
}

/**
 * Reads the CSV by column name, not position, and sorts by date rather than
 * trusting the file's order: the Treasury has added maturities to this file
 * before, which moved every column after them.
 */
function parse(csv: string): Row[] {
  const [header, ...lines] = csv.trim().split(/\r?\n/)
  if (!header) return []
  const names = cells(header)
  const dateAt = names.indexOf('Date')
  if (dateAt === -1) return []

  const rows: Row[] = []
  for (const line of lines) {
    const row = cells(line)
    const date = isoDate(row[dateAt] ?? '')
    if (!date) continue

    const values: Record<string, number> = {}
    names.forEach((name, i) => {
      const value = Number(row[i])
      if (i !== dateAt && row[i] !== '' && Number.isFinite(value)) values[name] = value
    })
    rows.push({ date, values })
  }

  return rows
}

export async function fetchTreasuryRates(): Promise<MarketGroup> {
  const year = new Date().getUTCFullYear()
  let rows = parse(await fetchMarketText(SOURCE, endpoint(year)))
  if (rows.length < MIN_ROWS) {
    rows = [...parse(await fetchMarketText(SOURCE, endpoint(year - 1))), ...rows]
  }

  if (rows.length === 0) {
    throw new MarketSourceError(SOURCE, 'no yield curve rows returned')
  }

  rows.sort((a, b) => a.date.localeCompare(b.date))

  const quotes = TENORS.map(({ column, id, label }): MarketQuote | null =>
    quoteFromSeries({
      id,
      label,
      series: rows.map((row) => row.values[column]).filter((v): v is number => v !== undefined),
      decimals: 2,
      changeIn: 'basisPoints',
      suffix: '%',
    }),
  ).filter((quote): quote is MarketQuote => quote !== null)

  if (quotes.length === 0) {
    throw new MarketSourceError(SOURCE, 'none of the requested maturities were present')
  }

  return {
    id: 'treasury',
    title: 'U.S. Treasury yields',
    source: SOURCE,
    sourceUrl: SOURCE_URL,
    asOf: rows[rows.length - 1].date,
    layout: 'rows',
    quotes,
  }
}
