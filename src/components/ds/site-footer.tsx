import type { ReactNode } from 'react'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterGroup {
  label: string
  links: readonly FooterLink[]
}

export interface SiteFooterProps {
  wordmark: string
  location?: string
  copyright: string
  groups?: readonly FooterGroup[]
  /** Leads the first group. Used for the email provider picker, which needs
   *  to be a menu rather than a link. */
  action?: ReactNode
  topLink?: FooterLink
  /** The ticker, rendered on the server and pinned above the colophon. */
  ticker?: ReactNode
  className?: string
}

/**
 * The colophon, with the ticker sitting on top of it. The rolling figures are
 * a footnote to the page, not its headline, which is why they live down here
 * rather than under the navigation.
 */
export function SiteFooter({
  wordmark,
  location,
  copyright,
  groups = [],
  action,
  topLink,
  ticker,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn('border-rule mt-4 border-t', className)}>
      {ticker}

      <div className="shell pt-10 pb-12">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <p className="font-serif text-[1.4rem] tracking-[-0.02em]">{wordmark}</p>
            {location ? <p className="text-ink-tertiary mt-2 text-body-sm">{location}</p> : null}
          </div>

          {groups.map((group, groupIndex) => (
            <ul key={group.label} className="flex flex-col gap-2.5">
              <li className="micro text-ink-quaternary">{group.label}</li>
              {groupIndex === 0 && action ? <li>{action}</li> : null}
              {group.links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    {...externalLinkProps(link.external)}
                    // -my-1.5/py-1.5 grows the touch target past the 24px
                    // floor without opening up the visual spacing of the list.
                    className="text-ink-secondary hover:text-ink text-body -my-1.5 inline-block self-start py-1.5 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="border-rule mt-8 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t pt-4">
          <p className="micro text-ink-quaternary">{copyright}</p>
          {topLink ? (
            <a
              href={topLink.href}
              className="micro link-rule text-ink-quaternary -my-1.5 inline-block py-1.5"
            >
              {topLink.label}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
