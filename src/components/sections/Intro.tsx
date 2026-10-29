'use client'

import { useEffect, useRef, useState } from 'react'

/** Set once the intro has played, so a returning visitor goes straight in. */
export const INTRO_SEEN_KEY = 'edb-intro-seen'

/**
 * Runs before first paint, from the document head. It decides whether the
 * intro plays (first visit, home page, motion allowed) and, if so, marks the
 * root so the page is covered from the very first frame. Deciding later, on
 * hydration, would flash the homepage and then cover it.
 */
export const INTRO_GATE_SCRIPT = `(function(){try{if(location.pathname!=='/')return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;if(localStorage.getItem('${INTRO_SEEN_KEY}'))return;document.documentElement.dataset.intro='play'}catch(e){}})()`

interface IntroMessage {
  source: 'edb-intro'
  type: 'handoff' | 'done' | 'skip'
  x?: number
  y?: number
}

function isIntroMessage(data: unknown): data is IntroMessage {
  return typeof data === 'object' && data !== null && (data as IntroMessage).source === 'edb-intro'
}

/**
 * The B Terminal intro, laid over the real homepage.
 *
 * The intro itself is a standalone page in public/intro (a rendered video of
 * the desk, then the terminal), loaded in a frame so none of its styles or
 * scripts touch the site. It ends by asking the host to take over: the frame
 * fades while the page settles in from the point the pointer clicked, so the
 * visitor lands on the live page, not a picture of it.
 */
export function Intro() {
  const [playing, setPlaying] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (document.documentElement.dataset.intro !== 'play') return
    // The gate script ran before React did; this only mirrors its decision.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(true)
  }, [])

  useEffect(() => {
    if (!playing) return
    const root = document.documentElement
    const main = document.body

    const close = () => {
      try {
        localStorage.setItem(INTRO_SEEN_KEY, '1')
      } catch {
        // Private windows can refuse storage; the intro just plays again.
      }
      delete root.dataset.intro
      setPlaying(false)
    }

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || !isIntroMessage(event.data)) return
      const { type, x = 0.5, y = 0.5 } = event.data

      if (type === 'skip' || type === 'done') {
        close()
        return
      }

      // Handoff: the terminal is leaning in and fading inside the frame.
      // Once its ground has gone white, fade the frame itself and let the
      // page arrive from the click point.
      const ease = 'cubic-bezier(.2,.7,.2,1)'
      // The frame is still opaque here, so the cover can go: what the frame
      // fades to from now on is the page itself.
      delete root.dataset.intro
      main.style.transformOrigin = `${x * innerWidth}px ${y * innerHeight}px`
      frame.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 650,
        delay: 760,
        easing: ease,
        fill: 'forwards',
      })
      main.animate([{ transform: 'scale(1.035)' }, { transform: 'none' }], {
        duration: 700,
        delay: 720,
        easing: ease,
      })
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [playing])

  if (!playing) return null

  return (
    <iframe
      ref={frame}
      src="/intro/index.html"
      title="Intro"
      className="fixed inset-0 z-[100] h-full w-full border-0 bg-[#06080a]"
      // Focus goes to the frame so a key press there can skip the intro.
      onLoad={() => frame.current?.focus()}
    />
  )
}
