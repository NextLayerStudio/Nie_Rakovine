import { redirect } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

/** Slugs that have moved to a dedicated route. */
const REDIRECTS: Record<string, string> = {
  "kontent-kniznica": "/home/kniznica",
  "zlavova-karta": "/menu/zlavova-karta",
  aktivity: "/home/calendar",
};

const LABELS: Record<string, string> = {
  "zlavova-karta": "Moja zľavová karta",
  "kontent-kniznica": "Onko knižnica",
  zlavy: "Zľavy",
  aktivity: "Aktivity",
  informacie: "Informácie",
  nastavenia: "Nastavenia",
  cookies: "Zásady cookies",
};

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (REDIRECTS[slug]) redirect(REDIRECTS[slug]);
  const title = LABELS[slug] ?? "Sekcia";

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref="/menu" title={title} />

        <section className="px-6 py-4">
          <div className="card p-6">
            <h2 className="text-base font-bold text-brand-purple">{title}</h2>
            <p className="mt-2 text-xs leading-relaxed text-brand-purple/70">
              Táto sekcia bude doplnená po pripojení databázy a obsahu.
              Pripravený podklad slúži ako navigačný cieľ z menu.
            </p>
          </div>
        </section>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
