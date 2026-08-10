"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  delay?: number;
  className?: string;
  children: ReactNode;
}

const REVEAL_THRESHOLD = 0.12;
const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";

/**
 * Content rises and settles as it enters the viewport, the way Apple brings
 * sections onto the page. Reveals once, then stops watching.
 *
 * The hidden starting state is a progressive enhancement, never a gate on the
 * content. Three things guarantee it always resolves:
 *   - no IntersectionObserver at all → reveal immediately;
 *   - already at or above the fold on mount (including when hydration lands
 *     after the reader scrolled past) → reveal immediately;
 *   - a scroll safety net, because an instant jump , End, or a nav anchor ,
 *     can carry an element from below the fold to above it without ever
 *     crossing the observer's threshold.
 * With scripting off, the stylesheet in the document head forces every
 * `.reveal` visible. Reduced motion drops the travel via globals.css.
 */
export function Reveal({ delay = 0, className = "", children }: RevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const hasReachedViewport = () => element.getBoundingClientRect().top < window.innerHeight;

    if (hasReachedViewport()) {
      setIsVisible(true);
      return;
    }

    let frame = 0;

    const cleanup = () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };

    const reveal = () => {
      setIsVisible(true);
      cleanup();
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (hasReachedViewport()) {
          reveal();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        }
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN },
    );

    observer.observe(element);
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, []);

  return (
    <div
      ref={elementRef}
      className={`reveal ${className}`}
      data-revealed={isVisible ? "true" : "false"}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translate3d(0, 22px, 0)",
        transition: `opacity 0.9s var(--ease-standard) ${delay}ms, transform 0.9s var(--ease-standard) ${delay}ms`,
        willChange: isVisible ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
