import Link from 'next/link'
import type { CredentialEntry } from '@/content/credentials'
import { formatNumber } from '@/lib/market/format'
import { fetchHoldingSeries, type HoldingSeries } from '@/lib/market/sources/holding'
import type { Direction } from '@/lib/market/types'
import { cn } from '@/lib/utils'

const ARROW = { up: '▲', down: '▼', flat: '' } as const

const TONE: Record<Direction, string> = {
  up: 'text-term-fg',
  down: 'text-term-down',
  flat: 'text-term-label',
}

/** Chart box in SVG units. The line is drawn with a non-scaling stroke, so the
 *  box can stretch to the card's width without thickening it. */
const CHART_W = 100
const CHART_H = 40

/** "2026-10-28" as "Oct 28, 2026", kept on the published calendar date. */
function dateLabel(date: string, withDay = true): string {
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return parsed.toLocaleDateString('en-CA', {
    month: 'short',
    ...(withDay ? { day: 'numeric' } : {}),
    year: 'numeric',
  })
}

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

/** A year of closes, as Bloomberg's GP screen draws it: one amber line on
 *  black, ruled at the high, the midpoint and the low. */
function PriceChart({ series }: { series: HoldingSeries }) {
  const points = linePoints(series.closes, series.low, series.high)
  const mid = (series.high + series.low) / 2

  return (
    <div className="mt-3">
      <div className="grid grid-cols-[1fr_auto] gap-x-3">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="h-28 w-full"
          role="img"
          aria-label={`${series.symbol} daily close, ${dateLabel(series.firstDate)} to ${dateLabel(series.asOf)}: low ${formatNumber(series.low, 2)}, high ${formatNumber(series.high, 2)}, last ${formatNumber(series.last, 2)}`}
        >
          {[0, CHART_H / 2, CHART_H].map((y) => (
            <line
              key={y}
              x1="0"
              x2={CHART_W}
              y1={y}
              y2={y}
              className="stroke-term-rule"
              strokeDasharray="1 1.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polygon
            points={`0,${CHART_H} ${points} ${CHART_W},${CHART_H}`}
            className="fill-key-amber/10"
          />
          <polyline
            points={points}
            fill="none"
            className="stroke-key-amber"
            strokeWidth="1.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="mono-data text-term-label flex flex-col justify-between text-[0.6875rem] leading-none">
          <span>{formatNumber(series.high, 2)}</span>
          <span>{formatNumber(mid, 2)}</span>
          <span>{formatNumber(series.low, 2)}</span>
        </div>
      </div>
      <div className="mono-data text-term-dim mt-1.5 flex justify-between pr-12 text-[0.6875rem]">
        <span>{dateLabel(series.firstDate, false)}</span>
        <span>{dateLabel(series.asOf, false)}</span>
      </div>
    </div>
  )
}

async function loadSeries(symbol: string): Promise<HoldingSeries | null> {
  try {
    return await fetchHoldingSeries(symbol)
  } catch (cause) {
    // Logged with the real cause; the card only says the price is unavailable.
    console.error(`[market] ${symbol} series failed:`, cause)
    return null
  }
}

const LIGHT_TONE: Record<Direction, string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-ink-tertiary',
}

/** The inline trend: the same year of closes, small enough to sit in a line. */
function Sparkline({ series }: { series: HoldingSeries }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      preserveAspectRatio="none"
      className="h-5 w-20"
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
    <span className="text-accent inline-flex items-center gap-1.5 text-body-sm font-semibold whitespace-nowrap group-hover/holding:underline group-hover/holding:underline-offset-4">
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
 * name, last price and the day's move, a small trend line, and the link to
 * Ed's report on it.
 *
 * The full year chart is an overlay, shown on hover or keyboard focus, in the
 * style of a terminal's price screen. It is there for the reader who stops on
 * the holding, and stays out of the way of the one scrolling past it. Phones
 * have no hover, so they get the line and the sparkline only.
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
        </p>
        {series ? (
          <p className="mono-data text-xs whitespace-nowrap">
            <span className="font-semibold">{formatNumber(series.last, 2)}</span>{' '}
            <span className={LIGHT_TONE[series.direction]}>
              {ARROW[series.direction]} {signed(series.changePercent, 2)}%
            </span>
          </p>
        ) : null}
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        {series ? (
          <p className="mono-data text-ink-tertiary flex items-center gap-2 text-xs">
            <Sparkline series={series} />
            1Y{' '}
            <span className={LIGHT_TONE[series.rangeDirection]}>
              {signed(series.rangeChangePercent, 1)}%
            </span>
          </p>
        ) : (
          <p className="mono-data text-ink-quaternary text-xs">Live price unavailable right now</p>
        )}
        {entry.research ? <ReportLink /> : null}
      </div>

      {series ? (
        <div
          aria-hidden="true"
          className="bg-term rounded-panel pointer-events-none absolute top-full right-0 z-20 mt-2 hidden w-[26rem] p-4 shadow-lg md:group-hover/holding:block md:group-focus-visible/holding:block"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="mono-data text-key-amber text-body-sm font-semibold tracking-wide">
              {entry.ticker} US Equity
            </p>
            <p className={cn('mono-data text-body-sm', TONE[series.direction])}>
              {formatNumber(series.last, 2)} {ARROW[series.direction]} {signed(series.change, 2)}
            </p>
          </div>
          <PriceChart series={series} />
          <p className="mono-data text-term-dim mt-2 text-[0.6875rem]">
            USD · daily close · {series.source} · as of {dateLabel(series.asOf)}
          </p>
        </div>
      ) : null}
    </>
  )

  // Research lives on this site, so it opens in place like any other page.
  return entry.research ? (
    <Link href={entry.research} className="group/holding relative block">
      {body}
    </Link>
  ) : (
    <div className="relative block">{body}</div>
  )
}
