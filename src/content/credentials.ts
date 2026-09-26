import { acresResearch, ubcSauder } from '@/content/hero'

export interface CredentialEntry {
  /** The position held, set as the row's lead line. */
  role: string
  organisation: string
  /** One concrete line, e.g. an intended specialisation. */
  descriptor?: string
  /** Date range. Omitted rather than guessed. */
  period?: string
  href?: string
}

export interface CredentialAction {
  label: string
  href: string
  external?: boolean
}

export interface CredentialSection {
  id: string
  label: string
  entries?: readonly CredentialEntry[]
  /** Stands in where there is nothing to list yet. Stated plainly rather
   *  than leaving the heading over an empty space. */
  pending?: string
  /** A link out in place of a list, for anything that lives elsewhere. */
  action?: CredentialAction
}

/**
 * The record, split by what each part actually is. One undifferentiated list
 * of "experience" put a degree, a board seat and a mandate on the same
 * footing; these are different kinds of thing and a reader skimming for one
 * of them shouldn't have to read all three.
 *
 * Sections with nothing in them yet are still printed, because the absence is
 * itself informative: it says the work exists and isn't published, not that it
 * was never considered.
 */
export const credentialSections: readonly CredentialSection[] = [
  {
    id: 'education',
    label: 'Education',
    entries: [
      {
        role: 'Sophomore',
        organisation: ubcSauder.name,
        descriptor: 'BCom, Finance Specialization & Business Technology Management',
        period: 'Expected May 2029',
        href: ubcSauder.href,
      },
    ],
  },
  {
    id: 'boards',
    label: 'Boards & Memberships',
    entries: [
      {
        role: 'Director of Research II',
        organisation: acresResearch.name,
        period: 'June 2024 - Present',
        href: acresResearch.href,
      },
    ],
  },
  {
    id: 'funds',
    label: 'Funds Managed',
    pending: 'Coming soon',
  },
  {
    id: 'holdings',
    label: 'Reported Holdings',
    pending: 'Coming soon',
  },
]
