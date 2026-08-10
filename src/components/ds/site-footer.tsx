import type { ReactNode } from 'react'
import { AnimatedRule } from '@/components/ds/animated-rule'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface FooterLink {
  label: string
  href: string
  /** Opens in a new tab. Used for the resume PDF and outbound profiles. */
  external?: boolean
}

export interface SiteFooterProps {
  wordmark: string
  /** e.g. "Vancouver, BC". */
  location?: string
  /** e.g. "© 2026 Ed Sunarpo". */
  copyright: string
  links?: readonly FooterLink[]
  /** Leads the link row. Used for the email provider picker, which needs to
   *  be a menu rather than a link. */
  action?: ReactNode
  /** Optional "back to top" affordance. */
  topLink?: FooterLink
  className?: string
}

export function SiteFooter({
  wordmark,
  location,
  copyright,
  links = [],
  action,
  topLink,
  className,
}: SiteFooterProps) {
  return (
    <footer className={cn('bg-paper', className)}>
      <div className="shell pt-10 pb-8">
        <AnimatedRule />
        <div className="flex flex-col gap-8 pt-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-subheading text-ink">{wordmark}</p>
            {location ? <p className="micro mt-2 text-ink-tertiary">{location}</p> : null}
          </div>

          {action || links.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {action ? <li>{action}</li> : null}
              {links.map((link, i) => (
                <li key={`${link.label}-${i}`}>
                  <a
                    href={link.href}
                    {...externalLinkProps(link.external)}
                    className="link-rule micro text-ink-secondary transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-10 flex items-baseline justify-between gap-4">
          <p className="micro text-ink-quaternary">{copyright}</p>
          {topLink ? (
            <a
              href={topLink.href}
              className="link-rule micro text-ink-quaternary transition-colors hover:text-ink"
            >
              {topLink.label}
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  )
}
