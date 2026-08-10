import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import type { HeroLogo } from '@/content/hero'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface ExperienceRowProps {
  role: string
  company: string
  logo?: HeroLogo
  /** One concrete line , a real number or outcome, not a restated job title. */
  descriptor?: string
  /** Date range, e.g. "2025 , Present". Omitted, not guessed, until a real one is known. */
  period?: string
  /** The company's own site or profile. Renders the whole row as a link when set. */
  href?: string
  className?: string
}

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

/**
 * A LinkedIn-style position card: the logo sits in its own fixed square
 * slot regardless of the source mark's aspect ratio, so a wide wordmark
 * (UBC Sauder) and a square icon (Investor Muda) read at the same size
 * instead of the row stretching to fit whichever logo is widest. Role,
 * company and period stack underneath as three lines of decreasing weight,
 * the same hierarchy LinkedIn's own position entries use.
 *
 * Renders as an anchor to the company's own site when `href` is set , the
 * whole row is the hit target, not just the logo or name, since either one
 * alone can be too small a target on a row this size.
 */
export function ExperienceRow({
  role,
  company,
  logo,
  descriptor,
  period,
  href,
  className,
}: ExperienceRowProps) {
  const Wrapper = href ? 'a' : 'div'

  return (
    <Wrapper
      {...(href ? { href, ...externalLinkProps(true) } : {})}
      className={cn(
        'group border-rule flex items-center gap-4 border-t py-5 transition-colors first:border-t-0 first:pt-0',
        href && '-mx-3 rounded-image px-3 hover:bg-wash',
        className,
      )}
    >
      <div className="border-rule bg-paper-raised flex size-12 shrink-0 items-center justify-center rounded-image border p-2">
        {logo ? (
          <Image
            src={logo.src}
            alt={`${company} logo`}
            width={logo.width}
            height={logo.height}
            className="h-full w-full object-contain"
          />
        ) : (
          <span aria-hidden="true" className="micro text-ink-tertiary">
            {monogram(company)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="text-title font-medium text-ink">{role}</p>
        <p className="text-body-sm text-ink-secondary">{company}</p>
        {descriptor ? <p className="text-body-sm text-ink-tertiary">{descriptor}</p> : null}
        {period ? <p className="micro text-ink-quaternary">{period}</p> : null}
      </div>

      {href ? (
        // A second line of metadata that only exists on hover: the row
        // reads as plain text at rest and only admits it is a link once
        // the reader is already pointing at it.
        <span className="micro ml-auto flex shrink-0 items-center gap-1.5 pl-2 text-ink-tertiary opacity-0 transition-[opacity,transform] duration-300 ease-out -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100">
          Visit
          <ArrowUpRight size={12} strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}
    </Wrapper>
  )
}
