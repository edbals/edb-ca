import type { ReactNode } from 'react'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export type KeyTone = 'primary' | 'secondary'
export type KeySize = 'md' | 'sm'

interface KeyStyle {
  /** Cap colours. */
  face: string
  /** The moulded edge beneath the cap, set as `--key-edge`. */
  edge: string
  /** The <GO> tag, which has to survive on that particular cap. */
  go: string
}

const TONES: Record<KeyTone, KeyStyle> = {
  /** The one action per view that actually goes somewhere. */
  primary: {
    face: 'bg-ink text-ink-inverse hover:bg-[#23262c]',
    edge: '#000000',
    // Phosphor green, the colour <GO> is on the real keyboard, and already
    // this site's terminal green rather than a new hue.
    go: 'text-term-fg',
  },
  /** Everything else: an unlit cap that firms up under the pointer. */
  secondary: {
    face: 'bg-paper text-ink border border-rule-strong hover:border-ink hover:bg-paper-raised',
    edge: 'var(--color-rule-strong)',
    go: 'text-accent',
  },
}

const SIZES: Record<KeySize, string> = { md: '', sm: 'key-sm' }

export interface ButtonLinkProps {
  href: string
  children: ReactNode
  tone?: KeyTone
  size?: KeySize
  external?: boolean
  /** Appends the <GO> tag. Reserve it for the primary action on a view. */
  command?: boolean
  className?: string
  'aria-label'?: string
}

/**
 * The only button on the site, modelled on a Bloomberg terminal key: mono
 * caps on a cap that depresses onto a moulded edge when pressed.
 *
 * Anchors rather than buttons, because every action here is navigation , a
 * résumé, a case study, an outbound tool.
 */
export function ButtonLink({
  href,
  children,
  tone = 'primary',
  size = 'md',
  external,
  command,
  className,
  ...rest
}: ButtonLinkProps) {
  const style = TONES[tone]

  return (
    <a
      href={href}
      {...externalLinkProps(external)}
      {...rest}
      style={{ ['--key-edge' as string]: style.edge }}
      className={cn('key', SIZES[size], style.face, className)}
    >
      {children}
      {command ? (
        <span aria-hidden="true" className={cn('key-go', style.go)}>
          &lt;GO&gt;
        </span>
      ) : null}
    </a>
  )
}

/**
 * The same key as a real `button`, for actions that are not navigation , the
 * menu toggle and the email provider picker. Kept here so the two can never
 * drift apart on padding, travel or edge colour.
 */
export function keyClassName({
  tone = 'secondary',
  size = 'md',
  className,
}: {
  tone?: KeyTone
  size?: KeySize
  className?: string
} = {}): string {
  return cn('key', SIZES[size], TONES[tone].face, className)
}

/** The inline style that carries the moulded edge colour for `keyClassName`. */
export function keyStyle(tone: KeyTone = 'secondary'): React.CSSProperties {
  return { ['--key-edge' as string]: TONES[tone].edge } as React.CSSProperties
}
