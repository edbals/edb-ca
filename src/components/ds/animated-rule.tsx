'use client'

import { motion, useReducedMotion } from 'motion/react'
import { DURATION_RULE, EASE_RULE, VIEWPORT_ONCE } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface AnimatedRuleProps {
  /** Which margin the stroke starts from. */
  from?: 'left' | 'right'
  delay?: number
  className?: string
}

/**
 * A hairline that draws itself.
 *
 * Every division on this site is a rule rather than a box or a shadow, so
 * the rules are the structure. Having them stroke in from the margin means
 * the page assembles along its own grid instead of having content fade in
 * over a layout that was already finished.
 *
 * Uses a symmetric curve, not the settling one: a rule should read as a
 * single drawn stroke, with no arrival.
 */
export function AnimatedRule({ from = 'left', delay = 0, className }: AnimatedRuleProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        'bg-rule h-px w-full',
        from === 'left' ? 'origin-left' : 'origin-right',
        className,
      )}
      initial={prefersReducedMotion ? { scaleX: 1 } : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT_ONCE}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: DURATION_RULE, ease: EASE_RULE, delay }
      }
    />
  )
}
