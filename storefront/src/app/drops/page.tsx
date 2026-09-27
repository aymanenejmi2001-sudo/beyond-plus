import type { Metadata } from "next";
import { DROPS, dropHeroImage, isPublic } from "@/data/drops";
import { DropFeature } from "@/components/drops/DropFeature";
import { launchInfo } from "./launch";

export const metadata: Metadata = {
  title: "Drops & Edits",
  description: "Les drops et sélections BEYOND PLUS : des rotations de sneakers choisies, disponibles maintenant, et les prochains lancements annoncés avec leur vraie date.",
  alternates: { canonical: "/drops" },
};
export const revalidate = 300;

export default function DropsPage() {
  const list = DROPS.filter(isPublic);
  return (
    <div>
      <header className="beyond-drops-head">
        <h1>DROPS &amp; EDITS</h1>
      </header>
      {list.map((d) => (
        <DropFeature
          key={d.slug}
          slug={d.slug}
          eyebrow={d.eyebrow}
          title={d.title}
          subtitle={d.subtitle}
          image={dropHeroImage(d)}
          launch={launchInfo(d)}
          location="drops_hub"
          serverNow={Date.now()}
        />
      ))}
    </div>
  );
}
