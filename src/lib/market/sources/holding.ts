import { fetchMarketJson, MarketSourceError } from '../fetch-json'
import { directionOf } from '../format'
import { isEquitiesConfigured } from './equities'
import type { Direction } from '../types'

const SOURCE = 'Twelve Data'

/** Roughly one trading year of daily closes. */
const TRADING_DAYS = 260

interface TwelveDataSeries {
  status?: string
  code?: number
  message?: string
  values?: { datetime?: string; close?: string }[]
}

export interface HoldingSeries {
  symbol: string
  last: number
  /** Move since the previous close, in percent. */
  changePercent: number
  direction: Direction
  /** Move over the whole window, first close to last. */
  rangeChangePercent: number
  rangeDirection: Direction
  high: number
  low: number
  /** Oldest to newest. */
  closes: readonly number[]
  asOf: string
}

/**
 * A year of daily closes for one holding, for the sparkline beside it.
 *
 * Same key and provider as the index panel, so a holding costs one more
 * request per refresh and no new account. `time_series` rather than `quote`:
 * the closes give the sparkline, and the last two give the day's move, in one
 * call.
 */
export async function fetchHoldingSeries(symbol: string): Promise<HoldingSeries> {
  const apiKey = process.env.TWELVEDATA_API_KEY
  if (!isEquitiesConfigured() || !apiKey) {
    throw new MarketSourceError(SOURCE, 'TWELVEDATA_API_KEY is not set')
  }

  const endpoint = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=${TRADING_DAYS}&apikey=${apiKey}`
  const response = await fetchMarketJson<TwelveDataSeries>(SOURCE, endpoint)

  if (response.status === 'error' || typeof response.code === 'number') {
    throw new MarketSourceError(SOURCE, response.message ?? `responded code ${response.code}`)
  }

  // Newest first as published; the sparkline reads left to right in time.
  const rows = (response.values ?? [])
    .map((row) => ({ date: row.datetime ?? '', close: Number(row.close) }))
    .filter((row) => row.date && Number.isFinite(row.close))
    .reverse()

  if (rows.length < 2) {
    throw new MarketSourceError(SOURCE, `too few closes returned for ${symbol}`)
  }

  const closes = rows.map((row) => row.close)
  const last = closes[closes.length - 1]
  const previous = closes[closes.length - 2]
  const first = closes[0]
  const change = last - previous

  return {
    symbol,
    last,
    changePercent: (change / previous) * 100,
    direction: directionOf(change),
    rangeChangePercent: ((last - first) / first) * 100,
    rangeDirection: directionOf(last - first),
    high: Math.max(...closes),
    low: Math.min(...closes),
    closes,
    asOf: rows[rows.length - 1].date,
  }
}
