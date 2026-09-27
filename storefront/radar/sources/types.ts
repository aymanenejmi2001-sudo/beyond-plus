// Every signal source is an adapter with an explicit integration mode.
// MANUAL = no legitimate API or structured public source: the admin enters
// observations (with their source URL) in /admin/radar. Nothing here scrapes
// behind a login, CAPTCHA, Cloudflare challenge or against a site's terms.

import type { Dimension, Reliability } from "../lib/types.ts";

export type Mode = "AUTOMATED" | "PARTIAL" | "MANUAL";

export interface SourceAdapter {
  id: string;
  label: string;
  mode: Mode;
  dimension: Dimension | "supplier" | "identity" | "first-party";
  reliability: Reliability;
  /** What to enter and how to normalize it to 0–100 when MANUAL. */
  howTo: string;
  /** Why it is not automated (or what is automated). */
  why: string;
}
