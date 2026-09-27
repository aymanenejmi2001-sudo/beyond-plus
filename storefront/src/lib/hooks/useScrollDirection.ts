"use client";

import { useEffect, useState } from "react";

export interface ScrollState {
  /** true once the page has scrolled past the hero-overlap threshold */
  scrolled: boolean;
  /** true while scrolling down — Zenith slides the sticky header away */
  hidden: boolean;
  y: number;
}

/**
 * Zenith's sticky header behaviour: transparent over the hero, solid once
 * scrolled, and it retracts on downward scroll / returns on upward scroll.
 * Reads are rAF-throttled and passive so scrolling stays at 60fps.
 */
export function useScrollDirection(threshold = 24): ScrollState {
  const [state, setState] = useState<ScrollState>({ scrolled: false, hidden: false, y: 0 });

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const delta = y - last;
      setState((prev) => {
        const scrolled = y > threshold;
        // ignore sub-pixel jitter and the rubber-band zone at the very top
        const hidden = y < 160 ? false : delta > 4 ? true : delta < -4 ? false : prev.hidden;
        if (prev.scrolled === scrolled && prev.hidden === hidden) return prev;
        return { scrolled, hidden, y };
      });
      last = y;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}
