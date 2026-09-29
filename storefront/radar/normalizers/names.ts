// Clean brand / model / colorway from a supplier title, and the display title.
// "Air Jordan 1 Mid Triple White" + model "Air Jordan 1" → colorway "Mid Triple White"
// "On Cloudtilt Eclipse Cinder" + model "" → model "Cloudtilt", colorway "Eclipse Cinder"
// "Balenciaga Track Lilac" (no manifest family) → brand "Balenciaga", model "Track", colorway "Lilac"

const PREFIX = /^(nike|air jordan|jordan|adidas( originals)?|asics|new balance|puma|vans|salomon|saucony|mizuno|on( running)?|converse|hoka|balenciaga|alexander mcqueen|yeezy)\s+/i;
const bare = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clean = (t: string) => t.replace(/[“”"«»]/g, " ").replace(/\s+/g, " ").trim();

const BRAND_RULES: [RegExp, string][] = [
  [/^(air )?jordan\b|^aj\d/i, "Jordan"], [/^(nike|air (max|force)|dunk|blazer|zoomx|zoom|p-?6000|vomero|cortez|shox)\b/i, "Nike"],
  [/^new balance\b/i, "New Balance"], [/^adidas\b|^yeezy\b/i, "adidas"], [/^asics\b/i, "ASICS"], [/^puma\b/i, "PUMA"], [/^vans\b/i, "Vans"],
  [/^converse\b/i, "Converse"], [/^on\b/i, "On"], [/^salomon\b/i, "Salomon"], [/^balenciaga\b/i, "Balenciaga"], [/^alexander mcqueen\b/i, "Alexander McQueen"],
];

/** Brand from a supplier title (manifest families give it directly). */
export function brandOf(title: string): string {
  const t = clean(title);
  return BRAND_RULES.find(([rx]) => rx.test(t))?.[1] ?? t.split(" ")[0];
}

/** Outside the manifest: the first words that name the silhouette ("Dunk Low", "Air Max 90", "Track"). */
export function guessModel(title: string, brand: string): string {
  const words = clean(title).replace(PREFIX, "").replace(new RegExp(`^${esc(brand)}\\s+`, "i"), "").split(" ").filter(Boolean);
  const n = /^\d|^[IVX]+$/.test(words[2] ?? "") ? 3 : 2; // "Air Max 90" · "Mind 002" · "Dunk Low"
  return words.slice(0, Math.max(1, Math.min(n, words.length - 1))).join(" ");
}

export function namesFromTitle(title: string, familyModel: string, brand?: string): { model: string; colorway: string } {
  let t = clean(title);
  if (brand) t = t.replace(new RegExp(`^${esc(brand)}\\s+`, "i"), "");
  t = t.replace(PREFIX, "").replace(PREFIX, "").trim();
  const words = t.split(" ").filter(Boolean);
  let model = familyModel;
  if (!familyModel) {
    model = (words.shift() ?? "").replace(/^\w/, (c) => c.toUpperCase());
  } else {
    const tokens = new Set([...familyModel.split(/\s+/), ...familyModel.split(/[\s-]+/)].map(bare));
    while (words.length && tokens.has(bare(words[0]))) words.shift();
  }
  const colorway = words.join(" ").replace(/^[\s\-/|]+|[\s\-/|]+$/g, "").trim();
  return { model, colorway: colorway || "Original" };
}

export function displayTitle(brand: string, model: string, colorway: string | null) {
  const b = brand.toLowerCase();
  const withBrand = model.toLowerCase().startsWith(b) || (b === "jordan" && /jordan/i.test(model)) ? model : `${brand} ${model}`;
  return [withBrand, colorway && colorway !== "Original" ? colorway : ""].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
