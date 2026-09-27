// Runs before every build (npm "prebuild"): writes the pairs published in
// Radar and the owner's extra photos into the files the storefront reads.
// Without Supabase env it leaves the committed files untouched.
import { getStore } from "../lib/store.ts";
import { writeSiteFiles } from "../services/siteFiles.ts";

if (getStore().kind !== "supabase") console.log("[radar:pull-site] pas de Supabase — fichiers inchangés");
else {
  try { console.log(`[radar:pull-site] ${await writeSiteFiles()} paire(s) Radar écrites`); }
  catch (e) { console.warn("[radar:pull-site] échec, fichiers existants conservés :", (e as Error).message); }
}
