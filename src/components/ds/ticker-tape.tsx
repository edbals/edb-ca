import { cn } from '@/lib/utils'
import type { MarketSnapshot } from '@/lib/market/types'

/** Seconds of travel per item, so a longer tape doesn't scroll faster. */
const SECONDS_PER_ITEM = 2.4

const ARROW = { up: '▲', down: '▼', flat: '·' } as const

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
          className="mono-data border-crt-rule flex shrink-0 items-baseline gap-1.5 border-r px-4 py-2 text-[0.6875rem] whitespace-nowrap"
        >
          <span className="text-term-faint uppercase">{item.label}</span>
          {/* The figure carries a faint bloom, the way phosphor does. It is
              the only thing on the strip that has to be readable at speed. */}
          <span className="text-term-fg [text-shadow:0_0_7px_rgb(123_219_163/0.45)]">
            {item.value}
          </span>
          {item.change ? (
            <span
              className={cn(
                item.direction === 'up' && 'text-term-fg',
                item.direction === 'down' && 'text-term-down',
                item.direction === 'flat' && 'text-term-faint',
              )}
            >
              {ARROW[item.direction]}
              {item.change}
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}

/**
 * The tape across the top of the footer. Every figure on it is the same data
 * the market panel shows, so the two can never disagree.
 *
 * A pinned channel label sits to the left of the scroll, the way a real ticker
 * names its feed: it gives the strip an anchor that doesn't move, so the eye
 * has somewhere to rest while the figures run past.
 *
 * The track holds the row twice and travels exactly -50%, which is what makes
 * the loop seamless: at the end of the cycle the second copy sits exactly
 * where the first began. Only the first copy is read by assistive technology.
 * Hovering pauses it, and reduced motion turns it into a scrollable strip.
 */
export function TickerTape({ snapshot }: { snapshot: MarketSnapshot }) {
  const items = itemsFrom(snapshot)

  if (items.length === 0) return null

  return (
    <div className="bg-term flex items-stretch">
      {/* Pinned, and deliberately outside the scrolling track. */}
      <div className="border-crt-rule bg-term-raised flex shrink-0 items-center gap-2 border-r px-3.5">
        <span
          aria-hidden="true"
          className="live-dot rounded-round bg-term-fg block size-1.5 shadow-[0_0_6px_rgb(123_219_163/0.8)]"
        />
        <span className="micro text-term-dim hidden sm:block">Tape</span>
      </div>

      <div
        className="ticker-viewport min-w-0 flex-1 overflow-hidden"
        style={{
          ['--ticker-duration' as string]: `${(items.length * SECONDS_PER_ITEM).toFixed(0)}s`,
        }}
      >
        <div className="ticker-track" role="list" aria-label="Latest market figures">
          <Run items={items} />
          <Run items={items} ariaHidden />
        </div>
      </div>

      {/* The strip fades out at its right edge instead of being chopped by
          the viewport, so items leave rather than vanish. */}
      <div
        aria-hidden="true"
        className="from-term pointer-events-none -ml-16 w-16 shrink-0 bg-gradient-to-l to-transparent"
      />
    </div>
  )
}
