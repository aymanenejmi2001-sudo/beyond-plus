import type { ColorFamily, Gender } from "../types.ts";

const has = (s: string, ...words: string[]) => words.some((w) => new RegExp(`\\b${w}`, "i").test(s));

/** Colour family from a colorway string, checked in BEYOND PLUS priority order. */
export function colorFamily(colorway: string): ColorFamily {
  const c = colorway.toLowerCase();
  const silver = has(c, "silver", "metallic", "chrome", "platinum", "argent");
  const white = has(c, "white", "blanc", "sail", "summit");
  const black = has(c, "black", "noir", "phantom");
  if (has(c, "pink", "rose") && (silver || white)) return "pink-silver";
  if (silver && white) return "silver-white";
  if (black && silver) return "black-silver";
  if (black && white) return "black-white";
  if (has(c, "cream", "beige", "off[- ]?white", "sand", "oyster", "ivory", "birch", "bone", "khaki", "gum", "wonder white", "linen")) return "cream";
  if (has(c, "grey", "gray", "smoke", "slate", "steel")) return "grey";
  if (has(c, "brown", "mocha", "earth", "tan", "chocolate", "clay", "cinder")) return "brown";
  if (has(c, "burgundy", "bordeaux", "maroon", "wine", "team red", "cardinal")) return "burgundy";
  if (has(c, "red", "crimson") && white) return "red-white";
  if (silver) return "silver-white";
  if (black) return "black-white";
  if (white) return "silver-white";
  return "statement";
}

export const COLOR_LABEL: Record<ColorFamily, string> = {
  "silver-white": "Argent / Blanc", "black-silver": "Noir / Argent", "black-white": "Noir / Blanc",
  cream: "Crème / Beige", grey: "Gris", brown: "Marron / Terre", burgundy: "Bordeaux",
  "red-white": "Rouge / Blanc", "pink-silver": "Rose / Argent", statement: "Statement",
};

/** Gender from the supplier size run: 35–40 → women, 40+ only → men. */
export function genderFromSizes(sizes: string[]): Gender {
  const n = sizes.map(Number).filter((x) => !Number.isNaN(x));
  if (!n.length) return "unisex";
  const min = Math.min(...n), max = Math.max(...n);
  if (max <= 40) return "women";
  if (min >= 40) return "men";
  return "unisex";
}

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
