import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface MediaFrameProps {
  children: ReactNode
  /** Locks the frame to a ratio. Omit when the content sets its own height. */
  aspect?: '16/10' | '4/3'
  /** Centres the content, for placeholder and link-out states. */
  center?: boolean
  className?: string
}

/**
 * The bordered, rounded surface that holds any artwork, screenshot, PDF or
 * embed on a subpage. One definition means the projects and the research
 * pages cannot drift apart on border, radius or ground colour.
 */
export function MediaFrame({ children, aspect, center = false, className }: MediaFrameProps) {
  return (
    <div
      className={cn(
        'border-rule bg-wash rounded-image w-full overflow-hidden border',
        aspect === '16/10' && 'aspect-[16/10]',
        aspect === '4/3' && 'aspect-[4/3]',
        center ? 'grid place-items-center' : 'relative',
        className,
      )}
    >
      {children}
    </div>
  )
}
