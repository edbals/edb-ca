export interface HeroCompany {
  name: string
  /** The organisation's own site or profile. Renders the row as a link. */
  href?: string
}

export const acresResearch: HeroCompany = {
  name: 'Acres Research',
  href: 'https://www.linkedin.com/company/acresresearch/',
}

export const ubcSauder: HeroCompany = {
  name: 'UBC Sauder',
  href: 'https://www.sauder.ubc.ca/',
}
