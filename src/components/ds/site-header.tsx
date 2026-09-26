'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ButtonLink, keyClassName, keyStyle } from '@/components/ds/button'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export interface HeaderLink {
  label: string
  href: string
  external?: boolean
}

export interface SiteHeaderProps {
  wordmark: string
  wordmarkHref?: string
  links: readonly HeaderLink[]
  secondaryLinks?: readonly HeaderLink[]
  cta?: HeaderLink
  metaLeft?: string
  metaRight?: string
}

/** Band near the top of the viewport that decides which section is current. */
const ACTIVE_ROOT_MARGIN = '-18% 0px -72% 0px'

/** "/#projects" to "projects". Hrefs are root relative so subpages work too. */
function sectionId(href: string): string {
  return href.split('#')[1] ?? ''
}

/**
 * A slim sticky bar: wordmark, sections, résumé. The current section is marked
 * by a soft accent fill rather than a moving indicator , the sections are
 * destinations on one page, and a tinted label says that without animating.
 */
export function SiteHeader({
  wordmark,
  wordmarkHref = '/#top',
  links,
  secondaryLinks = [],
  cta,
  metaLeft,
  metaRight,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

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
        if (visible.length === 0) return
        const id = visible[visible.length - 1].target.id
        setActiveId(id === 'top' ? '' : id)
      },
      { rootMargin: ACTIVE_ROOT_MARGIN },
    )

    sections.forEach((section) => observer.observe(section))

    // The observer's band sits a fixed distance down the viewport, so a short
    // final section can never cross its top edge and the marker sticks on
    // whatever came before , the dead zone every scrollspy built this way hits.
    // Landing at the document's end is checked directly and wins outright.
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

  return (
    <>
      <header className="border-rule bg-paper/92 sticky top-0 z-50 border-b backdrop-blur-md">
        <div className="shell flex items-center gap-1.5 py-3">
          <a
            href={wordmarkHref}
            className="font-serif mr-5 shrink-0 text-[1.3rem] tracking-[-0.02em] whitespace-nowrap transition-opacity hover:opacity-70"
          >
            {wordmark}
          </a>

          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex gap-1">
              {links.map((link) => {
                const isActive = sectionId(link.href) === activeId
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setActiveId(sectionId(link.href))}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'micro rounded-button block px-2.5 py-1.5 transition-colors',
                        isActive
                          ? 'bg-accent-soft text-accent'
                          : 'text-ink-secondary hover:bg-wash hover:text-ink',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-3.5">
            {secondaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                {...externalLinkProps(link.external)}
                className="micro mono-data link-rule text-ink-secondary hidden md:inline-block"
              >
                {link.label}
              </a>
            ))}
            {cta ? (
              <ButtonLink
                href={cta.href}
                external={cta.external}
                size="sm"
                className="hidden md:inline-flex"
              >
                {cta.label}
              </ButtonLink>
            ) : null}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-expanded={isOpen}
              style={keyStyle('secondary')}
              className={keyClassName({ tone: 'secondary', size: 'sm', className: 'md:hidden' })}
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet: the sections set large, as a list. */}
      <div
        aria-hidden={!isOpen}
        className={cn(
          'bg-paper fixed inset-0 z-60 transition-opacity duration-300 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pt-4 pb-8">
          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="text-ink grid size-10 place-items-center"
            >
              <X size={22} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-8 flex flex-col">
            {links.map((link, index) => (
              <li key={link.href} className="border-rule border-b">
                <a
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-heading block py-4 transition-[opacity,transform] duration-500"
                  style={{
                    transitionDelay: isOpen ? `${80 + index * 45}ms` : '0ms',
                    transitionTimingFunction: 'var(--ease-standard)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {cta ? (
            <ButtonLink href={cta.href} external={cta.external} command className="mt-8 w-fit">
              {cta.label}
            </ButtonLink>
          ) : null}

          {secondaryLinks.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2.5">
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

          <div className="border-rule mt-auto flex items-end justify-between gap-4 border-t pt-6">
            <p className="micro text-ink-tertiary">{metaLeft}</p>
            <p className="micro text-ink-tertiary">{metaRight}</p>
          </div>
        </div>
      </div>
    </>
  )
}
