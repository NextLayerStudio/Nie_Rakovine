import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Check, Star, ShieldCheck, CreditCard, RefreshCw } from "lucide-react";
import { ExpandableText } from "@/components/landing/ExpandableText";

const PLANS = [
  {
    id: "free",
    name: "Free členstvo",
    blurb: "Základný prístup do ONKO KLUBU, zadarmo.",
    price: "0 €",
    cta: "Registrovať zadarmo",
    href: "/register?plan=free",
  },
  {
    id: "monthly",
    name: "Mesačné členstvo",
    blurb: "Platíš každý mesiac, zrušíš kedykoľvek.",
    price: "5 € / mes.",
    cta: "Začať mesačne",
    href: "/register?plan=monthly",
  },
  {
    id: "yearly",
    name: "Ročné členstvo",
    blurb: "Jednorazová platba raz ročne, ušetríš 10 €.",
    price: "50 € / rok",
    cta: "Začať ročne",
    href: "/register?plan=annual",
    badge: "Najobľúbenejšie",
  },
  {
    id: "supporter",
    name: "Podporujúce členstvo",
    blurb: "Nie ste pacient? Podporte komunitu jednorazovo, min. 50 €.",
    price: "od 50 €",
    cta: "Podporiť",
    href: "/register?plan=supporter",
  },
];

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

          {/* Platobné karty a 3D-Secure — GoPay vyžaduje viditeľné logá na prvej
              stránke s cenami. */}
          <div className="flex flex-wrap items-center gap-5 mt-6 bg-white rounded-2xl p-4 border border-[#FDA4C7]/15 md:max-w-2xl">
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

      {/* Cenové možnosti — plochý zoznam, bez veľkých farebných kariet */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col divide-y divide-[#6F2380]/8 overflow-hidden rounded-[1.8rem] border border-[#FDA4C7]/20 bg-white md:max-w-2xl">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-base font-black text-[#6F2380]">{plan.name}</p>
                    {plan.badge && (
                      <span className="flex items-center gap-1 rounded-full bg-[#FDA4C7]/15 px-2.5 py-0.5 text-[10px] font-black text-[#FDA4C7]">
                        <Star size={9} className="fill-current" />
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#6F2380]/50">{plan.blurb}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-lg font-black text-[#6F2380]">{plan.price}</span>
                  <Link
                    href={plan.href}
                    className="whitespace-nowrap rounded-full bg-[#FDA4C7] px-5 py-2.5 text-xs font-black text-white"
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Čo získate — spoločné pre Mesačné, Ročné aj Podporujúce členstvo */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <h2 className="mb-4 text-lg font-black text-[#6F2380]">
            Čo získate s platenými formami členstva
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:max-w-2xl">
            {BENEFITY.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FDA4C7]/15">
                  <Check size={11} className="text-[#FDA4C7]" strokeWidth={3} />
                </div>
                <span className="text-[13px] text-[#6F2380]/70">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prečo je členstvo spoplatnené */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-5 md:px-8 md:max-w-2xl">
          <div className="rounded-2xl border border-[#FDA4C7]/15 bg-white p-5">
            <p className="mb-2 text-[13px] font-black text-[#6F2380]">
              Prečo je členstvo spoplatnené?
            </p>
            <ExpandableText maxHeight={60} fadeColor="#FFFFFF">
              <p className="text-[12px] leading-relaxed text-[#6F2380]/55">
                {REINVESTICIA_TEXT}
              </p>
            </ExpandableText>
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
