export interface HeroLogo {
  src: string
  /** Intrinsic pixel dimensions, so the chip can preserve the true ratio. */
  width: number
  height: number
  /** The words the logo itself spells, so the chip renders only the rest
   *  of the name instead of repeating them. */
  wordmark?: string
  /** Multiplier on the chip's logo height. Wordmarks need less than icons. */
  scale?: number
}

export interface HeroCompany {
  name: string
  logo?: HeroLogo
  href?: string
}

export const acresResearch: HeroCompany = {
  name: 'Acres Research',
  // The mark spells "Acres", so the chip only needs to add "Research".
  logo: { src: '/logos/acres-research.png', width: 650, height: 209, wordmark: 'Acres' },
  href: 'https://www.linkedin.com/company/acresresearch/',
}

// The official Sauder lockup, cropped to its top line: "School of Business"
// sets too small to read in a chip. The mark already spells the name, so the
// chip renders no label at all, the same way the Acres mark works.
export const ubcSauder: HeroCompany = {
  name: 'UBC Sauder',
  logo: {
    src: '/logos/ubc-sauder.png',
    width: 667,
    height: 101,
    wordmark: 'UBC Sauder',
    scale: 0.82,
  },
  href: 'https://www.sauder.ubc.ca/',
}
