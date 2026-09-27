// Clean model / colorway from a supplier title, and the display title.
// "Air Jordan 1 Mid Triple White" + model "Air Jordan 1" → colorway "Mid Triple White"
// "On Cloudtilt Eclipse Cinder" + model "" → model "Cloudtilt", colorway "Eclipse Cinder"

const PREFIX = /^(nike|air jordan|jordan|adidas( originals)?|asics|new balance|puma|vans|salomon|saucony|mizuno|on( running)?|converse|hoka)\s+/i;
const bare = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

export function namesFromTitle(title: string, familyModel: string): { model: string; colorway: string } {
  let t = title.replace(/[“”"«»]/g, " ").replace(/\s+/g, " ").trim();
  t = t.replace(PREFIX, "").replace(PREFIX, "").trim();
  let words = t.split(" ").filter(Boolean);
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
