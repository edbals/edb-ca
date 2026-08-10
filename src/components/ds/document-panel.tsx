'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface DocumentPanelProps {
  /** The document itself: a PDF frame, an embed, or a fallback panel. */
  document: ReactNode
  /** The written analysis that slides in beside it. */
  children: ReactNode
  /** Label for the toggle, e.g. "Analysis". */
  label?: string
  className?: string
}

const PANEL_WIDTH = 'min(30rem, 42vw)'
const SPRING = { type: 'spring', bounce: 0, duration: 0.55 } as const

/**
 * The document leads and the writing sits beside it in a panel that can be
 * pulled closed, so the reader chooses which one has the floor. Collapsed,
 * the document takes the full width for actually reading it; open, the
 * analysis runs alongside without the reader losing their place.
 *
 * Below `lg` the panel stops being a panel: the two simply stack, since a
 * drawer over a narrow screen would cover the thing it is annotating.
 */
export function DocumentPanel({
  document,
  children,
  label = 'Analysis',
  className,
}: DocumentPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  const Icon = isOpen ? PanelRightClose : PanelRightOpen

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="micro border-rule text-ink-secondary hover:border-ink hover:text-ink hidden items-center gap-2 rounded-pill border px-4 py-2 transition-colors lg:inline-flex"
        >
          {/* The glyph itself swings shut rather than swapping instantly,
              so the icon reads as the panel's own hinge. */}
          <span className="relative grid size-3.5 place-items-center overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? 'open' : 'closed'}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: -35 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 35 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: 'easeOut' }}
                className="absolute inset-0 grid place-items-center"
              >
                <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
              </motion.span>
            </AnimatePresence>
          </span>
          {isOpen ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        </button>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-0">
        <div className="min-w-0 flex-1">{document}</div>

        {/* Width, not display, carries the animation: the panel keeps its
            contents mounted so the reader's scroll position survives a
            close and reopen. */}
        <motion.aside
          animate={{
            width: isOpen ? PANEL_WIDTH : '0rem',
            opacity: isOpen ? 1 : 0,
          }}
          initial={false}
          transition={prefersReducedMotion ? { duration: 0 } : SPRING}
          aria-hidden={!isOpen}
          className="hidden shrink-0 overflow-hidden lg:block"
        >
          <div className="border-rule pl-10 lg:border-l" style={{ width: PANEL_WIDTH }}>
            {children}
          </div>
        </motion.aside>

        {/* Stacked, always present, on anything narrower than lg. */}
        <div className="lg:hidden">{children}</div>
      </div>
    </div>
  )
}
