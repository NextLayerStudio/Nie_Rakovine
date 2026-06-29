/**
 * Demo image-only discount cards + "reklama" posts (home feed) for existing
 * demo discount partners. Reklama posts link to a specific card.
 *
 * Run: npm run db:reklama-demo
 * Safe to re-run — uses upsert on fixed ids.
 * Requires the discount partners from `npm run db:discount-demo` to exist.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Stable placeholder image (picsum) for a given seed + size. */
function img(seed: string, w = 1000, h = 1000) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

type CardSeed = { id: string; imageUrl: string; sortOrder: number };
type ReklamaSeed = {
  id: string;
  title: string;
  excerpt: string | null;
  coverUrl: string;
  /** which card (by id) this reklama links to */
  linkedCardId: string | null;
};

const DATA: {
  partnerHandle: string;
  cards: CardSeed[];
  reklamy: ReklamaSeed[];
}[] = [
  {
    partnerHandle: "demo-cinemax",
    cards: [
      { id: "demo-card-cinemax-1", imageUrl: img("cinemax-card1", 1000, 1100), sortOrder: 0 },
      { id: "demo-card-cinemax-2", imageUrl: img("cinemax-card2", 1000, 1100), sortOrder: 1 },
    ],
    reklamy: [
      {
        id: "demo-reklama-cinemax-1",
        title: "Cinemax — 2 lístky za cenu jedného",
        excerpt: "Utorky a stredy s členskou kartou ONKO KLUB.",
        coverUrl: img("cinemax-ad1", 1200, 800),
        linkedCardId: "demo-card-cinemax-1",
      },
    ],
  },
  {
    partnerHandle: "demo-reserved",
    cards: [
      { id: "demo-card-reserved-1", imageUrl: img("reserved-card1", 1000, 1200), sortOrder: 0 },
    ],
    reklamy: [
      {
        id: "demo-reklama-reserved-1",
        title: "Reserved — jarná kolekcia so zľavou",
        excerpt: "Nová kolekcia s extra zľavou pre členov.",
        coverUrl: img("reserved-ad1", 1200, 900),
        linkedCardId: "demo-card-reserved-1",
      },
    ],
  },
  {
    partnerHandle: "demo-wellness",
    cards: [
      { id: "demo-card-wellness-1", imageUrl: img("wellness-card1", 1000, 1000), sortOrder: 0 },
    ],
    reklamy: [
      {
        id: "demo-reklama-wellness-1",
        title: "Wellness Oáza — deň plný relaxu",
        excerpt: "Sauna, bazén a masáže so zvýhodnením.",
        coverUrl: img("wellness-ad1", 1200, 800),
        linkedCardId: "demo-card-wellness-1",
      },
    ],
  },
  {
    partnerHandle: "demo-lidl",
    cards: [
      { id: "demo-card-lidl-1", imageUrl: img("lidl-card1", 1000, 900), sortOrder: 0 },
    ],
    reklamy: [
      {
        id: "demo-reklama-lidl-1",
        title: "Lidl — 5 € zľava na nákup",
        excerpt: null,
        coverUrl: img("lidl-ad1", 1200, 800),
        linkedCardId: "demo-card-lidl-1",
      },
    ],
  },
];

async function main() {
  let cardCount = 0;
  let reklamaCount = 0;

  for (const entry of DATA) {
    const partner = await prisma.discountPartner.findUnique({
      where: { handle: entry.partnerHandle },
    });
    if (!partner) {
      console.warn(
        `⚠ Značka ${entry.partnerHandle} neexistuje — preskakujem. Spustite najprv npm run db:discount-demo.`,
      );
      continue;
    }

    for (const c of entry.cards) {
      await prisma.discountOffer.upsert({
        where: { id: c.id },
        create: {
          id: c.id,
          partnerId: partner.id,
          title: "",
          imageUrl: c.imageUrl,
          published: true,
          sortOrder: c.sortOrder,
        },
        update: {
          partnerId: partner.id,
          title: "",
          imageUrl: c.imageUrl,
          published: true,
          sortOrder: c.sortOrder,
        },
      });
      cardCount++;
    }

    for (const r of entry.reklamy) {
      await prisma.post.upsert({
        where: { id: r.id },
        create: {
          id: r.id,
          type: "PHOTO",
          title: r.title,
          excerpt: r.excerpt,
          coverUrl: r.coverUrl,
          published: true,
          publishedAt: new Date(),
          discountPartnerId: partner.id,
          linkedOfferId: r.linkedCardId,
        },
        update: {
          type: "PHOTO",
          title: r.title,
          excerpt: r.excerpt,
          coverUrl: r.coverUrl,
          published: true,
          publishedAt: new Date(),
          discountPartnerId: partner.id,
          linkedOfferId: r.linkedCardId,
        },
      });
      reklamaCount++;
    }

    console.log(
      `✔ ${partner.displayName} — ${entry.cards.length} kariet, ${entry.reklamy.length} reklám`,
    );
  }

  console.log(
    `\nHotovo — ${cardCount} zľavových kariet a ${reklamaCount} reklám.`,
  );
  console.log("Reklama je v domovskom kanáli (/home), karty v profile značky.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
