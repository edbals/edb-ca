'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { DURATION_REVEAL, EASE_STANDARD, VIEWPORT_ONCE } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface TypeSetProps {
  children: ReactNode
  /**
   * The tracking the type rests at, which must match the size token in use:
   * heading-lg is -0.015em, heading is -0.01em, display is -0.02em. Passed
   * rather than measured so nothing depends on reading computed styles.
   */
  tracking?: string
  delay?: number
  className?: string
}

/** Where the letters start: loose, as if not yet set. */
const OPEN_TRACKING = '0.24em'

/**
 * Type that sets itself.
 *
 * The line arrives with its letters spaced wide and draws them in to the
 * tracking it rests at, the way metal type is composed into a line and then
 * locked up. Nothing moves across the page and nothing fades from blur, so
 * it reads as the words resolving rather than as an entrance.
 *
 * Deliberately reserved for section titles. Used on body copy it would be
 * unreadable mid-flight, and used everywhere it would stop being a device
 * and become a tic.
 */
export function TypeSet({
  children,
  tracking = '-0.015em',
  delay = 0,
  className,
}: TypeSetProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      initial={{ letterSpacing: OPEN_TRACKING, opacity: 0 }}
      whileInView={{ letterSpacing: tracking, opacity: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={{
        letterSpacing: { duration: DURATION_REVEAL * 1.35, ease: EASE_STANDARD, delay },
        opacity: { duration: DURATION_REVEAL * 0.7, ease: 'linear', delay },
      }}
    >
      {children}
    </motion.span>
  )
}
