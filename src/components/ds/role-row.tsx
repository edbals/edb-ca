import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface RoleRowProps {
  role: string
  organisation: string
  /** One concrete line, e.g. an intended specialisation. */
  descriptor?: string
  /** Date range. Omitted rather than guessed. */
  period?: string
  href?: string
  className?: string
}

/**
 * A position, as a row in a list. No logo tile: the marks were doing no work
 * that the organisation's name wasn't already doing, and three logos at three
 * different aspect ratios was the densest, least readable part of the page.
 */
export function RoleRow({
  role,
  organisation,
  descriptor,
  period,
  href,
  className,
}: RoleRowProps) {
  const Wrapper = href ? 'a' : 'div'

  return (
    <Wrapper
      {...(href ? { href, ...externalLinkProps(true) } : {})}
      className={cn(
        'border-rule grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-0.5 border-b py-[18px]',
        href && 'hover:bg-paper-raised -mx-3 px-3 transition-colors',
        className,
      )}
    >
      <p className="text-title font-semibold">{role}</p>
      <p className="mono-data text-ink-tertiary col-start-2 row-start-1 text-xs whitespace-nowrap">
        {period}
      </p>
      <p className="text-ink-secondary col-start-1 text-body">{organisation}</p>
      {descriptor ? (
        <p className="text-ink-tertiary col-span-full text-body-sm">{descriptor}</p>
      ) : null}
    </Wrapper>
  )
}
