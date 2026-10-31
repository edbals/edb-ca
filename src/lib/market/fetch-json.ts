/** Every market source is refreshed on this cadence. */
export const MARKET_REVALIDATE_SECONDS = 900

const REQUEST_TIMEOUT_MS = 8000

export class MarketSourceError extends Error {
  constructor(
    readonly source: string,
    message: string,
  ) {
    super(`${source}: ${message}`)
    this.name = 'MarketSourceError'
  }
}

async function fetchMarket(source: string, url: string, accept: string): Promise<Response> {
  let response: Response

  try {
    response = await fetch(url, {
      next: { revalidate: MARKET_REVALIDATE_SECONDS },
      headers: { accept },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : 'network request failed'
    throw new MarketSourceError(source, reason)
  }

  if (!response.ok) {
    throw new MarketSourceError(source, `responded ${response.status}`)
  }

  return response
}

/**
 * Fetches and parses JSON from a public market endpoint.
 *
 * These are third-party services on the open internet, so every call is
 * bounded by a timeout and a status check, and a failure throws a named
 * error rather than resolving to something half-parsed. The caller decides
 * whether one dead source should take the whole panel down; none of them do.
 */
export async function fetchMarketJson<T>(source: string, url: string): Promise<T> {
  const response = await fetchMarket(source, url, 'application/json')

  try {
    return (await response.json()) as T
  } catch {
    throw new MarketSourceError(source, 'response was not valid JSON')
  }
}

/** The same guarantees, for sources that publish CSV rather than JSON. */
export async function fetchMarketText(source: string, url: string): Promise<string> {
  const response = await fetchMarket(source, url, 'text/csv, text/plain')
  return response.text()
}
