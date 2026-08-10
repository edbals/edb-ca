import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type TagVariant = 'outline' | 'solid' | 'plain'

export interface TagProps {
  children: ReactNode
  variant?: TagVariant
  className?: string
}

/**
 * Metadata label. `plain` is the default list-row treatment (no chrome),
 * `outline` is the pill used inside image tiles and project rows.
 */
export function Tag({ children, variant = 'outline', className }: TagProps) {
  return (
    <span
      className={cn(
        'micro inline-flex items-center whitespace-nowrap',
        variant === 'outline' &&
          'rounded-pill border border-rule-strong px-2.5 py-1 text-ink-secondary',
        variant === 'solid' && 'rounded-pill bg-ink px-2.5 py-1 text-ink-inverse',
        variant === 'plain' && 'text-ink-tertiary',
        className,
      )}
    >
      {children}
    </span>
  )
}

export interface TagListProps {
  items: readonly string[]
  variant?: TagVariant
  className?: string
}

export function TagList({ items, variant = 'outline', className }: TagListProps) {
  if (items.length === 0) return null
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-2 gap-y-2', className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag variant={variant}>{item}</Tag>
        </li>
      ))}
    </ul>
  )
}
