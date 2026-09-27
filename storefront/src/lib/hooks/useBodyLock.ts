"use client";

import { useEffect } from "react";

let locks = 0;

/** Reference-counted scroll lock so nested overlays can't unlock each other. */
export function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const { body } = document;
    if (locks === 1) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.dataset.locked = "true";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }
    return () => {
      locks -= 1;
      if (locks === 0) {
        delete body.dataset.locked;
        body.style.paddingRight = "";
      }
    };
  }, [active]);
}
