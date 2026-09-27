"use client";

import { useReveal } from "@/lib/hooks/useReveal";

/** Mounts the single document-wide scroll-reveal observer. Renders nothing. */
export function RevealRoot() {
  useReveal();
  return null;
}
