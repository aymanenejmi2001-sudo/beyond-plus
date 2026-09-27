// Admin session — single password (RADAR_ADMIN_PASSWORD), HMAC-signed
// httpOnly cookie. Web Crypto only, so it runs in middleware (edge) and in
// server actions alike. No password configured → admin is closed.

export const SESSION_COOKIE = "radar_session";
export const SESSION_HOURS = 12;

const enc = new TextEncoder();
const secret = () => process.env.RADAR_SESSION_SECRET || process.env.RADAR_ADMIN_PASSWORD || "";
export const adminConfigured = () => Boolean(process.env.RADAR_ADMIN_PASSWORD);

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function createSession(): Promise<{ value: string; expires: Date }> {
  const exp = Date.now() + SESSION_HOURS * 3600e3;
  return { value: `${exp}.${await hmac(`radar:${exp}`)}`, expires: new Date(exp) };
}

export async function verifySession(value: string | undefined | null): Promise<boolean> {
  if (!adminConfigured() || !value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || !Number.isSafeInteger(Number(exp)) || Number(exp) <= Date.now() || value.split(".").length !== 2) return false;
  return safeEqual(sig, await hmac(`radar:${exp}`));
}

export async function checkPassword(input: string): Promise<boolean> {
  const pw = process.env.RADAR_ADMIN_PASSWORD;
  if (!pw) return false;
  // Compare digests so the timing does not depend on the password length.
  return safeEqual(await hmac(`pw:${input}`), await hmac(`pw:${pw}`));
}
