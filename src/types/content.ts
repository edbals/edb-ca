export interface WorkRowEntry {
  id: string
  left: string
  right: string
}

export interface ProjectCaseStudy {
  /** One line framing the problem as a question. */
  question: string
  /** What was built, in two or three short paragraphs. */
  experiment: readonly string[]
  features: readonly string[]
  learned: readonly string[]
  nextSteps: readonly string[]
}

export interface ProjectEntry {
  slug: string
  year: string
  title: string
  description: string
  /** Static image used unless `visual` names a live component instead. */
  thumbnail: string
  /** Renders the project's own output as artwork in place of a screenshot. */
  visual?: 'payoff' | 'risk'
  /** The live product. When set, the title links here, not to the case study. */
  liveUrl?: string
  /** Marks the thumbnail as work in progress rather than a shipped screenshot. */
  comingSoon?: boolean
  caseStudy: ProjectCaseStudy
}

export interface ResearchLink {
  label: string
  href: string
}

/** How the source document is surfaced on the detail page. */
export type ResearchSource =
  | { kind: 'pdf'; href: string }
  | {
      kind: 'social'
      href: string
      network: 'LinkedIn' | 'Instagram'
      /** Frame height in px. Post aspect varies, and the networks' embed
       *  pages cannot self-report their height without their own script. */
      embedHeight?: number
      /** A literal embed URL, e.g. copied straight from the network's own
       *  "Embed" button. Overrides the URL derived from `href`, since
       *  LinkedIn URNs come in several typed forms (activity, ugcPost,
       *  share) that a regex can't safely guess between. */
      embedUrl?: string
    }

export interface ResearchEntry {
  id: string
  title: string
  /** The publication that carried it. Absent for self-published work,
   *  where the category already says what the piece is. */
  outlet?: string
  year?: string
  /** What kind of work it is, e.g. "Equity Research". Never a file format. */
  category: string
  links: readonly ResearchLink[]
  featured?: boolean
  /** The piece's own subtitle, as printed on the document. */
  subtitle?: string
  description?: string
  thumbnail?: string
  /** The question the piece set out to answer. Kept on the entries but no
   *  longer rendered: the subpages lead with the document and the findings.
   *  Left in place rather than deleted so the written text isn't lost. */
  purpose?: string
  /** Conclusions reached, not a summary of the document. */
  findings?: readonly string[]
  /** The document itself. Absent until the file or post URL is supplied. */
  source?: ResearchSource
}

export interface CvLink {
  label: string
  href: string
  /** Opens in a new tab, so a reader never loses the site to a PDF viewer. */
  external?: boolean
}

export interface ContactInfo {
  email: string
  linkedinUrl: string
  /** The visible link text wherever LinkedIn is offered as a channel, so
   *  nav, footer and hero can't drift onto different wording. */
  linkedinLabel: string
}
