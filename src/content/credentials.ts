import { acresResearch, ubcSauder } from '@/content/hero'

export interface CredentialEntry {
  /** The lead line: a role, an award, a certificate. */
  role: string
  /** Second line. Absent on awards and certificates, where the name says it. */
  organisation?: string
  /** One concrete line, e.g. a specialisation or where the work was done. */
  descriptor?: string
  /** Date range. Omitted rather than guessed. */
  period?: string
  /** Outcome, set where the result is the point rather than the dates. */
  result?: string
  href?: string
}

export interface CredentialSection {
  id: string
  label: string
  entries?: readonly CredentialEntry[]
  /** Stands in where there is nothing to list yet. Stated plainly rather
   *  than leaving the heading over an empty space. */
  pending?: string
}

/**
 * The record, split by what each part actually is. One undifferentiated list
 * of "experience" put a degree, a job and a volunteer post on the same
 * footing; these are different kinds of thing and a reader skimming for one of
 * them shouldn't have to read all three.
 *
 * Every entry here is taken from the résumé, so the two can't contradict each
 * other in front of a recruiter reading both.
 *
 * Sections with nothing in them yet still print, because the absence is itself
 * informative: it says the work exists and isn't published, not that it was
 * never considered.
 */
export const credentialSections: readonly CredentialSection[] = [
  {
    id: 'education',
    label: 'Education',
    entries: [
      {
        role: 'Bachelor of Commerce',
        organisation: ubcSauder.name,
        descriptor: 'Finance Specialization & Business Technology Management',
        period: 'Expected May 2029',
        href: ubcSauder.href,
      },
    ],
  },
  {
    id: 'experience',
    label: 'Experience',
    entries: [
      {
        role: 'Director of Research II',
        organisation: acresResearch.name,
        descriptor: 'Jakarta, Indonesia',
        period: 'June 2024 - Present',
        href: acresResearch.href,
      },
      {
        role: 'Project Support',
        organisation: 'Pertamina Retail',
        descriptor: 'Jakarta, Indonesia',
        period: 'August 2024 - December 2024',
      },
    ],
  },
  {
    id: 'boards',
    label: 'Boards & Memberships',
    entries: [
      {
        role: 'Curriculum Head',
        organisation: 'SIS Investment Club',
        descriptor: 'Jakarta, Indonesia',
        period: 'January 2025 - May 2025',
      },
      {
        role: 'Founder',
        organisation: 'Hopeful Hearts Indonesia',
        descriptor: 'Jakarta, Indonesia',
        period: 'January 2024 - May 2025',
      },
    ],
  },
  {
    id: 'awards',
    label: 'Awards',
    entries: [
      {
        role: 'Junior Economic Club of Canada Writing Competition',
        result: '1st place',
      },
      {
        role: 'International Economics Olympiad Essay Challenge',
        result: 'Top 25 global',
      },
      {
        role: 'Deloitte × TransLink TechStrat Case Competition',
        result: 'Semi-finalist, top 5 of 50',
      },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    entries: [
      { role: 'Bloomberg Market Concepts' },
      { role: 'Bloomberg Finance Fundamentals' },
      { role: 'Financial Modeling & Valuation Analyst', result: 'In progress' },
      { role: 'Impact Investing Summer School' },
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
