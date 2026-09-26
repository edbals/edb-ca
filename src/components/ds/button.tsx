import type { ReactNode } from 'react'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

export type KeyTone = 'primary' | 'secondary' | 'sector' | 'linkedin'
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
  /** Section keys, unlit until touched: a near-black cap with bone type that
   *  lights amber under the pointer. The latched key stays lit, so the section
   *  you are in is the one glowing rather than merely the one held down. */
  sector: {
    face: 'bg-[#0f1113] text-[#e8e6e1] border border-[#2a2e35] hover:bg-[#1a1d22] hover:text-key-amber',
    edge: '#000000',
    go: 'text-key-amber',
  },
  /** The link out, in the network's own blue. */
  linkedin: {
    face: 'bg-key-linkedin text-white hover:bg-key-linkedin-hover',
    edge: 'var(--color-key-linkedin-edge)',
    go: 'text-white',
  },
}

const SIZES: Record<KeySize, string> = { md: '', sm: 'key-sm' }

/**
 * The command tag. Split out so a key that isn't a `ButtonLink` — the email
 * menu's trigger is a real button — renders the identical mark rather than
 * an approximation of it.
 */
export function KeyGo({ tone = 'primary' }: { tone?: KeyTone }) {
  return (
    <span aria-hidden="true" className={cn('key-go', TONES[tone].go)}>
      &lt;GO&gt;
    </span>
  )
}

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
      {command ? <KeyGo tone={tone} /> : null}
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
