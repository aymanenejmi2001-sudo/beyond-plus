import Link from "next/link";
import { readRows, persistenceAvailable } from "@/lib/commerce/server";
import type { CartLine } from "@/lib/shopify/types";
import { Header } from "../ui";
import { updateRequestStatus } from "./status";
const LABELS: Record<string,string> = { prepared:"Demande préparée", confirmed:"Confirmée", shipped:"Expédiée", delivered:"Livrée", cancelled:"Annulée", returned:"Retournée" };
export default async function Requests() {
 const rows = await readRows();
 const requests = rows.filter(r=>r.kind === "request_prepared").sort((a,b)=>b.created_at.localeCompare(a.created_at));
 const statuses = rows.filter(r=>r.kind === "request_status").sort((a,b)=>b.created_at.localeCompare(a.created_at));
 const counts = rows.reduce<Record<string,number>>((n,r)=>({...n,[r.kind]:(n[r.kind]??0)+1}),{});
 return <><Header storeKind={process.env.SUPABASE_URL ? "supabase" : "file"}/><section style={{padding:"3rem",maxWidth:"110rem",margin:"auto"}}>
 <h1>Demandes et commandes</h1>
 {!persistenceAvailable() && <p role="alert">Stockage non configuré. Les demandes WhatsApp ne sont pas enregistrées sur ce serveur.</p>}
 <p>Une demande préparée ne prouve pas l’envoi du message WhatsApp. Mettez à jour le statut uniquement après vérification réelle.</p>
 <p>Mesure facultative, sur les 1 000 derniers enregistrements : consultations {counts.view_product??0} · ajouts panier {counts.add_to_cart??0} · débuts de demande {counts.begin_checkout??0} · clics WhatsApp {counts.whatsapp_click??0}. Ces compteurs ne représentent pas des visiteurs uniques.</p>
 {!requests.length && <p>Aucune demande enregistrée.</p>}
 {requests.map(row=>{
  const p=row.payload as {lines:CartLine[];total:number};
  const status = statuses.find(s=>(s.payload as {requestId:string}).requestId===row.id)?.payload as {status:string}|undefined;
  return <article key={row.id} style={{borderTop:"1px solid #ccc",padding:"2rem 0"}}>
   <h2 style={{fontSize:"1.6rem"}}>{row.id}</h2><p>{new Date(row.created_at).toLocaleString("fr-MA")} · {LABELS[status?.status??"prepared"]} · {p.total} DH</p>
   <ul>{p.lines.map(l=><li key={l.id}><Link href={`/products/${l.merchandise.product.handle}`}>{l.merchandise.product.title}</Link> · pointure {l.merchandise.title} × {l.quantity}</li>)}</ul>
   <form action={updateRequestStatus} style={{display:"flex",gap:"1rem",marginTop:"1rem"}}><input type="hidden" name="requestId" value={row.id}/><label>Statut <select name="status" defaultValue={status?.status??"prepared"}>{Object.entries(LABELS).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label><button type="submit">Enregistrer le statut vérifié</button></form>
  </article>;
 })}</section></>;
}
