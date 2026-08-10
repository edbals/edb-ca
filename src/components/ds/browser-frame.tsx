'use client'

import { useState } from 'react'
import { Lock, RotateCw } from 'lucide-react'
import { SitePreview } from '@/components/ds/site-preview'
import { cn } from '@/lib/utils'

export interface BrowserFrameProps {
  src: string
  title: string
  /** Total height of the frame, chrome bar included, e.g. "h-[78vh]". */
  className?: string
}

const DOT_COUNT = 3

/** What a real address bar shows once a page has settled: no scheme, no
 *  trailing slash, nothing past the path. */
function displayUrl(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const path = pathname === '/' ? '' : pathname.replace(/\/$/, '')
    return `${hostname}${path}`
  } catch {
    return url
  }
}

/**
 * A quiet browser chrome around an embedded live tool, so the frame reads as
 * "a website, open" rather than a video sitting in a box. The address bar
 * also does real work: these are third party domains (vercel.app, not
 * edbert.ca), and naming that plainly beats letting a reader wonder what
 * they just navigated into.
 *
 * Flat rather than a literal recreation of browser UI: no boxed search-bar
 * pill, no fill on the dots, nothing raised. Quiet type and a hairline is
 * how the rest of the site marks anything as "furniture" rather than
 * content, so the toolbar follows the same rule instead of inventing its
 * own more decorative one. The traffic lights stay a single muted grey
 * rather than the familiar red/amber/green: everything here is ink on
 * paper, and three literal traffic-light colours would be the one
 * chromatic thing on the site.
 */
export function BrowserFrame({ src, title, className }: BrowserFrameProps) {
  const [reloadKey, setReloadKey] = useState(0)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="border-rule bg-paper-raised flex shrink-0 items-center gap-3 border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: DOT_COUNT }).map((_, index) => (
            <span
              key={index}
              className="border-ink-quaternary size-[5px] rounded-full border"
            />
          ))}
        </div>

        <div className="mx-auto flex min-w-0 max-w-[22rem] flex-1 items-center justify-center gap-1.5">
          <Lock
            size={10}
            strokeWidth={2}
            className="text-ink-quaternary shrink-0"
            aria-hidden="true"
          />
          <span className="mono-data text-ink-tertiary truncate text-[11px] leading-none">
            {displayUrl(src)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          aria-label="Reload the preview"
          className="text-ink-quaternary hover:text-ink -m-2 shrink-0 p-2 transition-colors"
        >
          <RotateCw size={12} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      {/* Remounted on refresh via `key`, which forces a fresh iframe (a new
          load, not just a repaint) and a fresh measurement pass. */}
      <SitePreview key={reloadKey} src={src} title={title} className="min-h-0 w-full flex-1" />
    </div>
  )
}
