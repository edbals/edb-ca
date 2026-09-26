import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const DOT_COUNT = 3

export interface TerminalProps {
  /** Shown in the title bar, e.g. "~/research". */
  path: string
  children: ReactNode
  className?: string
}

/** A prompt line. `command` is the typed part, set in the bright phosphor. */
export function TerminalCommand({
  command,
  className,
}: {
  command: string
  className?: string
}) {
  return (
    <p className={cn('text-term-dim whitespace-nowrap', className)}>
      <span aria-hidden="true" className="text-term-faint select-none">
        ${' '}
      </span>
      <span className="text-term-fg">{command}</span>
    </p>
  )
}

/** The trailing prompt with a blinking caret, as a live shell would sit. */
export function TerminalPrompt({ className }: { className?: string }) {
  return (
    <p className={cn('text-term-faint', className)} aria-hidden="true">
      $ <span className="caret align-[-0.16em]" />
    </p>
  )
}

/**
 * A terminal window. Used for the research index, where the content is a list
 * of files with categories and dates , which is what a shell is already good
 * at showing, and what six thumbnail cards were bad at.
 */
export function Terminal({ path, children, className }: TerminalProps) {
  return (
    <div
      className={cn(
        'bg-term rounded-panel overflow-hidden shadow-[0_1px_3px_rgb(22_24_29/0.2),0_18px_44px_-28px_rgb(22_24_29/0.5)]',
        className,
      )}
    >
      <div className="bg-term-raised border-term-rule flex items-center gap-2.5 border-b px-3.5 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: DOT_COUNT }).map((_, index) => (
            <span key={index} className="rounded-round block size-[9px] bg-[#3a4147]" />
          ))}
        </div>
        <span className="mono-data text-term-dim ml-1 text-xs">{path}</span>
      </div>

      <div className="mono-data overflow-x-auto px-3.5 pt-4.5 pb-5 text-[0.8125rem] leading-normal md:px-5 md:pb-5.5">
        {children}
      </div>
    </div>
  )
}
