import { Archivo, Syne } from "next/font/google";

/**
 * Zenith's exact pairing: Syne for display, Archivo for UI and body.
 * Both are self-hosted by next/font (no render-blocking Google request,
 * no layout shift — the fallback metrics are matched automatically).
 */
export const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-syne",
  display: "swap",
});

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
  display: "swap",
});
