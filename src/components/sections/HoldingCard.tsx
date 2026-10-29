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
    <div className="mt-4">
      <div className="grid grid-cols-[1fr_auto] gap-x-3">
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="h-28 w-full md:h-32"
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

/**
 * A holding, set like a Bloomberg security screen: the ticker in its
 * Bloomberg form, last price and the day's move, and a year's chart.
 *
 * The price is fetched with the rest of the market data and on the same
 * cadence. If the feed is down, the card keeps the name and the research
 * link and says the price is unavailable, rather than drawing a stale one.
 */
export async function HoldingCard({ entry }: { entry: CredentialEntry & { ticker: string } }) {
  const series = await loadSeries(entry.ticker)

  const body = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="mono-data text-key-amber text-body-sm font-semibold tracking-wide">
          {entry.ticker} US Equity
        </p>
        {entry.research ? (
          <span className="text-term-fg inline-flex items-center gap-1.5 text-body-sm font-semibold group-hover/holding:underline group-hover/holding:underline-offset-4">
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
        ) : null}
      </div>
      <p className="text-ink-inverse text-title mt-1 font-semibold">{entry.role}</p>

      {series ? (
        <>
          <div className="mono-data mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-ink-inverse text-subheading font-semibold">
              {formatNumber(series.last, 2)}
            </span>
            <span className={cn('text-body-sm', TONE[series.direction])}>
              {ARROW[series.direction]} {signed(series.change, 2)} ({signed(series.changePercent, 2)}%)
            </span>
            <span className="text-term-label text-body-sm">
              1Y{' '}
              <span className={TONE[series.rangeDirection]}>
                {signed(series.rangeChangePercent, 1)}%
              </span>
            </span>
          </div>
          <PriceChart series={series} />
          <p className="mono-data text-term-dim mt-3 text-[0.6875rem]">
            USD · daily close · {series.source} · as of {dateLabel(series.asOf)}
          </p>
        </>
      ) : (
        <p className="mono-data text-term-dim mt-3 text-body-sm">Live price unavailable right now</p>
      )}
    </>
  )

  const card = 'bg-term rounded-panel block p-4.5 md:p-5'

  // Research lives on this site, so it opens in place like any other page.
  return entry.research ? (
    <Link href={entry.research} className={cn(card, 'group/holding hover:bg-term-hover transition-colors')}>
      {body}
    </Link>
  ) : (
    <div className={card}>{body}</div>
  )
}
