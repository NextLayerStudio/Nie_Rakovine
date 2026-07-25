import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { SupporterCard } from "@/components/landing/SupporterCard";
import { Check, Star, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const PAYMENT_LOGOS = [
  { src: "/images/platby/gopay.png", alt: "GoPay", w: 100, h: 35 },
  { src: "/images/platby/visa.png", alt: "VISA", w: 67, h: 23 },
  { src: "/images/platby/verified-by-visa.png", alt: "Verified by VISA", w: 67, h: 30 },
  { src: "/images/platby/mastercard.png", alt: "Mastercard", w: 67, h: 43 },
  { src: "/images/platby/mastercard-securecode.png", alt: "Mastercard SecureCode", w: 86, h: 40 },
  { src: "/images/platby/maestro.png", alt: "Maestro", w: 67, h: 43 },
];

const BENEFITY = [
  "Prístup ku všetkým videám a materiálom prispôsobeným potrebám onkologických pacientov",
  "Bezplatné odborné prednášky a podcasty",
  "Pohodlné rezervácie na podujatia a workshopy",
  "Prístup do všetkých diskusných fór",
  "Exkluzívne zľavy u partnerských značiek",
  "Digitálna OK Karta s QR kódom",
  "Sociálny kompas",
];

const REINVESTICIA_TEXT =
  "Všetky finančné prostriedky získané prostredníctvom ONKO KLUBU vraciame späť do systému pomoci. Vďaka nim dokážeme zabezpečovať fungovanie pacientskych poradní NIE RAKOVINE, poskytovať bezplatné poradenstvo a rozvíjať pomoc, ktorú pacienti s rakovinou na Slovensku potrebujú.";

const FAQ = [
  {
    q: "Ako prebieha platba za členstvo?",
    a: "Free členstvo je úplne zadarmo. Platba za Mesačné a Ročné členstvo prebieha online cez platobnú bránu GoPay a automaticky sa obnovuje (mesačne, resp. ročne). Podporujúce členstvo je jednorazová platba vo vami zvolenej výške (min. 50 €), ktorá sa neobnovuje. Platbu je možné kedykoľvek zrušiť v nastaveniach vášho účtu. Ak uprednostňujete úhradu formou trvalého príkazu, kontaktujte nás, prosím, na office@onkoklub.sk.",
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

          {/* Platobné karty a 3D-Secure — GoPay vyžaduje viditeľné logá na prvej
              stránke s cenami. */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 md:max-w-2xl">
            {PAYMENT_LOGOS.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="h-7 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cenové karty */}
      <section className="pb-14">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 gap-4 items-stretch sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">

            {/* Free */}
            <div className="flex flex-col rounded-[1.8rem] border border-[#FDA4C7]/20 bg-[#FFF8FB] px-6 py-7">
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Free členstvo</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">0 €</span>
              </div>
              <p className="text-[#6F2380]/40 text-sm mb-6">Základný prístup, úplne zadarmo</p>
              <Link
                href="/register?plan=free"
                className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center"
              >
                Registrovať zadarmo
              </Link>
            </div>

            {/* Mesačné */}
            <div className="flex flex-col rounded-[1.8rem] bg-[#FFEDF4] border border-[#FDA4C7]/25 px-6 py-7">
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Mesačné členstvo</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">5 €</span>
                <span className="text-[#6F2380]/40 text-sm mb-1">/ mes.</span>
              </div>
              <p className="text-[#6F2380]/40 text-sm mb-6">Platíš mesačne · zrušíš kedykoľvek</p>
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
              <Link href="/register?plan=monthly" className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center">
                Začať mesačne — 5 €
              </Link>
              <div className="mt-5">
                <ExpandableText maxHeight={48} fadeColor="#FFEDF4">
                  <p className="text-[#6F2380]/40 text-[11px] leading-relaxed">
                    {REINVESTICIA_TEXT}
                  </p>
                </ExpandableText>
              </div>
            </div>

            {/* Ročné — odporúčané */}
            <div className="flex flex-col rounded-[1.8rem] bg-[#FFD9E8] border border-[#FDA4C7]/30 px-6 py-7 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1">
                  <Star size={11} className="text-[#FDA4C7] fill-[#FDA4C7]" />
                  <span className="text-[#FDA4C7] text-[11px] font-black">Najobľúbenejšie</span>
                </div>
              </div>
              <p className="text-[#6F2380]/50 text-xs font-bold uppercase tracking-wider mb-1">Ročné členstvo</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-[#6F2380] font-black text-[2.4rem] leading-none">50 €</span>
                <span className="text-[#6F2380]/40 text-sm mb-1">/ rok</span>
              </div>
              <p className="text-[#6F2380] text-sm font-bold mb-6">Ušetríš 10 € oproti mesačnému plánu</p>
              <div className="flex flex-col gap-2.5 mb-7">
                {[...BENEFITY, "Jednorazová platba bez nutnosti aktualizácie počas roka"].map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                      <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                    </div>
                    <span className="text-[#6F2380]/70 text-[13px]">{b}</span>
                  </div>
                ))}
              </div>
              <Link href="/register?plan=annual" className="mt-auto block w-full rounded-full bg-[#FDA4C7] text-white font-black text-sm py-3.5 text-center">
                Začať ročne — 50 €
              </Link>
              <div className="mt-5">
                <ExpandableText maxHeight={48} fadeColor="#FFD9E8">
                  <p className="text-[#6F2380]/50 text-[11px] leading-relaxed">
                    {REINVESTICIA_TEXT}
                  </p>
                </ExpandableText>
              </div>
            </div>

            {/* Podporujúce — vlastná suma */}
            <SupporterCard />
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
                <ExpandableText maxHeight={60} fadeColor="#FFFFFF">
                  <p className="text-[#6F2380]/55 text-[13px] leading-relaxed">{item.a}</p>
                </ExpandableText>
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
