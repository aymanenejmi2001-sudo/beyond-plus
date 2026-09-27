/* ============================================================================
   BEYOND PLUS, colour swatches
   ----------------------------------------------------------------------------
   A single, shared resolver for the little colour chip shown next to a size
   selector or on a product card. Brand catalogues each name colours their own
   way, English, Italian, upper or lower case, sometimes a bare style code,
   so this matches on keywords rather than expecting an exact, curated list.

   Used by both ProductCard and SizeSelector; previously each kept its own
   copy of this table.
   ========================================================================= */

const KEYWORD_RULES: [RegExp, string][] = [
  [/off[\s-]?white|panna|ecru|ivory|cream/i, "#f3ede1"],
  [/bianco|^white$|\bwhite\b/i, "#f2f2f2"],
  [/nero|^black$|\bblack\b|antracite/i, "#161616"],
  [/denim|jean/i, "#3c5a8c"],
  [/navy|night[\s-]?blue|blu\b/i, "#1f2a44"],
  [/light[\s-]?blue|sky/i, "#a9c2d9"],
  [/^blue$|azzurro/i, "#3c5a8c"],
  [/khaki|olive/i, "#5c5a3a"],
  [/chocolate|dark[\s-]?coffee|moro|coffee/i, "#4a3527"],
  [/tan\b/i, "#b98454"],
  [/sand|sabbia|beige/i, "#cbbba0"],
  [/brown/i, "#6b4c39"],
  [/rame|copper/i, "#a86a45"],
  [/bordeaux|wine|burgundy/i, "#5c1f27"],
  [/rosa|pink|butter[\s-]?yellow/i, "#d8a7ae"],
  [/orange/i, "#c26234"],
  [/dark[\s-]?grey|dark[\s-]?steel/i, "#5c5f63"],
  [/gr[ae]y/i, "#8d8d8d"],
  [/silver/i, "#c6c8ca"],
  [/gold(en)?/i, "#b08a3e"],
  [/green/i, "#4b5a3a"],
  [/red\b/i, "#8c2f2a"],
];

// Bare style codes ("VARIANTE 1", "UNICA"…) carry no colour meaning — give
// each a distinct, deterministic neutral tone rather than one flat grey, so
// a multi-colour option group still reads as a set of choices.
const NEUTRAL_TONES = ["#d8d3c8", "#c9c2b4", "#b9b0a0", "#a89e8c", "#e0dcd2"];

function hashIndex(value: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
  return h % mod;
}

/** Resolves a variant colour name (any case, any brand's own vocabulary) to a swatch colour. */
export function swatchColor(name: string): string {
  for (const [re, color] of KEYWORD_RULES) {
    if (re.test(name)) return color;
  }
  return NEUTRAL_TONES[hashIndex(name, NEUTRAL_TONES.length)];
}
