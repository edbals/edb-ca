import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import type { EconomicRelease } from '../types'

const SOURCE = 'FRED'

/** How far ahead to look, and how many releases to actually show. */
const WINDOW_DAYS = 21
const MAX_RELEASES = 6

/**
 * FRED publishes release dates for several hundred series, most of them
 * obscure, so the calendar shows only these.
 *
 * Matched exactly, not by substring. Substring matching on "Gross Domestic
 * Product" also caught "Debt to Gross Domestic Product Ratios", "…by Industry"
 * and "…by State", which between them filled four of six rows with variations
 * on one release and pushed CPI and PPI off the list entirely.
 *
 * The cost is that a rename at FRED drops a release silently rather than
 * matching loosely. For a list of six that is the right way round: a missing
 * row is better than five near-duplicates.
 *
 * Names are copied from a live response, and each one is displayed as-is.
 */
const NOTABLE = [
  'Consumer Price Index',
  'Employment Situation',
  'Gross Domestic Product',
  'Personal Income and Outlays',
  'Producer Price Index',
  'Advance Monthly Sales for Retail and Food Services',
  'G.17 Industrial Production and Capacity Utilization',
]

/** Shorter labels for the two releases whose official names are unreadable. */
const DISPLAY_NAME: Record<string, string> = {
  'Advance Monthly Sales for Retail and Food Services': 'Retail Sales (advance)',
  'G.17 Industrial Production and Capacity Utilization': 'Industrial Production',
}

/**
 * A scheduled release lands on one date in a three-week window, occasionally
 * two. Anything appearing more often is a continuously-updated feed that FRED
 * lists against every date rather than an event with a date.
 *
 * This is not hypothetical: FRED's "FOMC Press Release" comes back on all 22
 * days of the window, so matching it by name alone produced a calendar that
 * announced an FOMC release today, tomorrow and every day after.
 */
const MAX_DATES_PER_RELEASE = 2

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

const NOTABLE_SET = new Set<string>(NOTABLE)

function isNotable(name: string): boolean {
  return NOTABLE_SET.has(name)
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

  // Collect the candidates first: whether a name is a scheduled release or a
  // rolling feed can only be judged once the whole window has been read.
  const datesByName = new Map<string, Set<string>>()

  for (const row of rows) {
    const date = row.date
    const name = row.release_name
    if (typeof date !== 'string' || typeof name !== 'string') continue
    if (date < start || !isNotable(name)) continue

    // FRED lists a release once per series it covers, so a name and date pair
    // can appear many times over; a Set collapses them.
    const dates = datesByName.get(name) ?? new Set<string>()
    dates.add(date)
    datesByName.set(name, dates)
  }

  const releases: EconomicRelease[] = []

  for (const [name, dates] of datesByName) {
    if (dates.size > MAX_DATES_PER_RELEASE) continue
    for (const date of dates) {
      releases.push({ id: `${date}-${name}`, date, name: DISPLAY_NAME[name] ?? name })
    }
  }

  releases.sort((a, b) => a.date.localeCompare(b.date))
  releases.splice(MAX_RELEASES)

  if (releases.length === 0) {
    throw new MarketSourceError(SOURCE, 'no notable releases in the window')
  }

  return releases
}
