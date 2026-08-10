'use client'

import { useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

export interface TiltFrameProps {
  children: ReactNode
  className?: string
}

/** Degrees at the very edge of the frame. Kept small enough to read as the
 *  surface catching the light rather than as a card being picked up. */
const MAX_TILT_DEG = 2.5

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 } as const

/**
 * A pointer-aware tilt, capped tight enough to stay credible on a finance
 * portfolio: the frame leans a couple of degrees toward the cursor and
 * springs flat on exit, the way a printed card catches the light rather
 * than a UI card being picked up. No shadow is added, so the illusion
 * relies entirely on the rotation itself.
 *
 * Skipped outright under reduced motion, and inert on touch, since a
 * `mousemove` that never fires just means the transform never leaves zero.
 */
export function TiltFrame({ children, className }: TiltFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(pointerX, SPRING)
  const rotateX = useSpring(pointerY, SPRING)

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5
    pointerX.set(relativeX * MAX_TILT_DEG * 2)
    pointerY.set(relativeY * -MAX_TILT_DEG * 2)
  }

  function resetTilt() {
    pointerX.set(0)
    pointerY.set(0)
  }

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className={cn('[perspective:1200px]', className)}
    >
      <motion.div style={{ rotateX, rotateY }} className="size-full">
        {children}
      </motion.div>
    </div>
  )
}
