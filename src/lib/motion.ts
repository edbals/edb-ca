/**
 * One motion vocabulary for the whole site.
 *
 * The curve matches `--ease-standard` in globals.css so a CSS transition and
 * a Motion animation on the same page cannot disagree about how things
 * settle. Everything decelerates hard: content arrives quickly and comes to
 * rest slowly, which reads as type being placed on a page rather than flown
 * onto it.
 */
export const EASE_STANDARD = [0.22, 1, 0.36, 1] as const
export const EASE_RULE = [0.65, 0, 0.35, 1] as const

/** Seconds. Longer than a UI transition: this is pacing, not feedback. */
export const DURATION_REVEAL = 0.9
export const DURATION_RULE = 1.1

/**
 * Where an element counts as "entered". Held slightly inside the bottom
 * edge so nothing animates while it is still half a line off screen, and
 * so a reader scrolling at speed sees the movement rather than arriving
 * after it finished.
 */
export const VIEWPORT_ONCE = { once: true, margin: '0px 0px -12% 0px' } as const

/** The span over which a scroll-linked element is tracked: from entering
 *  the bottom of the viewport to leaving the top. */
export const SCROLL_PASS = ['start end', 'end start'] as const
