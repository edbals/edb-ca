import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import type { EconomicRelease } from '../types'

const SOURCE = 'FRED'

/** How far ahead to look, and how many releases to actually show. */
const WINDOW_DAYS = 21
const MAX_RELEASES = 6

/**
 * FRED publishes release dates for several hundred series, most of them
 * obscure. Matching on name rather than on release id keeps the filter
 * readable and survives FRED renumbering anything, at the cost of being
 * slightly fuzzy , which is the right trade for a sidebar of six dates.
 */
const NOTABLE = [
  'Consumer Price Index',
  'Employment Situation',
  'Gross Domestic Product',
  'Personal Income and Outlays',
  'Producer Price Index',
  'Advance Monthly Sales for Retail',
  'Industrial Production',
  'FOMC',
  'Federal Open Market Committee',
]

interface FredReleaseDate {
  release_id?: number
  release_name?: string
  date?: string
}

interface FredResponse {
  release_dates?: readonly FredReleaseDate[]
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isNotable(name: string): boolean {
  return NOTABLE.some((needle) => name.toLowerCase().includes(needle.toLowerCase()))
}

export function isCalendarConfigured(): boolean {
  return Boolean(process.env.FRED_API_KEY)
}

/**
 * The next few US data releases, from the St. Louis Fed.
 *
 * Opt-in behind FRED_API_KEY for the same reason the equity indices are: every
 * other source on the page is keyless, and a free key is the only way to get a
 * genuine release calendar.
 */
export async function fetchEconomicCalendar(now = new Date()): Promise<readonly EconomicRelease[]> {
  const apiKey = process.env.FRED_API_KEY
  if (!apiKey) throw new MarketSourceError(SOURCE, 'FRED_API_KEY is not set')

  const start = isoDate(now)
  const end = isoDate(new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000))

  const endpoint =
    `https://api.stlouisfed.org/fred/releases/dates?api_key=${apiKey}&file_type=json` +
    `&realtime_start=${start}&realtime_end=${end}` +
    `&include_release_dates_with_no_data=true&sort_order=asc&limit=1000`

  const response = await fetchMarketJson<FredResponse>(SOURCE, endpoint)
  const rows = response.release_dates

  if (!Array.isArray(rows)) throw new MarketSourceError(SOURCE, 'no release dates returned')

  const seen = new Set<string>()
  const releases: EconomicRelease[] = []

  for (const row of rows) {
    const date = row.date
    const name = row.release_name
    if (typeof date !== 'string' || typeof name !== 'string') continue
    if (date < start || !isNotable(name)) continue

    // FRED lists a release once per series it covers, so the same name and
    // date can appear many times over.
    const key = `${date}-${name}`
    if (seen.has(key)) continue
    seen.add(key)

    releases.push({ id: key, date, name })
    if (releases.length >= MAX_RELEASES) break
  }

  if (releases.length === 0) {
    throw new MarketSourceError(SOURCE, 'no notable releases in the window')
  }

  return releases
}
