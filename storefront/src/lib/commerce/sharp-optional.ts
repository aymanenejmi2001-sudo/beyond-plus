// sharp is a native module: available on Node hosts, absent on Cloudflare Workers.
// Callers must handle null (the e-mail then links the original WebP photo).
export async function loadSharp() {
  try { return (await import("sharp")).default; } catch { return null; }
}
