import Link from 'next/link'
import { Tag } from '@/components/ds/tag'

export interface SubpageHeaderProps {
  backLabel: string
  backHref: string
  /** The piece's own category, set as the accent chip. */
  category?: string
  /** The publication that carried it, set quietly beside the category. */
  outlet?: string
  year?: string
  title: string
  /** The piece's own subtitle, as printed on the document. */
  subtitle?: string
  /** One sentence under the title. The entry's own description. */
  dek?: string
}

/**
 * The masthead every subpage opens with. Both the case studies and the
 * research pages render through this one component, which is what keeps them
 * from drifting apart on measure and metadata treatment.
 */
export function SubpageHeader({
  backLabel,
  backHref,
  category,
  outlet,
  year,
  title,
  subtitle,
  dek,
}: SubpageHeaderProps) {
  return (
    <header>
      <Link
        href={backHref}
        className="group text-ink-tertiary hover:text-ink -my-1.5 inline-flex items-center gap-2 py-1.5 text-body-sm transition-colors"
      >
        {/* Angle bracket rather than a drawn arrow, matching the > that marks
            every forward link on the site. */}
        <span
          aria-hidden="true"
          className="mono-data inline-block transition-transform duration-300 ease-out group-hover:-translate-x-0.5"
        >
          &lt;
        </span>
        {backLabel}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {category ? <Tag>{category}</Tag> : null}
        {outlet ? <Tag tone="plain">{outlet}</Tag> : null}
        {year ? <span className="micro mono-data text-ink-tertiary">{year}</span> : null}
      </div>

      <h1 className="text-heading-lg mt-4 max-w-[24ch]">{title}</h1>

      {subtitle ? (
        <p className="text-ink-tertiary mt-3 max-w-[44ch] text-subheading font-normal">
          {subtitle}
        </p>
      ) : null}

      {dek ? (
        <p className="text-ink-secondary mt-3.5 max-w-[52ch] text-[1.0625rem] leading-relaxed">
          {dek}
        </p>
      ) : null}
    </header>
  )
}
