export interface NavLink {
  label: string
  href: string
}

/** Root relative hashes so links work from /projects/[slug] pages too. */
export const navLinks: NavLink[] = [
  { label: 'Projects', href: '/#projects' },
  { label: 'Publications', href: '/#publications' },
  { label: 'Markets', href: '/#markets' },
]
