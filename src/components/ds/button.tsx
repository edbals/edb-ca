import type { ReactNode } from 'react'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export type ButtonTone = 'solid' | 'ghost'

export interface ButtonLinkProps {
  href: string
  children: ReactNode
  tone?: ButtonTone
  external?: boolean
  className?: string
  'aria-label'?: string
}

const TONES: Record<ButtonTone, string> = {
  /** The one primary action per view. Goes accent on hover. */
  solid: 'bg-ink text-ink-inverse hover:bg-accent',
  /** Everything secondary: a hairline that firms up on hover. */
  ghost: 'border border-rule-strong text-ink hover:border-ink',
}

/**
 * The only button on the site. Anchors rather than buttons, because every
 * action here is navigation , a résumé, a case study, an outbound tool.
 */
export function ButtonLink({
  href,
  children,
  tone = 'solid',
  external,
  className,
  ...rest
}: ButtonLinkProps) {
  return (
    <a
      href={href}
      {...externalLinkProps(external)}
      {...rest}
      className={cn(
        'micro rounded-button inline-flex items-center gap-2 px-4 py-2 transition-colors',
        TONES[tone],
        className,
      )}
    >
      {children}
    </a>
  )
}
