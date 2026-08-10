import type { ReactNode } from 'react'

export interface DrawnUnderlineProps {
  children: ReactNode
}

/**
 * Wraps inline text with a hairline that draws in from the left on
 * `group-hover` rather than simply switching color, the same device as
 * `AnimatedRule`, at hover speed instead of scroll speed. The parent link
 * or card must carry the `group` class.
 */
export function DrawnUnderline({ children }: DrawnUnderlineProps) {
  return (
    <span className="relative inline-block pb-0.5">
      {children}
      <span
        aria-hidden="true"
        className="bg-ink absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
    </span>
  )
}
