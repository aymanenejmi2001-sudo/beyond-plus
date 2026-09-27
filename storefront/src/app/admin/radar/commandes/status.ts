"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, verifySession } from "../../../../../radar/lib/auth";
import { readRows, saveEvent } from "@/lib/commerce/server";
export async function updateRequestStatus(form: FormData) {
 if (!await verifySession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/radar/login");
 const requestId=String(form.get("requestId")),status=String(form.get("status"));
 if (!["prepared","confirmed","shipped","delivered","cancelled","returned"].includes(status)) throw new Error("Statut invalide.");
 if (!(await readRows()).some(r=>r.id===requestId && r.kind==="request_prepared")) throw new Error("Demande introuvable.");
 if (!await saveEvent("request_status",{requestId,status})) throw new Error("Stockage indisponible.");
 revalidatePath("/admin/radar/commandes");
}
