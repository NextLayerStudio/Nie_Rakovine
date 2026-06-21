/**
 * Demo discount partners + offers for Zľavy section.
 * Run: npm run db:discount-demo
 * Safe to re-run — uses upsert on fixed handles/ids.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARTNERS = [
  {
    id: "demo-disc-zara",
    handle: "demo-zara",
    displayName: "Zara",
    bio: "Móda pre každú príležitosť so zľavou pre členov ONKO KLUBU.",
    category: "MODA" as const,
    featured: true,
    sortOrder: 0,
    offers: [
      {
        id: "demo-offer-zara-1",
        title: "15 % na celý nákup",
        discountText: "15 %",
        description: "Platí v kamenných predajniach aj online. Pri platbe uveďte členské ID.",
        promoCode: "ONKO15",
        accentColor: "#F5D5E0",
        sortOrder: 0,
      },
      {
        id: "demo-offer-zara-2",
        title: "Doprava zdarma",
        discountText: "0 €",
        description: "Bezplatná doprava pri objednávke nad 50 €.",
        accentColor: "#B8D4E8",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "demo-disc-reserved",
    handle: "demo-reserved",
    displayName: "Reserved",
    bio: "Štýlové oblečenie s extra zľavou pre členov klubu.",
    category: "MODA" as const,
    featured: true,
    sortOrder: 1,
    offers: [
      {
        id: "demo-offer-reserved-1",
        title: "10 % na jarnú kolekciu",
        discountText: "10 %",
        promoCode: "ONKORESERVED",
        accentColor: "#E8D5F5",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "demo-disc-dm",
    handle: "demo-dm",
    displayName: "dm drogerie",
    bio: "Kozmetika, vitamíny a produkty pre každodennú starostlivosť.",
    category: "KOZMETIKA" as const,
    featured: true,
    sortOrder: 0,
    offers: [
      {
        id: "demo-offer-dm-1",
        title: "20 % na vybranú kozmetiku",
        discountText: "20 %",
        description: "Platí na produkty označené štítkom ONKO KLUB.",
        accentColor: "#F5E8C8",
        sortOrder: 0,
      },
      {
        id: "demo-offer-dm-2",
        title: "Darček k nákupu",
        discountText: "Darček",
        description: "Mini balíček vzoriek pri nákupe nad 25 €.",
        accentColor: "#A8DDD6",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "demo-disc-notino",
    handle: "demo-notino",
    displayName: "Notino",
    bio: "Parfumy a kozmetika od svetových značiek.",
    category: "KOZMETIKA" as const,
    featured: false,
    sortOrder: 1,
    offers: [
      {
        id: "demo-offer-notino-1",
        title: "12 % na prvý nákup",
        discountText: "12 %",
        promoCode: "ONKONOTINO",
        accentColor: "#F5D5E0",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "demo-disc-lidl",
    handle: "demo-lidl",
    displayName: "Lidl",
    bio: "Čerstvé potraviny a kvalitné produkty za výhodné ceny.",
    category: "JEDLO" as const,
    featured: true,
    sortOrder: 0,
    offers: [
      {
        id: "demo-offer-lidl-1",
        title: "5 € zľava na nákup",
        discountText: "5 €",
        description: "Pri nákupne nad 40 € v kamenných predajniach.",
        promoCode: "ONKOLIDL5",
        accentColor: "#B8D4E8",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "demo-disc-pizza",
    handle: "demo-pizza",
    displayName: "Pizza Mamma",
    bio: "Domáca pizza a talianske špeciality v Bratislave.",
    category: "JEDLO" as const,
    featured: false,
    sortOrder: 1,
    offers: [
      {
        id: "demo-offer-pizza-1",
        title: "Druhá pizza zadarmo",
        discountText: "2+1",
        description: "Pri objednávke dvoch pizz strednej veľkosti.",
        accentColor: "#F5D5E0",
        sortOrder: 0,
      },
      {
        id: "demo-offer-pizza-2",
        title: "10 % na takeaway",
        discountText: "10 %",
        promoCode: "ONKOPIZZA",
        accentColor: "#A8DDD6",
        sortOrder: 1,
      },
    ],
  },
  {
    id: "demo-disc-cinemax",
    handle: "demo-cinemax",
    displayName: "Cinemax",
    bio: "Kino zážitky pre celú rodinu.",
    category: "ZAZITKY" as const,
    featured: true,
    sortOrder: 0,
    offers: [
      {
        id: "demo-offer-cinemax-1",
        title: "Vstupenky za polovicu",
        discountText: "50 %",
        description: "Platí na utorkové a stredajšie predstavenia.",
        accentColor: "#E8D5F5",
        sortOrder: 0,
      },
    ],
  },
  {
    id: "demo-disc-wellness",
    handle: "demo-wellness",
    displayName: "Wellness Oáza",
    bio: "Relax, sauna a masáže pre regeneráciu tela i duše.",
    category: "ZAZITKY" as const,
    featured: true,
    sortOrder: 1,
    offers: [
      {
        id: "demo-offer-wellness-1",
        title: "90 min wellness",
        discountText: "25 %",
        description: "Celodenný vstup vrátane sauny a bazéna.",
        promoCode: "ONKOWELL",
        accentColor: "#A8DDD6",
        sortOrder: 0,
      },
      {
        id: "demo-offer-wellness-2",
        title: "Masáž chrbta",
        discountText: "15 €",
        description: "30-minútová masáž za zvýhodnenú cenu.",
        accentColor: "#F5E8C8",
        sortOrder: 1,
      },
    ],
  },
] as const;

async function main() {
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 6);

  for (const p of PARTNERS) {
    const partner = await prisma.discountPartner.upsert({
      where: { handle: p.handle },
      create: {
        id: p.id,
        handle: p.handle,
        displayName: p.displayName,
        bio: p.bio,
        category: p.category,
        featured: p.featured,
        published: true,
        sortOrder: p.sortOrder,
      },
      update: {
        displayName: p.displayName,
        bio: p.bio,
        category: p.category,
        featured: p.featured,
        published: true,
        sortOrder: p.sortOrder,
      },
    });

    for (const o of p.offers) {
      await prisma.discountOffer.upsert({
        where: { id: o.id },
        create: {
          id: o.id,
          partnerId: partner.id,
          title: o.title,
          description: "description" in o ? o.description ?? null : null,
          discountText: o.discountText,
          promoCode: "promoCode" in o ? o.promoCode ?? null : null,
          accentColor: o.accentColor,
          validUntil,
          published: true,
          sortOrder: o.sortOrder,
        },
        update: {
          partnerId: partner.id,
          title: o.title,
          description: "description" in o ? o.description ?? null : null,
          discountText: o.discountText,
          promoCode: "promoCode" in o ? o.promoCode ?? null : null,
          accentColor: o.accentColor,
          validUntil,
          published: true,
          sortOrder: o.sortOrder,
        },
      });
    }

    console.log(`✔ ${partner.displayName} (${p.offers.length} kariet)`);
  }

  console.log(`\nHotovo — ${PARTNERS.length} zľavových profilov.`);
  console.log("V aplikácii: Menu → Zľavy alebo /home/zlavy");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
