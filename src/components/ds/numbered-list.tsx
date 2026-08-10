import { cn } from '@/lib/utils'

export interface NumberedListProps {
  items: readonly string[]
  /** Two up on wider screens. Suits long lists like a feature inventory. */
  columns?: boolean
  /** Hairline between items. Off reads better for short conclusion lists. */
  divided?: boolean
  className?: string
}

/**
 * A numbered list rather than a flat run of dashes. Each item is indexed in
 * mono, so a skimming reader can count and scan them instead of reading a
 * grey block top to bottom.
 */
export function NumberedList({
  items,
  columns = false,
  divided = true,
  className,
}: NumberedListProps) {
  return (
    <ol className={cn('grid gap-x-8', columns && 'sm:grid-cols-2', !divided && 'gap-y-3.5', className)}>
      {items.map((item, index) => (
        <li
          key={item}
          className={cn(
            'flex gap-4',
            divided &&
              'border-rule border-t py-3.5 first:border-t-0 first:pt-0 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(2)]:pt-0',
          )}
        >
          <span className="mono-data text-ink-quaternary pt-[0.25em] text-[11px]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-body-sm text-ink-secondary">{item}</span>
        </li>
      ))}
    </ol>
  )
}
