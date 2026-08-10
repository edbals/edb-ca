import { Mail } from 'lucide-react'

/**
 * Provider marks drawn as single-colour glyphs that inherit the surrounding
 * text colour, rather than full-colour brand logos. The palette here is
 * strictly ink on paper, and dropping four saturated logos into it would be
 * the only chromatic thing on the site.
 */

interface IconProps {
  className?: string
}

const BASE = 'size-4 shrink-0'

/** The Gmail envelope: a flat envelope with its distinctive M valley. */
export function GmailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? BASE}
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

/** Outlook: an envelope paired with the squared O of the Office mark. */
export function OutlookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? BASE}
    >
      <rect x="2" y="5" width="9" height="14" rx="2.5" />
      <ellipse cx="6.5" cy="12" rx="1.9" ry="2.6" />
      <path d="M13 7h9v10h-9" />
      <path d="M13 9l4.5 3L22 9" />
    </svg>
  )
}

/** Yahoo: the wordmark's exclamation, set beside an envelope corner. */
export function YahooIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? BASE}
    >
      <path d="M3 6l4.5 6.5V18" />
      <path d="M12 6l-4.5 6.5" />
      <path d="M18 6v7" />
      <circle cx="18" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Anything else: the plain envelope, handed off to the OS. */
export function DefaultMailIcon({ className }: IconProps) {
  return <Mail className={className ?? BASE} strokeWidth={1.6} aria-hidden="true" />
}
