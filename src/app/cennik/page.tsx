import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check, Star, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";

const BENEFITY = [
  "Prístup ku všetkým videám a materiálom prispôsobeným potrebám onkologických pacientov",
  "Bezplatné odborné prednášky a podcasty",
  "Pohodlné rezervácie na podujatia a workshopy",
  "Prístup do všetkých diskusných fór",
  "Exkluzívne zľavy u partnerských značiek",
  "Digitálna OKkarta s QR kódom",
  "Sociálny kompas",
];

const REINVESTICIA_TEXT =
  "Všetky finančné prostriedky získané prostredníctvom ONKO KLUBU vraciame späť do systému pomoci. Vďaka nim dokážeme zabezpečovať fungovanie pacientskych poradní NIE RAKOVINE, poskytovať bezplatné poradenstvo a rozvíjať pomoc, ktorú pacienti s rakovinou na Slovensku potrebujú.";

const FAQ = [
  {
    q: "Ako prebieha platba za členstvo?",
    a: "Platba prebieha online cez platobnú bránu GoPay. V rámci mesačného členstva sa suma automaticky obnovuje každý mesiac, v prípade ročného členstva ide o jednorazovú platbu raz ročne. Platbu je možné kedykoľvek zrušiť v nastaveniach vášho účtu. Ak uprednostňujete úhradu formou trvalého príkazu, kontaktujte nás, prosím, na office@nierakovine.sk.",
  },
  {
    q: "Je možné členstvo kedykoľvek zrušiť?",
    a: "Áno. Členstvo môžete kedykoľvek zrušiť v nastaveniach svojho účtu bez sankcií a bez ďalších záväzkov. Prístup k platforme vám zostane aktívny do konca už zaplateného obdobia.",
  },
  {
    q: "Má členstvo skúšobné obdobie?",
    a: "Členstvo si môžete vyskúšať bez záväzkov. Ak sa rozhodnete v prvom mesiaci nepokračovať, stačí ho jednoducho zrušiť. Bez pokuty a akýchkoľvek sankcií.",
  },
  {
    q: "Sú moje osobné a zdravotné údaje v bezpečí?",
    a: "Áno. Citlivé údaje sú šifrované na úrovni aplikácie. Dáta sú ukladané na serveroch v rámci EÚ (región Frankfurt) a neopúšťajú územie Európskej únie. Spracúvanie osobných údajov prebieha v súlade s nariadením GDPR.",
  },
];

