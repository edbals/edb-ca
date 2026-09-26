'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EMAIL_PROVIDERS } from '@/lib/email-providers'
import { cn } from '@/lib/utils'

export interface EmailMenuProps {
  email: string
  /** The visible trigger, e.g. "Email" or the address itself. */
  label?: React.ReactNode
  /** Styling for the trigger, so the menu can sit in prose or on a button. */
  triggerClassName?: string
  /** Inline style for the trigger, so a key tone can pass its edge colour. */
  triggerStyle?: React.CSSProperties
  /** Which way the list unfolds. "top" for triggers near the page bottom. */
  placement?: 'bottom' | 'top'
  className?: string
}

const COPIED_RESET_MS = 2000

/**
 * A picker rather than a bare mailto: link. Sending someone straight to
 * mailto: hands them off to whatever the OS registered, which for most
 * people is not the inbox they actually read. Choosing the provider, or
 * simply copying the address, is nearly always what the reader wanted.
 */
export function EmailMenu({
  email,
  label = 'Email',
  triggerClassName,
  triggerStyle,
  placement = 'bottom',
  className,
}: EmailMenuProps) {
  const isAbove = placement === 'top'
  const [isOpen, setIsOpen] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  // The panel is always anchored to the trigger's left edge, so a trigger
  // sitting in the right half of a narrow screen would otherwise push it
  // straight past the viewport edge. Shifted left just enough to stay on
  // screen, never right beyond its natural position.
  const [shiftX, setShiftX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const prefersReducedMotion = useReducedMotion()

  useLayoutEffect(() => {
    // Nothing to correct while closed: the motion.div this offset applies
    // to is unmounted along with it, so a stale value sits inert until the
    // next open re-measures and overwrites it before paint.
    if (!isOpen) return
    const menu = menuRef.current
    if (!menu) return
    const EDGE_MARGIN = 12
    const rect = menu.getBoundingClientRect()
    const overflow = rect.right + EDGE_MARGIN - window.innerWidth
    setShiftX(overflow > 0 ? -overflow : 0)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  useEffect(() => {
    if (!hasCopied) return
    const timer = window.setTimeout(() => setHasCopied(false), COPIED_RESET_MS)
    return () => window.clearTimeout(timer)
  }, [hasCopied])

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(email)
      setHasCopied(true)
    } catch {
      // Clipboard can be denied by permissions or an insecure origin. The
      // address is visible in the menu either way, so there is nothing to
      // recover from, and failing silently beats an alert.
    }
  }

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        style={triggerStyle}
        className={triggerClassName}
      >
        {label}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            // A static offset, not an animated one: it corrects a position,
            // it doesn't perform, so it stays outside the opacity/y/scale
            // reveal below and can't introduce its own flash or jump.
            style={{ x: shiftX }}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: isAbove ? 6 : -6, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: isAbove ? 6 : -6, scale: 0.98 }
            }
            transition={{ type: 'spring', bounce: 0, duration: 0.28 }}
            className={cn(
              'border-rule bg-paper-raised absolute left-0 z-50 w-64 overflow-hidden rounded-image border',
              isAbove
                ? 'bottom-full mb-2 origin-bottom-left'
                : 'top-full mt-2 origin-top-left',
            )}
          >
            <p className="micro text-ink-quaternary border-rule border-b px-4 py-3">{email}</p>

            <ul className="py-1">
              {/* Each option settles in a beat after the one above it, so
                  the list reads as being set out rather than dropped in as
                  a block. */}
              {EMAIL_PROVIDERS.map((provider, index) => {
                const Icon = provider.icon
                return (
                  <motion.li
                    key={provider.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut', delay: 0.03 * index }}
                  >
                    <a
                      role="menuitem"
                      href={provider.composeUrl(email)}
                      {...(provider.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      onClick={() => setIsOpen(false)}
                      className="text-body-sm text-ink-secondary hover:bg-wash hover:text-ink flex items-center gap-3 px-4 py-2.5 transition-colors"
                    >
                      <Icon className="size-4 shrink-0" />
                      {provider.label}
                    </a>
                  </motion.li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={copyAddress}
              className="border-rule text-body-sm text-ink-secondary hover:bg-wash hover:text-ink flex w-full items-center gap-3 border-t px-4 py-2.5 text-left transition-colors"
            >
              {hasCopied ? (
                <Check size={16} strokeWidth={1.6} className="shrink-0" aria-hidden="true" />
              ) : (
                <Copy size={16} strokeWidth={1.6} className="shrink-0" aria-hidden="true" />
              )}
              {hasCopied ? 'Copied' : 'Copy address'}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
