// Internal marketing brief for an approved product. Template-based and
// deterministic — a starting point for the team, never auto-published.

import type { Candidate } from "../lib/types.ts";

const STYLE_ANGLE: Record<string, { mood: string; outfit: string; moment: string }> = {
  "low-profile": { mood: "basse, fine, discrète", outfit: "pantalon large ou jupe longue", moment: "en terrasse, en fin d'après-midi" },
  terrace: { mood: "plate, cuir et gomme", outfit: "jean droit ou survêtement vintage", moment: "un samedi en ville" },
  "retro-runner": { mood: "running d'archive, mesh et overlays", outfit: "baggy ou tailleur oversize", moment: "le trajet du matin" },
  "y2k-runner": { mood: "volumes et reflets Y2K", outfit: "total look simple pour laisser la paire parler", moment: "un soir, sous les lumières de la ville" },
  skate: { mood: "toile, daim, semelle gaufrée", outfit: "denim brut ou pantalon de costume", moment: "partout, tous les jours" },
  "basketball-retro": { mood: "héritage parquet", outfit: "pantalon droit, haut sobre", moment: "un rendez-vous où l'on veut marquer" },
  technical: { mood: "outdoor pensé pour la ville", outfit: "cargo, nylon ou total noir", moment: "une journée qui ne s'arrête pas" },
  icon: { mood: "le classique qu'on ne présente plus", outfit: "tout, vraiment", moment: "n'importe quand" },
};

export function buildBrief(c: Candidate): Record<string, string | string[]> {
  const name = [c.brand, c.model].join(" ");
  const full = [name, c.colorway].filter(Boolean).join(" — ");
  const s = STYLE_ANGLE[c.style_family ?? "icon"] ?? STYLE_ANGLE.icon;
  return {
    product: full,
    positioning: `${name} : ${s.mood}. La paire qu'on met sans réfléchir et qu'on remarque quand même.`,
    ad_angles: [
      `Le look — ${name} avec ${s.outfit}. Montrer la tenue entière, pas seulement la paire.`,
      `Le détail — gros plans matière et semelle${c.colorway ? `, coloris ${c.colorway}` : ""}. Peu de texte, beaucoup de lumière.`,
      "Le service — commande sur WhatsApp, pointure confirmée avec vous. Simple, humain, rapide.",
    ],
    ugc_concept: `Unboxing honnête : on ouvre, on essaie, on dit ce qu'on pense de la pointure et du confort. ${s.moment[0].toUpperCase()}${s.moment.slice(1)}.`,
    reel_concept: `3 tenues, 1 paire : ${name} portée trois façons en 15 secondes, coupes nettes sur le rythme, ${s.moment}.`,
    story_concepts: [
      `Sondage : « ${name} avec ${s.outfit.split(" ou ")[0]} — oui ou non ? » puis la réponse en photo.`,
      "Pointures dispo : une slide par taille, lien WhatsApp en dernière slide.",
    ],
    caption: `${name}${c.colorway ? ` ${c.colorway}` : ""}. ${s.mood[0].toUpperCase()}${s.mood.slice(1)}. Dispo chez BEYOND PLUS.`,
    meta_primary_text: `${name}, ${s.mood}. Se porte avec ${s.outfit}. Commande en deux messages sur WhatsApp — on confirme ta pointure avec toi.`,
    guardrails: "Ne pas présenter comme authentique. Pas de fausse rareté (« derniers stocks ») sans donnée de stock réelle.",
  };
}