export default function CennikPage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="md:max-w-xl">
            <p className="text-[#FDA4C7] text-sm font-bold uppercase tracking-widest mb-3">Cenník</p>
            <h1 className="text-[2.4rem] md:text-[3rem] font-black text-[#6F2380] leading-[1.1] mb-5">
              Vyberte si spôsob členstva, ktorý vám vyhovuje
            </h1>
            <p className="text-[#6F2380]/70 text-base leading-relaxed">
              Transparentné podmienky bez skrytých poplatkov.
            </p>
          </div>
        </div>
      </section>

      {/* Platobné záruky */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:max-w-2xl">
            {[
              { icon: CreditCard, label: "Bezpečná online platba", sub: "Platba prebieha cez platobnú bránu GoPay." },
              { icon: RefreshCw,  label: "Flexibilné členstvo",    sub: "Členstvo môžete kedykoľvek zrušiť bez záväzkov a ďalších podmienok." },
              { icon: ShieldCheck, label: "Bez skrytých poplatkov", sub: "Cena členstva je jasná a bez dodatočných nákladov." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15">
                  <div className="w-9 h-9 rounded-xl bg-[#FDA4C7]/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-[#FDA4C7]" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-black text-[#6F2380] text-[13px] leading-tight mb-0.5">{item.label}</p>
                    <p className="text-[#6F2380]/55 text-[12px] leading-snug">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cenové karty */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:max-w-2xl">

            {/* Ročné — odporúčané */}
            <div className="rounded-[1.8rem] bg-[#6F2380] px-6 py-7 relative overflow-hidden md:flex-1">
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 bg-[#FDA4C7] rounded-full px-3 py-1">
                  <Star size={11} className="text-white fill-white" />
                  <span className="text-white text-[11px] font-black">Najobľúbenejšie</span>
                </div>
              </div>
              <p className="text-white/55 text-xs font-bold uppercase tracking-wider mb-1">Ročné členstvo</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-white font-black text-[3rem] leading-none">60 €</span>
                <span className="text-white/50 text-sm mb-2">/ rok</span>
              </div>
              <p className="text-[#FDA4C7] text-sm font-bold mb-6">= 5 € mesačne · platíš raz ročne</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {[...BENEFITY, "Jednorazová platba bez nutnosti aktualizácie počas roka"].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FDA4C7] flex items-center justify-center shrink-0">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="text-white/80 text-[13px]">{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?plan=annual" className="block w-full rounded-full bg-[#FDA4C7] text-white font-black text-base py-4 text-center">
                Začať ročne — 60 €
              </Link>
              <p className="text-white/45 text-[11px] leading-relaxed mt-5">
                {REINVESTICIA_TEXT}
              </p>
            </div>

            {/* Mesačné */}
            <div className="rounded-[1.8rem] bg-white border border-[#FDA4C7]/20 px-6 py-7 md:flex-1">
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Mesačné členstvo</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-[#6F2380] font-black text-[3rem] leading-none">5 €</span>
                <span className="text-[#6F2380]/40 text-sm mb-2">/ mesiac</span>
              </div>
              <p className="text-[#6F2380]/40 text-sm mb-6">Platíš každý mesiac · zrušíš kedykoľvek</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {BENEFITY.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#FDA4C7]/20 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                    </div>
                    <span className="text-[#6F2380]/65 text-[13px]">{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?plan=monthly" className="block w-full rounded-full border-2 border-[#FDA4C7] text-[#FDA4C7] font-black text-base py-4 text-center">
                Začať mesačne — 5 €
              </Link>
              <p className="text-[#6F2380]/40 text-[11px] leading-relaxed mt-5">
                {REINVESTICIA_TEXT}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshot platformy po registrácii */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-5">Čo ťa čaká po registrácii</h2>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-3">
            <div className="w-full aspect-video rounded-[2rem] bg-[#6F2380]/15 flex items-center justify-center md:col-span-3">
              <p className="text-[#6F2380]/25 text-xs font-semibold">[IMG-25] Dashboard platformy</p>
            </div>
            <div className="aspect-square rounded-2xl bg-[#FDA4C7]/15 flex items-center justify-center">
              <p className="text-[#FDA4C7]/50 text-[10px] font-semibold text-center px-2">[IMG-26] Videoknižnica</p>
            </div>
            <div className="aspect-square rounded-2xl bg-[#6F2380]/10 flex items-center justify-center">
              <p className="text-[#6F2380]/30 text-[10px] font-semibold text-center px-2">[IMG-28] Onkorumky fórum</p>
            </div>
            <div className="aspect-square rounded-2xl bg-[#FDA4C7]/10 flex items-center justify-center">
              <p className="text-[#FDA4C7]/40 text-[10px] font-semibold text-center px-2">[IMG-29] Kalendár eventov</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="text-xl font-black text-[#6F2380] mb-6">Časté otázky k platbe</h2>
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
            {FAQ.map((item) => (
              <div key={item.q} className="bg-white rounded-2xl p-5 border border-[#FDA4C7]/15">
                <p className="font-black text-[#6F2380] text-[14px] mb-2">{item.q}</p>
                <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="rounded-[2rem] bg-[#6F2380] px-6 py-10 md:py-14 text-center">
            <h2 className="text-[2rem] md:text-[2.4rem] font-black text-white leading-tight mb-3">Vstúpte do ONKO KLUBU</h2>
            <p className="text-white/65 text-sm leading-relaxed mb-7 md:max-w-sm md:mx-auto">
              Registrácia je jednoduchá a nezáväzná. Prístup získate okamžite.
            </p>
            <Link href="/register" className="inline-block rounded-full bg-[#FDA4C7] text-white font-black text-base px-10 py-4">
              Vytvoriť účet
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
