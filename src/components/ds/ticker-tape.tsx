import { cn } from '@/lib/utils'
import type { MarketSnapshot } from '@/lib/market/types'

/** Seconds of travel per item, so a longer tape doesn't scroll faster. */
const SECONDS_PER_ITEM = 2.4

const ARROW = { up: '▲', down: '▼', flat: '' } as const

interface TickerItem {
  key: string
  label: string
  value: string
  change?: string
  direction: 'up' | 'down' | 'flat'
}

function itemsFrom(snapshot: MarketSnapshot): TickerItem[] {
  return snapshot.groups.flatMap((group) =>
    group.quotes.map((quote) => ({
      key: `${group.id}-${quote.id}`,
      label: quote.label,
      value: quote.value,
      change: quote.change,
      direction: quote.direction,
    })),
  )
}

function Run({ items, ariaHidden }: { items: readonly TickerItem[]; ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden ? 'true' : undefined}>
      {items.map((item) => (
        <span
          key={item.key}
          className="mono-data border-term-rule text-term-dim border-r px-4 py-2 text-[0.6875rem] whitespace-nowrap"
        >
          {item.label} <b className="text-term-fg font-normal">{item.value}</b>
          {item.change ? (
            <span
              className={cn(
                'pl-1.5',
                item.direction === 'up' && 'text-term-fg',
                item.direction === 'down' && 'text-term-down',
              )}
            >
              {ARROW[item.direction]} {item.change}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}

/**
 * The ticker across the top of the footer. Every figure on it is the same data
 * the market panel shows, so the two can never disagree.
 *
 * The track holds the row twice and travels exactly -50%, which is what makes
 * the loop seamless: at the end of the cycle the second copy sits exactly
 * where the first began. Only the first copy is read by assistive technology;
 * the duplicate is presentational. Hovering pauses it, and reduced motion
 * turns it into a plain scrollable strip.
 */
export function TickerTape({ snapshot }: { snapshot: MarketSnapshot }) {
  const items = itemsFrom(snapshot)

  if (items.length === 0) return null

  return (
    <div
      className="ticker-viewport bg-term overflow-hidden"
      style={{
        ['--ticker-duration' as string]: `${(items.length * SECONDS_PER_ITEM).toFixed(0)}s`,
      }}
    >
      <div className="ticker-track" role="list" aria-label="Latest market figures">
        <Run items={items} />
        <Run items={items} ariaHidden />
      </div>
    </div>
  )
}
