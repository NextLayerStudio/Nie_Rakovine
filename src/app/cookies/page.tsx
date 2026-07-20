import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CookiesContent } from "@/components/CookiesContent";

export default async function CookiesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const backHref =
    from?.startsWith("/") && !from.startsWith("//") ? from : undefined;

  // Otvorené priamo (napr. z pätičky landing stránky) -> verejný layout.
  // Otvorené z appky (?from=...) -> pôvodný in-app PhoneShell layout.
  if (!backHref) {
    return (
      <main className="min-h-screen bg-[#FFF3F9] font-sans">
        <Navbar />

        <section className="pt-24 pb-6 px-5">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">
              Právne informácie
            </p>
            <h1 className="text-[2.2rem] md:text-[2.8rem] font-black text-[#6F2380] leading-[1.1] mb-3">
              Zásady používania súborov cookies
            </h1>
            <p className="text-[#6F2380]/60 text-sm">Posledná aktualizácia: júl 2026</p>
          </div>
        </section>

        <section className="pb-20 px-5">
          <div className="max-w-3xl mx-auto rounded-[2rem] bg-white p-6 md:p-10 border border-[#FDA4C7]/15">
            <CookiesContent className="text-[15px] leading-relaxed text-[#6F2380]/80 space-y-4" />
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <TopBar backHref={backHref} title="Cookies" />

        <article className="px-6 py-4 pb-8">
          <CookiesContent className="card space-y-4 p-5 text-sm leading-relaxed text-brand-purple/85" />
        </article>
      </div>
    </PhoneShell>
  );
}
