import type { Direction, MarketQuote } from './types'

/** Below this, a move is quoted as unchanged rather than as noise. */
const FLAT_EPSILON = 1e-9

/** A sparkline needs at least this many points to describe a shape. */
const MIN_SPARK_POINTS = 8

export function directionOf(delta: number): Direction {
  if (Math.abs(delta) < FLAT_EPSILON) return 'flat'
  return delta > 0 ? 'up' : 'down'
}

export function formatNumber(value: number, decimals: number): string {
  return value.toLocaleString('en-CA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/** A percentage move, always signed by its own arrow rather than a minus. */
export function formatPercentChange(latest: number, previous: number): string {
  const pct = ((latest - previous) / previous) * 100
  return `${Math.abs(pct).toFixed(2)}%`
}

/**
 * Rate moves are quoted in basis points, not percent: a 10-year yield going
 * from 3.96 to 3.97 is "1 bp", and calling that "+0.25%" would describe the
 * wrong quantity.
 */
export function formatBasisPointChange(latest: number, previous: number): string {
  const bp = Math.round((latest - previous) * 100)
  return `${Math.abs(bp)} bp`
}

/** Trims a series to the tail, and drops it when it is too short to plot. */
export function toSpark(series: readonly number[], maxPoints = 40): readonly number[] | undefined {
  if (series.length < MIN_SPARK_POINTS) return undefined
  return series.slice(-maxPoints)
}

interface SeriesQuoteInput {
  id: string
  label: string
  /** Oldest to newest. */
  series: readonly number[]
  decimals: number
  /** Percent for prices and FX, basis points for yields and policy rates. */
  changeIn: 'percent' | 'basisPoints'
  suffix?: string
}

/**
 * Builds a quote from a published series, deriving the move from the last two
 * observations. A single-observation series still renders its level, with no
 * invented delta beside it.
 */
export function quoteFromSeries({
  id,
  label,
  series,
  decimals,
  changeIn,
  suffix = '',
}: SeriesQuoteInput): MarketQuote | null {
  if (series.length === 0) return null

  const latest = series[series.length - 1]
  const value = `${formatNumber(latest, decimals)}${suffix}`

  if (series.length < 2) {
    return { id, label, value, direction: 'flat' }
  }

  const previous = series[series.length - 2]
  const change =
    changeIn === 'percent'
      ? formatPercentChange(latest, previous)
      : formatBasisPointChange(latest, previous)

  // A rate that rounds to zero basis points has not moved at the resolution
  // it is published to, so it reads as unchanged rather than "0 bp".
  const delta = latest - previous
  const direction = change.startsWith('0 bp') ? 'flat' : directionOf(delta)

  return {
    id,
    label,
    value,
    change: direction === 'flat' ? undefined : change,
    direction,
    spark: toSpark(series),
  }
}
