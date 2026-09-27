import type { Metadata } from "next";
import s from "./admin.module.css";

// Private area: never indexed (plus X-Robots-Tag from middleware), never cached.
export const metadata: Metadata = {
  title: "Beyond Radar",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={s.shell} data-radar>{children}</div>;
}
