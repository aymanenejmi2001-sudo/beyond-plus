import Link from "next/link";
import type { Metadata } from "next";
import { GUIDES } from "@/data/guides";

export const metadata: Metadata = {
  title: "Guides sneakers",
  description: "Pointures, styles, entretien : les guides BEYOND PLUS pour bien choisir et bien porter ses sneakers.",
  alternates: { canonical: "/guides" },
};

export default function Guides() {
  return (
    <section className="beyond-page">
      <p className="eyebrow">Guides</p>
      <h1>Bien choisir, bien porter.</h1>
      <ul className="beyond-guides">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`}>
              <h2>{g.title}</h2>
              <p>{g.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
