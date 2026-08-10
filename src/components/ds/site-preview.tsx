'use client'

import { useEffect, useRef, useState } from 'react'

export interface SitePreviewProps {
  src: string
  title: string
  className?: string
}

/** The logical viewport the embedded site is rendered at, in CSS pixels. */
const VIEWPORT_WIDTH = 1440

interface Box {
  width: number
  height: number
}

/**
 * An embedded site rendered at a desktop viewport and scaled to fit.
 *
 * A plain iframe lays the site out at the frame's own width. Beside an open
 * document panel that is roughly 650px, so the site drops into its tablet
 * breakpoint and every element arrives oversized: the reader sees a zoomed
 * in fragment rather than the page. Rendering at a fixed 1440 and scaling
 * the result down shows the real desktop layout, the same way a thumbnail
 * of a page looks like the page.
 */
export function SitePreview({ src, title, className }: SitePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<Box | null>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      // A collapsed box would divide the frame height by zero. Wait for a
      // real measurement rather than painting an infinitely tall iframe.
      if (width > 0 && height > 0) setBox({ width, height })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  // Never scale up: past 1440 the frame simply is a desktop viewport.
  const scale = box ? Math.min(box.width / VIEWPORT_WIDTH, 1) : 1
  const frameWidth = box && scale < 1 ? VIEWPORT_WIDTH : (box?.width ?? 0)
  const frameHeight = box ? box.height / scale : 0

  return (
    <div ref={containerRef} className={className}>
      {/* Held back until the container has been measured, so the frame is
          never briefly painted at the wrong scale and never loads twice. */}
      {box ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          style={{
            width: frameWidth,
            height: frameHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            border: 0,
          }}
        />
      ) : null}
    </div>
  )
}
