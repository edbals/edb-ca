'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface NavLink {
  label: string
  href: string
  /** Opens in a new tab. Used for the resume PDF and outbound profiles. */
  external?: boolean
}

export interface SiteNavProps {
  wordmark: string
  wordmarkHref?: string
  links: readonly NavLink[]
  /** Secondary links shown in the mobile sheet (email, LinkedIn, etc.). */
  secondaryLinks?: readonly NavLink[]
  /** Optional call to action pinned to the right on desktop. */
  cta?: NavLink
  /** Meta line in the mobile sheet footer, e.g. "Vancouver, BC". */
  metaLeft?: string
  metaRight?: string
  menuLabel?: string
  closeLabel?: string
}

/** Band near the top of the viewport that decides which section is current. */
const ACTIVE_ROOT_MARGIN = '-20% 0px -70% 0px'

/** "/#projects" to "projects". Hrefs are root relative so they work on subpages. */
function sectionId(href: string): string {
  return href.split('#')[1] ?? ''
}

interface IndicatorRect {
  left: number
  width: number
}

/**
 * Floating frosted pill. The active section is tracked on scroll and marked
 * by a pill that springs between items, so the nav reflects where the reader
 * actually is. A click also sets the marker immediately, rather than
 * waiting for the browser's own scroll animation to carry a section through
 * the tracking band, since a smooth scroll can take long enough that
 * waiting on it alone reads as the nav ignoring the click.
 */
export function SiteNav({
  wordmark,
  wordmarkHref = '/#top',
  links,
  secondaryLinks = [],
  cta,
  metaLeft,
  metaRight,
  menuLabel = 'Menu',
  closeLabel = 'Close menu',
}: SiteNavProps) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null)
  const [hoverIndicator, setHoverIndicator] = useState<IndicatorRect | null>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    // The hero is observed too, so returning to the top clears the marker
    // instead of stranding it on the last section read.
    const ids = ['top', ...links.map((link) => sectionId(link.href))]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const lastId = ids[ids.length - 1]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          const id = visible[visible.length - 1].target.id
          setActiveId(id === 'top' ? '' : id)
        }
      },
      { rootMargin: ACTIVE_ROOT_MARGIN },
    )

    sections.forEach((section) => observer.observe(section))

    // The observer's tracking band sits a fixed 20-30% down the viewport.
    // If the last section is short, or the page just isn't much taller than
    // the viewport past that point, scrolling to the very bottom can never
    // push that band over its top edge, so it never fires and the marker
    // gets stuck on whatever was active before, a dead zone every
    // scrollspy built this way runs into. Landing within a couple of
    // pixels of the document's end is checked directly and wins outright.
    const onScroll = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) setActiveId(lastId === 'top' ? '' : lastId)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [links])

  // Measure after paint so the marker lands on real link geometry, and hide
  // it entirely when no section matches.
  useLayoutEffect(() => {
    const activeLink = linkRefs.current.get(activeId)
    setIndicator(activeLink ? { left: activeLink.offsetLeft, width: activeLink.offsetWidth } : null)
  }, [activeId])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 md:pt-4">
        <div className="shell">
          <nav
            aria-label="Primary"
            className="glass rounded-pill flex items-center gap-3 border border-rule px-4 py-2.5 md:px-5"
          >
            <a
              href={wordmarkHref}
              className="micro shrink-0 text-ink transition-opacity hover:opacity-70"
            >
              {wordmark}
            </a>

            <div
              className="relative ml-auto hidden md:block"
              onMouseLeave={() => setHoverIndicator(null)}
            >
              {indicator ? (
                <span
                  aria-hidden="true"
                  className="bg-wash rounded-pill absolute inset-y-0 motion-safe:transition-[left,width] motion-safe:duration-500 motion-safe:ease-out"
                  style={{ left: indicator.left, width: indicator.width }}
                />
              ) : null}
              {/* Where the pointer is, not where the reader is: an outline
                  rather than a fill, so it never competes with the active
                  marker for the same read. */}
              <span
                aria-hidden="true"
                className={cn(
                  'rounded-pill border-rule-strong absolute inset-y-0 border motion-safe:transition-[left,width,opacity] motion-safe:duration-300 motion-safe:ease-out',
                  hoverIndicator ? 'opacity-100' : 'opacity-0',
                )}
                style={{ left: hoverIndicator?.left ?? 0, width: hoverIndicator?.width ?? 0 }}
              />
              <ul className="flex items-center">
                {links.map((link) => {
                  const id = sectionId(link.href)
                  const isActive = id === activeId
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        ref={(element) => {
                          if (element) linkRefs.current.set(id, element)
                          else linkRefs.current.delete(id)
                        }}
                        onMouseEnter={(event) => {
                          // Suppressed on the active link itself: a
                          // hairline traced over a filled pill would only
                          // muddy a state that is already clear.
                          if (isActive) return
                          const element = event.currentTarget
                          setHoverIndicator({ left: element.offsetLeft, width: element.offsetWidth })
                        }}
                        onClick={() => setActiveId(id)}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'micro rounded-pill relative z-10 block px-3.5 py-1.5 transition-colors',
                          isActive ? 'text-ink' : 'text-ink-secondary hover:text-ink',
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="ml-auto flex items-center gap-2 md:ml-4">
              {cta ? (
                <a
                  href={cta.href}
                  {...externalLinkProps(cta.external)}
                  className="micro rounded-pill hidden bg-ink px-4 py-2 text-ink-inverse transition-opacity hover:opacity-85 md:inline-flex"
                >
                  {cta.label}
                </a>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                className="micro rounded-pill border border-rule px-3 py-2 text-ink transition-colors hover:border-rule-strong md:hidden"
              >
                {menuLabel}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile sheet: large serif list navigation */}
      <div
        aria-hidden={!open}
        className={cn(
          'bg-paper fixed inset-0 z-60 transition-opacity duration-300 md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 pt-4 pb-8">
          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={closeLabel}
              className="grid size-10 place-items-center text-ink"
            >
              <X size={22} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-8 flex flex-col gap-1">
            {links.map((link, index) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-heading text-ink block transition-[opacity,transform] duration-500"
                  style={{
                    transitionDelay: open ? `${80 + index * 45}ms` : '0ms',
                    transitionTimingFunction: 'var(--ease-standard)',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop keeps this as a permanent pill beside the hamburger;
              the sheet is the only other place a mobile reader can reach it,
              so it gets the same visual weight here rather than being
              folded into the plain secondary list below. */}
          {cta ? (
            <a
              href={cta.href}
              {...externalLinkProps(cta.external)}
              onClick={() => setOpen(false)}
              className="micro rounded-pill bg-ink text-ink-inverse mt-8 inline-flex w-fit items-center px-5 py-3 transition-opacity hover:opacity-85"
            >
              {cta.label}
            </a>
          ) : null}

          {secondaryLinks.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2">
              {secondaryLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...externalLinkProps(link.external)}
                    className="text-body-sm text-ink-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-rule pt-6">
            <p className="text-body-sm text-ink-tertiary">{metaLeft}</p>
            <p className="text-body-sm text-ink-tertiary">{metaRight}</p>
          </div>
        </div>
      </div>
    </>
  )
}
