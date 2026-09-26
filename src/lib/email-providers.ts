import type { ComponentType } from 'react'
import { GmailIcon, OutlookIcon, YahooIcon } from '@/components/ds/mail-icons'

export interface EmailProvider {
  id: string
  label: string
  /** Builds a compose URL for this provider, pre-addressed to `to`. */
  composeUrl: (to: string) => string
  /** Opens in a new tab. False for mailto:, which hands off to the OS. */
  external: boolean
  icon: ComponentType<{ className?: string }>
}

/**
 * Percent-encodes an address for a query value while leaving `@` alone.
 *
 * `@` is legal in a query component per RFC 3986, and every Outlook compose
 * deeplink Microsoft documents shows it bare. Their handler is demonstrably
 * fussy about its own parameters, so the safest thing is to send exactly the
 * shape their examples use rather than a technically equivalent `%40`.
 */
function encodeAddress(to: string): string {
  return encodeURIComponent(to).replace(/%40/g, '@')
}

/**
 * Webmail compose links, so a reader who lives in Gmail is not thrown at
 * whatever desktop client the OS has registered for mailto:.
 *
 * Outlook is split deliberately. There is no single URL covering both kinds
 * of Microsoft account: personal mailboxes live on `outlook.live.com` and
 * work or school tenants on `outlook.office.com`, and each host only
 * resolves its own. Both use the `/mail/deeplink/compose` path. The older
 * `/mail/0/deeplink/compose` form, which this used to send, is the one
 * widely reported as no longer opening a pre-addressed draft.
 */
export const EMAIL_PROVIDERS: readonly EmailProvider[] = [
  {
    id: 'gmail',
    label: 'Gmail',
    composeUrl: (to) => `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`,
    external: true,
    icon: GmailIcon,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    composeUrl: (to) => `https://outlook.live.com/mail/deeplink/compose?to=${encodeAddress(to)}`,
    external: true,
    icon: OutlookIcon,
  },
  {
    id: 'outlook-work',
    label: 'Outlook, work or school',
    composeUrl: (to) => `https://outlook.office.com/mail/deeplink/compose?to=${encodeAddress(to)}`,
    external: true,
    icon: OutlookIcon,
  },
  {
    id: 'yahoo',
    label: 'Yahoo',
    composeUrl: (to) => `https://compose.mail.yahoo.com/?to=${encodeURIComponent(to)}`,
    external: true,
    icon: YahooIcon,
  },
]
