import Link from 'next/link'
import type { CredentialEntry } from '@/content/credentials'
import { formatNumber } from '@/lib/market/format'
import { fetchHoldingSeries, type HoldingSeries } from '@/lib/market/sources/holding'
import type { Direction } from '@/lib/market/types'

const ARROW = { up: '▲', down: '▼', flat: '' } as const

const TONE: Record<Direction, string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-ink-tertiary',
}

/** Sparkline box in SVG units. The line is drawn with a non-scaling stroke,
 *  so the box can stretch without thickening it. */
const CHART_W = 100
const CHART_H = 40

function signed(value: number, decimals: number): string {
  const sign = value > 0 ? '+' : value < 0 ? '-' : ''
  return `${sign}${formatNumber(Math.abs(value), decimals)}`
}

function linePoints(closes: readonly number[], low: number, high: number): string {
  const span = high - low || 1
  const step = CHART_W / (closes.length - 1)

  return closes
    .map((close, index) => {
      const x = index * step
      const y = CHART_H - ((close - low) / span) * CHART_H
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

async function loadSeries(symbol: string): Promise<HoldingSeries | null> {
  try {
    return await fetchHoldingSeries(symbol)
  } catch (cause) {
    // Logged with the real cause; the line only says the price is unavailable.
    console.error(`[market] ${symbol} series failed:`, cause)
    return null
  }
}

/** A year of closes, small enough to sit beside the name. */
function Sparkline({ series }: { series: HoldingSeries }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="ml-2.5 inline-block h-5 w-20 align-[-0.2em]"
    >
      <polyline
        points={linePoints(series.closes, series.low, series.high)}
        fill="none"
        className="stroke-accent"
        strokeWidth="1.25"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

function ReportLink() {
  return (
    <span className="text-accent ml-auto inline-flex items-center gap-1.5 text-body-sm font-semibold whitespace-nowrap group-hover/holding:underline group-hover/holding:underline-offset-4">
      <svg
        aria-hidden="true"
        width="12"
        height="12"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 1.5h5.5L13 5v9.5H4z" />
        <path d="M9.5 1.5V5H13M6.5 8.5h4M6.5 11.5h4" />
      </svg>
      Read my report →
    </span>
  )
}

/**
 * A holding, as one line like every other entry in the record: ticker and
 * name with a year's sparkline, last price and the day's move, and the link to
 * Ed's report on it. Kept to the weight of the other entries, so one holding
 * doesn't outweigh the rest of the record.
 *
 * If the feed is down, the line keeps the name and the link and says the
 * price is unavailable, rather than drawing a stale one.
 */
export async function HoldingCard({ entry }: { entry: CredentialEntry & { ticker: string } }) {
  const series = await loadSeries(entry.ticker)

  const body = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-title font-semibold group-hover/holding:underline group-hover/holding:underline-offset-4">
          <span className="mono-data mr-2">{entry.ticker}</span>
          {entry.role}
          {series ? <Sparkline series={series} /> : null}
        </p>
        {series ? (
          <p className="mono-data text-xs whitespace-nowrap">
            <span className="font-semibold">{formatNumber(series.last, 2)}</span>{' '}
            <span className={TONE[series.direction]}>
              {ARROW[series.direction]} {signed(series.changePercent, 2)}%
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {series ? null : (
          <p className="mono-data text-ink-quaternary text-xs">Live price unavailable right now</p>
        )}
        {entry.research ? <ReportLink /> : null}
      </div>

    </>
  )

  // Research lives on this site, so it opens in place like any other page.
  return entry.research ? (
    <Link href={entry.research} className="group/holding block">
      {body}
    </Link>
  ) : (
    <div className="block">{body}</div>
  )
}
