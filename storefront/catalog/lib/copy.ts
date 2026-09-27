// Original BEYOND PLUS copy. Written here, never taken from a source.
import type { ColorFamily, StyleFamily } from "../types.ts";

const STYLE: Record<StyleFamily, { lines: string[]; wear: string }> = {
  "low-profile": { lines: ["Silhouette basse, ligne fine.", "Au ras du sol, sans effort.", "Profil bas, allure nette."], wear: "Avec un pantalon large ou une jupe longue, elle laisse la tenue parler." },
  "retro-runner": { lines: ["Le running d’archive, remis en ville.", "Une runner rétro, technique juste ce qu’il faut.", "Mesh, overlays, semelle marquée : l’archive running."], wear: "Se porte avec un baggy, un short ou un tailleur trop grand." },
  "y2k-runner": { lines: ["L’énergie des années 2000, en version quotidienne.", "Reflets, volumes, esprit Y2K.", "Une runner chargée, qui assume."], wear: "À associer à des pièces simples pour laisser la paire au centre." },
  skate: { lines: ["La base skate, intemporelle.", "Toile, daim, semelle gaufrée : l’essentiel.", "Simple, solide, toujours juste."], wear: "Va avec tout, du denim brut au pantalon de costume." },
  "basketball-retro": { lines: ["Un classique du parquet, devenu culte.", "L’héritage basket, sans nostalgie forcée.", "Une silhouette qui a fait la culture sneaker."], wear: "Laisse-la respirer : pantalon droit, haut sobre." },
  terrace: { lines: ["L’esprit terrace, cuir et gomme.", "La silhouette des tribunes, devenue uniforme.", "Plate, souple, facile."], wear: "Avec un jean droit, un survêtement ou une jupe midi." },
  racing: { lines: ["Inspirée du sport auto, taillée fine.", "Une ligne racing, basse et précise."], wear: "Idéale avec des coupes ajustées ou un pantalon cigarette." },
  technical: { lines: ["Technique d’abord, style ensuite, ou l’inverse.", "Une paire outdoor pensée pour la ville.", "Structure, grip, caractère."], wear: "Avec un cargo, un nylon ou un total look sombre." },
  icon: { lines: ["Un classique qu’on ne présente plus.", "L’icône, telle qu’on l’aime.", "La valeur sûre du placard."], wear: "Se porte partout, tout le temps." },
};

const COLOR_LINE: Record<ColorFamily, string> = {
  "silver-white": "Le coloris argent et blanc capte la lumière sans en faire trop.",
  "black-silver": "Noir et argent : sombre, métallique, facile à porter.",
  "black-white": "Noir et blanc, le contraste qui ne se démode pas.",
  cream: "Des tons crème et beige, doux et faciles à associer.",
  grey: "Un gris nuancé qui se glisse dans n’importe quelle tenue.",
  brown: "Des tons terre, chauds et profonds.",
  burgundy: "Un bordeaux profond, la couleur signature de l’univers BEYOND.",
  "red-white": "Rouge et blanc, franc et sportif.",
  "pink-silver": "Rose et argent, pour une touche lumineuse.",
  statement: "Un coloris affirmé, pour sortir du rang.",
};

const pick = <T,>(arr: T[], seed: string) => arr[[...seed].reduce((n, c) => n + c.charCodeAt(0), 0) % arr.length];

export function writeCopy(fullName: string, style: StyleFamily, color: ColorFamily) {
  const s = STYLE[style];
  const shortDescription = pick(s.lines, fullName);
  const description = `${shortDescription} ${COLOR_LINE[color]} ${s.wear} Réplique qualité Master Copy Premium 1:1, chaque commande est confirmée avec vous par téléphone : pointure, délai et livraison.`;
  return { shortDescription, description };
}
