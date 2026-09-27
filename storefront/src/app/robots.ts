import type { MetadataRoute } from "next";

const live = process.env.NEXT_PUBLIC_SITE_STATUS === "live";
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";

const PRIVATE = ["/checkout", "/account", "/admin", "/search-index.json", "/search-suggest.json", "/wishlist", "/api/"];

// Search engines and AI assistants are welcome: being read by them is how
// BEYOND PLUS shows up in ChatGPT, Claude, Perplexity, Gemini and Copilot.
const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended", "Applebot", "Applebot-Extended",
  "Bingbot", "DuckAssistBot", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  if (!live) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_AGENTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
