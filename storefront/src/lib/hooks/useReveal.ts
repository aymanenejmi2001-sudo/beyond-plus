"use client";

import { useEffect } from "react";

/**
 * Drives the "Seuil" reveal. One shared IntersectionObserver for the whole
 * document — cheaper than one per element — which flips `data-inview` on any
 * `[data-reveal]` node. All the motion lives in CSS (see base.css), so nothing
 * animates on the main thread and nothing runs on the scroll path.
 *
 * The hidden states are gated behind `[data-reveal-ready]` on <html>, set here.
 * Until this effect runs, content renders in its final state — so a failed or
 * blocked script can never leave the page blank.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.setAttribute("data-inview", "true"));
    };

    if (typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return;
    }

    // Anything already on screen at mount is shown without animating in, so the
    // first viewport is never withheld from the visitor.
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) {
        el.setAttribute("data-inview", "true");
      }
    });

    root.setAttribute("data-reveal-ready", "");

    // Observed node → the [data-reveal] elements it releases.
    const pending = new Map<Element, Set<HTMLElement>>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          pending.get(entry.target)?.forEach((el) => el.setAttribute("data-inview", "true"));
          pending.delete(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 },
    );

    const scan = () => {
      for (const target of pending.keys()) {
        if (!target.isConnected) {
          observer.unobserve(target);
          pending.delete(target);
        }
      }
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-inview])")
        .forEach((el) => {
          // A closed frame is clipped to zero area, which the observer counts as
          // never intersecting — so watch its unclipped parent instead.
          const target =
            el.dataset.reveal === "frame" && el.parentElement ? el.parentElement : el;
          let group = pending.get(target);
          if (!group) {
            group = new Set();
            pending.set(target, group);
            observer.observe(target);
          }
          group.add(el);
        });
    };

    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });

    // Last-resort guarantee: if anything is still hidden well after load,
    // show it. Content visibility never depends on a callback arriving.
    const safety = window.setTimeout(revealAll, 4000);

    return () => {
      observer.disconnect();
      mutation.disconnect();
      window.clearTimeout(safety);
      root.removeAttribute("data-reveal-ready");
    };
  }, []);
}
