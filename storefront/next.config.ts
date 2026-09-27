import type { NextConfig } from "next";

// Everything answers on the main domain: www and the old vercel.app link
// redirect permanently (301/308) so search engines transfer what they learned.
const PRIMARY = "beyondplusmaroc.com";
const OLD_HOSTS = ["www.beyondplusmaroc.com", "beyond-plus-gamma.vercel.app"];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return OLD_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${PRIMARY}/:path*`,
      permanent: true,
    }));
  },
  devIndicators: false,
  // Local dev server (Radar) builds into its own folder so a production
  // build running at the same time can't break it: NEXT_DIST_DIR=.next-dev.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Radar admin: photo uploads through server actions (default limit is 1 MB).
  experimental: { serverActions: { bodySizeLimit: "50mb" }, inlineCss: true },
  images: {
    qualities: [75, 76, 78, 82, 88],
    // Prototype art lives in /public/images. When the storefront is wired to
    // Shopify, product media arrives from cdn.shopify.com — already allowed.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Radar: photos uploaded by the owner, stored in Supabase Storage.
      ...(process.env.SUPABASE_URL ? [{ protocol: "https" as const, hostname: new URL(process.env.SUPABASE_URL).hostname, pathname: "/storage/v1/object/public/**" }] : []),
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
  },
};

export default nextConfig;
