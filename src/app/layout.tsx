import type { Metadata } from 'next'
import { serifDisplay, sansText } from '@/lib/fonts'
import { SiteHeader } from '@/components/ds/site-header'
import { SiteFooter } from '@/components/ds/site-footer'
import { EmailMenu } from '@/components/ds/email-menu'
import { TickerTape } from '@/components/ds/ticker-tape'
import { navLinks } from '@/components/layout/navLinks'
import { contact } from '@/content/contact'
import { cvLink } from '@/content/cv'
import { getMarketSnapshot } from '@/lib/market/snapshot'
import './globals.css'

/**
 * The apex 308s to www, so www is the canonical host. Using it here matters
 * beyond tidiness: metadataBase builds the og:image URL, and at the apex that
 * URL redirects — which some link scrapers will not follow, leaving the share
 * card with no image at all.
 */
const SITE_URL = 'https://www.edbert.ca'
const SITE_DESCRIPTION =
  'Ed Sunarpo. I\'m interested in finance, technology, and product design. Sophomore at UBC Sauder.'

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The footer ticker runs on every route, so the snapshot is fetched in the
  // layout. Both this and the market panel read the same revalidated cache
  // entries, so the two never show different numbers for the same figure.
  const snapshot = await getMarketSnapshot()

  return (
    <html lang="en" className={`${serifDisplay.variable} ${sansText.variable}`}>
      <head>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SiteHeader
          wordmark="Ed Sunarpo"
          wordmarkHref="/#top"
          links={navLinks}
          secondaryLinks={[{ label: contact.linkedinLabel, href: contact.linkedinUrl, external: true }]}
          cta={{ label: cvLink.label, href: cvLink.href, external: cvLink.external }}
          metaLeft="Vancouver, BC"
          metaRight="2026"
        />

        {children}

        <SiteFooter
          wordmark="Ed Sunarpo"
          location="Vancouver, BC"
          copyright={`© ${new Date().getFullYear()} Ed Sunarpo`}
          ticker={<TickerTape snapshot={snapshot} />}
          groups={[
            {
              label: 'Elsewhere',
              links: [
                { label: contact.linkedinLabel, href: contact.linkedinUrl, external: true },
                { label: cvLink.label, href: cvLink.href, external: cvLink.external },
              ],
            },
            {
              label: 'Sections',
              links: navLinks,
            },
          ]}
          action={
            <EmailMenu
              email={contact.email}
              placement="top"
              triggerClassName="text-body text-ink-secondary hover:text-ink cursor-pointer transition-colors"
            />
          }
          topLink={{ label: 'Back to top', href: '/#top' }}
        />
      </body>
    </html>
  )
}
