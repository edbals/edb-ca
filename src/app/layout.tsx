import type { Metadata } from 'next'
import { serifDisplay, sansText, accentType } from '@/lib/fonts'
import { SiteNav } from '@/components/ds/site-nav'
import { SiteFooter } from '@/components/ds/site-footer'
import { EmailMenu } from '@/components/ds/email-menu'
import { navLinks } from '@/components/layout/navLinks'
import { contact } from '@/content/contact'
import { cvLink } from '@/content/cv'
import './globals.css'

const SITE_URL = 'https://edbert.ca'
const SITE_DESCRIPTION =
  'Ed Sunarpo. Fascinated by the intersection of finance, technology, and product design. Equity research, market analysis, and AI powered tools.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Subpages deliberately set no title of their own, so this one is
  // inherited everywhere: the tab always reads "Ed Sunarpo" rather than a
  // long page name truncated to nothing useful.
  title: 'Ed Sunarpo',
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Ed Sunarpo',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: 'Ed Sunarpo',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ed Sunarpo',
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serifDisplay.variable} ${sansText.variable} ${accentType.variable}`}
    >
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SiteNav
          wordmark="Ed Sunarpo"
          wordmarkHref="/#top"
          links={navLinks}
          secondaryLinks={[
            { label: contact.email, href: `mailto:${contact.email}` },
            { label: contact.linkedinLabel, href: contact.linkedinUrl, external: true },
          ]}
          cta={{ label: cvLink.label, href: cvLink.href, external: cvLink.external }}
          metaLeft="Vancouver, BC"
          metaRight="2026"
        />
        {children}
        <SiteFooter
          wordmark="Ed Sunarpo"
          location="Vancouver, BC"
          copyright={`© ${new Date().getFullYear()} Ed Sunarpo`}
          action={
            <EmailMenu
              email={contact.email}
              placement="top"
              triggerClassName="micro cursor-pointer text-ink-secondary transition-colors hover:text-ink"
            />
          }
          links={[
            { label: contact.linkedinLabel, href: contact.linkedinUrl, external: true },
            { label: cvLink.label, href: cvLink.href, external: cvLink.external },
          ]}
          topLink={{ label: 'Back to top', href: '/#top' }}
        />
      </body>
    </html>
  )
}
