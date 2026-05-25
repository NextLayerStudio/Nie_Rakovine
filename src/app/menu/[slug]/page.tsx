import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

const LABELS: Record<string, string> = {
  "zdravotna-karta": "Moja zdravotná karta",
  cvicenie: "Cvičenie",
  profil: "Môj profil",
  "kontakt-lekar": "Kontakt na lekára",
  zlavy: "Zľavy",
  aktivity: "Aktivity",
  clenovia: "Členov",
  informacie: "Informácie",
  nastavenia: "Nastavenia",
};

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = LABELS[slug] ?? "Sekcia";

  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col overflow-y-auto">
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
