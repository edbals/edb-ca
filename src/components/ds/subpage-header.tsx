import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/ds/reveal'
import { TagList } from '@/components/ds/tag'

export interface SubpageAction {
  label: string
  href: string
}

export interface SubpageHeaderProps {
  backLabel: string
  backHref: string
  title: string
  /** Optional line under the title, set in serif at subheading size. */
  subtitle?: string
  /** Metadata pills: tags, category, outlet. Falsy entries are dropped. */
  tags?: readonly (string | undefined)[]
  year?: string
  /** Outbound action, e.g. "Visit the live site" or "Open the original". */
  action?: SubpageAction
}

/**
 * The masthead every subpage opens with. Both the project case studies and
 * the research pages render through this one component rather than keeping
 * their own copies, which is what let them drift apart on measure, metadata
 * treatment and spacing.
 */
export function SubpageHeader({
  backLabel,
  backHref,
  title,
  subtitle,
  tags = [],
  year,
  action,
}: SubpageHeaderProps) {
  const visibleTags = tags.filter((tag): tag is string => Boolean(tag))

  return (
    <Reveal>
      {/* A bordered pill rather than a bare underline: it reads as a
          control at a glance, and gives the small target enough hit area
          to be comfortable on touch. */}
      <Link
        href={backHref}
        className="group micro border-rule text-ink-secondary hover:border-ink hover:text-ink inline-flex items-center gap-2 rounded-pill border px-4 py-2 transition-colors"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.75}
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
        />
        {backLabel}
      </Link>

      <h1 className="mt-10 max-w-[20ch] font-serif text-heading-lg text-ink">{title}</h1>

      {subtitle ? (
        <p className="mt-4 max-w-[34ch] font-serif text-subheading text-ink-tertiary">{subtitle}</p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <TagList items={visibleTags} />
        {year ? <span className="micro text-ink-quaternary">{year}</span> : null}
        {action ? (
          <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group micro inline-flex items-center gap-1.5 text-ink transition-opacity hover:opacity-70"
          >
            {action.label}
            <ArrowUpRight
              size={13}
              strokeWidth={1.75}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        ) : null}
      </div>
    </Reveal>
  )
}
