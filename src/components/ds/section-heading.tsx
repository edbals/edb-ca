import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeadingProps {
  title: string
  /** Right-aligned note: a count, a year range, a live indicator. */
  aside?: ReactNode
  id?: string
  className?: string
}

/**
 * Section title over a heavy rule. The rule is what divides the page into
 * parts, so sections need no other framing , no cards around cards.
 */
export function SectionHeading({ title, aside, id, className }: SectionHeadingProps) {
  return (
    <header
      id={id}
      className={cn(
        'border-ink flex flex-wrap items-baseline justify-between gap-4 border-b-2 pb-5',
        className,
      )}
    >
      <h2 className="text-heading">{title}</h2>
      {aside ? <div className="micro text-ink-tertiary">{aside}</div> : null}
    </header>
  )
}
