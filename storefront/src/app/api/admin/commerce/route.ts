import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "../../../../../radar/lib/auth";
import { readRows } from "@/lib/commerce/server";
export async function GET() {
  if (!await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) return new Response("Unauthorized", { status: 401 });
  return Response.json(await readRows(), { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
