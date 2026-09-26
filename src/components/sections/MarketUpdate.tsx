import { getMarketSnapshot } from '@/lib/market/snapshot'
import type { MarketGroup, MarketQuote } from '@/lib/market/types'
import { SectionHeading } from '@/components/ds/section-heading'
import { cn } from '@/lib/utils'

const ARROW = { up: '▲', down: '▼', flat: '' } as const

const CHANGE_TONE = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-ink-quaternary',
} as const

/** A plain calendar date, e.g. "2026-08-31". */
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/**
 * Every source publishes a date, not a timestamp. `new Date('2026-08-31')`
 * parses that as UTC midnight, which formats as the 30th anywhere west of
 * Greenwich , so the panel would report the wrong observation date for every
 * reader in the Americas. Appending a local midnight keeps the calendar date
 * the source actually published.
 */
function asOfLabel(asOf?: string): string | undefined {
  if (!asOf) return undefined

  const parsed = new Date(DATE_ONLY.test(asOf) ? `${asOf}T00:00:00` : asOf)
  if (Number.isNaN(parsed.getTime())) return asOf

  return parsed.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
}

function QuoteRow({ quote }: { quote: MarketQuote }) {
  return (
    <div className="border-rule grid grid-cols-[1fr_auto_auto] items-center gap-3.5 border-b py-2.5 last:border-b-0 last:pb-0">
      <span className="text-ink-secondary text-body-sm">{quote.label}</span>
      <span className="mono-data text-right font-semibold">{quote.value}</span>
      <span
        className={cn(
          'mono-data min-w-[5.4em] text-right text-body-sm',
          CHANGE_TONE[quote.direction],
        )}
      >
        {quote.change ? `${ARROW[quote.direction]} ${quote.change}` : (quote.cadence ?? '—')}
      </span>
    </div>
  )
}

function Group({ group }: { group: MarketGroup }) {
  const asOf = asOfLabel(group.asOf)

  return (
    // Every cell carries a right and bottom rule; the grid is pulled a pixel
    // out of its clipping container so the outermost ones disappear. That holds
    // for any number of groups, where nth-child rules would strand a border in
    // mid-grid the moment the optional equities panel is added.
    <div className="border-rule -mr-px -mb-px border-r border-b p-4.5">
      <h3 className="micro text-ink-tertiary">
        {group.title}{' '}
        <span className="text-ink-quaternary font-semibold normal-case">/ {group.source}</span>
      </h3>
      {asOf ? <p className="mono-data text-ink-quaternary mt-1 text-[0.6875rem]">as of {asOf}</p> : null}

      <div className="mt-2.5">
        {group.quotes.map((quote) => (
          <QuoteRow key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  )
}

/**
 * The market update at the foot of the page. Every figure is the latest
 * published observation from an official source, and each panel names the
 * source and the date it was published , these are not intraday quotes, and
 * presenting a monthly Treasury average as if it were live would be the one
 * genuinely misleading thing this section could do.
 *
 * Rendered on the server and revalidated on a fixed cadence, so a visitor
 * never waits on four third-party APIs and the APIs never see per-visitor
 * traffic. A source that fails is named rather than hidden.
 */
export async function MarketUpdate() {
  const snapshot = await getMarketSnapshot()

  return (
    <section className="shell py-16 md:py-21">
      <SectionHeading
        id="markets"
        title="Market update"
        aside={
          <span className="text-up inline-flex items-center gap-2">
            <span aria-hidden="true" className="live-dot bg-up rounded-round block size-1.5" />
            Live
          </span>
        }
      />

      {snapshot.groups.length === 0 ? (
        <p className="border-rule rounded-panel text-ink-tertiary mt-8 border border-dashed p-5 text-body-sm">
          Market data is unavailable right now. Every source is a live third-party service, and
          this section reports that rather than showing stale figures.
        </p>
      ) : (
        <div className="border-rule rounded-panel mt-8 overflow-hidden border">
          <div className="grid overflow-hidden md:grid-cols-2">
            {snapshot.groups.map((group) => (
              <Group key={group.id} group={group} />
            ))}
          </div>

          {snapshot.isEquitiesPending ? (
            <p className="border-rule-strong rounded-button mono-data text-ink-tertiary mx-4.5 mt-3.5 border border-dashed px-3 py-2.5 text-xs">
              Equity indices: set TWELVEDATA_API_KEY to add them. Everything above is keyless.
            </p>
          ) : null}

          <div className="border-rule bg-paper-raised mt-4.5 border-t px-4.5 py-3.5">
            <p className="text-ink-tertiary text-xs">
              Latest published observations, not intraday quotes. Refreshed every 15 minutes.
              Sources: Bank of Canada Valet, European Central Bank via Frankfurter, U.S. Treasury
              FiscalData, CoinGecko.
            </p>
            {snapshot.failures.length > 0 ? (
              <p className="text-down mt-1.5 text-xs">
                Currently unavailable: {snapshot.failures.join(', ')}.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  )
}
