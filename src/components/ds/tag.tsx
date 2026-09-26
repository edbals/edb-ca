import { cn } from '@/lib/utils'

export interface TagProps {
  children: string
  /** Quiet variant for anything that isn't a category, e.g. an outlet. */
  tone?: 'accent' | 'plain'
  className?: string
}

/**
 * The category chip. One accent rather than a colour per category: six hues
 * would turn an index into a legend the reader has to learn, and the category
 * word already says what the piece is.
 */
export function Tag({ children, tone = 'accent', className }: TagProps) {
  return (
    <span
      className={cn(
        'micro rounded-tag inline-block px-2 py-[3px]',
        tone === 'accent' ? 'bg-accent-soft text-accent' : 'bg-wash text-ink-secondary',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function TagList({
  items,
  className,
}: {
  items: readonly string[]
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => (
        <Tag key={item}>{item}</Tag>
      ))}
    </div>
  )
}
