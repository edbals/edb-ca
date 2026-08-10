/**
 * Props that open a link in a new tab safely. `noopener` is what stops the
 * opened page from reaching back into this one via `window.opener`.
 *
 * Kept in one place so every component that can render an outbound link
 * agrees on the behaviour, rather than each one repeating the attributes
 * and drifting apart.
 */
export const EXTERNAL_LINK_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const

/** Spread onto an anchor: yields the new-tab props only when `external`. */
export function externalLinkProps(external?: boolean) {
  return external ? EXTERNAL_LINK_PROPS : {}
}
