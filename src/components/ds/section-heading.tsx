import { TypeSet } from '@/components/ds/type-set'
import { cn } from '@/lib/utils'

export interface SectionHeadingProps {
  /** Large serif display title. */
  title: string
  /** Optional short standfirst set in sans. */
  intro?: string
  /** Optional right-aligned note (count, year range, etc.). */
  aside?: string
  id?: string
  className?: string
}

/** Matches `--text-heading-lg--letter-spacing`, the tracking the title rests at. */
const HEADING_LG_TRACKING = '-0.015em'

/**
 * The rule and the space beneath it exist to separate an eyebrow line from
 * the title. With no `aside` there is nothing to separate, so both are
 * dropped and the title simply leads, rather than leaving a divider that
 * divides nothing and a gap that reads as a mistake.
 */
export function SectionHeading({ title, intro, aside, id, className }: SectionHeadingProps) {
  return (
    <header id={id} className={cn(aside && 'border-t border-rule pt-4 md:pt-5', className)}>
      {aside ? (
        <div className="flex items-baseline justify-end">
          <p className="micro text-ink-quaternary">{aside}</p>
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16',
          aside && 'mt-8 md:mt-12',
        )}
      >
        <h2 className="max-w-[16ch] font-serif text-heading-lg text-ink">
          <TypeSet tracking={HEADING_LG_TRACKING}>{title}</TypeSet>
        </h2>
        {intro ? (
          <p className="max-w-[42ch] text-body text-ink-secondary lg:pb-2">{intro}</p>
        ) : null}
      </div>
    </header>
  )
}
