// Seed script - run with: npm run db:seed
//
// Creates (or refreshes) the bootstrap ADMIN user using the credentials
// from .env (ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME) and inserts a
// small amount of example content so the app isn't empty on first run.
//
// Safe to run multiple times — uses upsert.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@onkoklub.sk")
    .trim()
    .toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "OnkoAdmin#2026";
  const adminName = process.env.ADMIN_NAME ?? "ONKO KLUB Admin";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      fullName: adminName,
      passwordHash,
      role: "ADMIN",
      profile: { create: {} },
    },
    update: {
      passwordHash,
      role: "ADMIN",
      fullName: adminName,
    },
  });
  console.log(`✔ Admin pripravený: ${admin.email}`);

  // ---------- Sample event -------------------------------------------------
  const startsAt = new Date();
  startsAt.setDate(startsAt.getDate() + 14);
  startsAt.setHours(10, 0, 0, 0);
  const endsAt = new Date(startsAt);
  endsAt.setHours(11, 30, 0, 0);

  const clubProfile = await prisma.clubProfile.upsert({
    where: { handle: "onko-klub" },
    create: {
      handle: "onko-klub",
      displayName: "ONKO KLUB",
      bio: "Oficiálny profil klubu — videá, články, recepty a podujatia.",
      published: true,
      sortOrder: 0,
      category: "NOVINKY",
    },
    update: { category: "NOVINKY" },
  });

  // Testovacie profily pre každú kategóriu
  await prisma.clubProfile.upsert({
    where: { handle: "zdrava-vyziva" },
    create: {
      handle: "zdrava-vyziva",
      displayName: "ZDRAVÁ VÝŽIVA",
      bio: "Recepty, tipy na stravu a zdravý životný štýl počas onkologickej liečby.",
      published: true,
      sortOrder: 1,
      category: "ZDRAVA_VYZIVA",
    },
    update: { category: "ZDRAVA_VYZIVA" },
  });

  await prisma.clubProfile.upsert({
    where: { handle: "partneri-nk" },
    create: {
      handle: "partneri-nk",
      displayName: "SPONZORI A PARTNERI",
      bio: "Firmy a organizácie, ktoré podporujú komunitu NIE RAKOVINE.",
      published: true,
      sortOrder: 2,
      category: "SPONZORI",
    },
    update: { category: "SPONZORI" },
  });

  await prisma.clubProfile.upsert({
    where: { handle: "diagnozy-nk" },
    create: {
      handle: "diagnozy-nk",
      displayName: "DIAGNÓZY",
      bio: "Informácie, príbehy a podpora pre jednotlivé onkologické diagnózy.",
      published: true,
      sortOrder: 3,
      category: "DIAGNOZY",
    },
    update: { category: "DIAGNOZY" },
  });

  await prisma.clubProfile.upsert({
    where: { handle: "akcie-nk" },
    create: {
      handle: "akcie-nk",
      displayName: "AKCIE A PODUJATIA",
      bio: "Prehľad podujatí, stretnutí a aktivít komunity po celom Slovensku.",
      published: true,
      sortOrder: 4,
      category: "AKCIE",
    },
    update: { category: "AKCIE" },
  });

  const yogaSlug = "yoga-sample";
  await prisma.event.upsert({
    where: { id: yogaSlug },
    create: {
      id: yogaSlug,
      profileId: clubProfile.id,
      title: "ONKO YOGA",
      description:
        "Pravidelné jogové stretnutia pre členky a členov klubu. Lekcia je vedená skúsenou cvičiteľkou špecializovanou na onkologických pacientov. Cvičenie je vhodné pre začiatočníkov.",
      category: "FYZICKE",
      location: "Trnavská cesta 25, Bratislava",
      latitude: 48.1620,
      longitude: 17.1450,
      startsAt,
      endsAt,
      capacity: 15,
      published: true,
    },
    update: {
      profileId: clubProfile.id,
      category: "FYZICKE",
      latitude: 48.1620,
      longitude: 17.1450,
    },
  });

  // A few more events spread across Slovakia + categories (calendar/near-me tests)
  const extraEvents = [
    {
      id: "event-edu-kosice",
      title: "Prednáška: výživa počas liečby",
      description: "Odborná prednáška s diskusiou a priestorom na otázky.",
      category: "EDUKACNE" as const,
      location: "Hlavná 50, Košice",
      latitude: 48.7200,
      longitude: 21.2580,
      dayOffset: 7,
    },
    {
      id: "event-relax-zilina",
      title: "Relaxačné popoludnie",
      description: "Mindfulness, dýchanie a oddych v príjemnom prostredí.",
      category: "RELAXACNE" as const,
      location: "Národná 12, Žilina",
      latitude: 49.2230,
      longitude: 18.7390,
      dayOffset: 10,
    },
    {
      id: "event-mental-nitra",
      title: "Skupinová psychologická podpora",
      description: "Bezpečný priestor na zdieľanie pod vedením psychológa.",
      category: "MENTALNE" as const,
      location: "Štefánikova 8, Nitra",
      latitude: 48.3060,
      longitude: 18.0860,
      dayOffset: 21,
    },
  ];

  for (const ev of extraEvents) {
    const s = new Date();
    s.setDate(s.getDate() + ev.dayOffset);
    s.setHours(16, 0, 0, 0);
    const e = new Date(s);
    e.setHours(18, 0, 0, 0);
    await prisma.event.upsert({
      where: { id: ev.id },
      create: {
        id: ev.id,
        profileId: clubProfile.id,
        title: ev.title,
        description: ev.description,
        category: ev.category,
        location: ev.location,
        latitude: ev.latitude,
        longitude: ev.longitude,
        startsAt: s,
        endsAt: e,
        capacity: 20,
        published: true,
      },
      update: {
        category: ev.category,
        latitude: ev.latitude,
        longitude: ev.longitude,
      },
    });
  }

  // ---------- Sample posts -------------------------------------------------
  // cancerTypes [] = general (everyone). Non-empty = targeted personalisation.
  const posts = [
    {
      id: "sample-video-1",
      type: "VIDEO" as const,
      title: "Joga pre ženy počas onkologickej liečby",
      excerpt: "12-minútová lekcia jemnej jogy s Ivanou Kováčovou.",
      body: null,
      coverUrl: null,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      cancerTypes: [] as const,
    },
    {
      id: "sample-article-1",
      type: "ARTICLE" as const,
      title: "Čo robiť po skončení liečby — sprievodca prvými 100 dňami",
      excerpt:
        "Praktické rady, ako sa vrátiť do bežného života po onkologickej liečbe.",
      body: "## Prvý mesiac\n\nDoprajte si oddych...",
      coverUrl: null,
      videoUrl: null,
      cancerTypes: [] as const,
    },
    {
      id: "sample-recipe-1",
      type: "RECIPE" as const,
      title: "Vyživujúci paradajkový vývar s bazalkou",
      excerpt: "Ľahký, výživný a rýchly recept na 30 minút.",
      body: "**Suroviny:** paradajky, cibuľa, cesnak, bazalka, olivový olej...",
      coverUrl: null,
      videoUrl: null,
      cancerTypes: [] as const,
    },
    {
      id: "sample-article-prsnik",
      type: "ARTICLE" as const,
      title: "Rakovina prsníka: čo očakávať po operácii",
      excerpt:
        "Sprievodca rekonvalescenciou a rehabilitáciou po operácii prsníka.",
      body: "## Po operácii\n\nRehabilitácia ramena a starostlivosť o jazvu...",
      coverUrl: null,
      videoUrl: null,
      cancerTypes: ["PRSNIK"] as const,
    },
    {
      id: "sample-article-prostata",
      type: "ARTICLE" as const,
      title: "Život s rakovinou prostaty — praktické rady",
      excerpt: "Ako zvládať liečbu a každodenný život s diagnózou prostaty.",
      body: "## Bežný deň\n\nPohyb, strava a kontrolné vyšetrenia...",
      coverUrl: null,
      videoUrl: null,
      cancerTypes: ["PROSTATA"] as const,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { id: p.id },
      create: {
        ...p,
        cancerTypes: [...p.cancerTypes],
        profileId: clubProfile.id,
        published: true,
        publishedAt: new Date(),
      },
      update: { profileId: clubProfile.id, cancerTypes: [...p.cancerTypes] },
    });
  }

  // ---------- Sample forums (Fóra) ----------------------------------------
  const forumMindfulness = await prisma.forum.upsert({
    where: { id: "forum-mindfulness-yoga" },
    create: {
      id: "forum-mindfulness-yoga",
      title: "MINDFULLNESS YOGA",
      description:
        "Zdieľajte skúsenosti s jogou, dýchaním a mindfulness počas liečby. Podporujeme sa navzájom v bezpečnom priestore.",
      accentColor: "#5B8FD4",
      published: true,
    },
    update: {},
  });

  await prisma.forum.upsert({
    where: { id: "forum-vyziva" },
    create: {
      id: "forum-vyziva",
      title: "VÝŽIVA A RECEPTY",
      description:
        "Tipy na stravu počas liečby, recepty a otázky pre výživových poradcov komunity.",
      accentColor: "#CA6A8A",
      published: true,
    },
    update: {},
  });

  await prisma.forum.upsert({
    where: { id: "forum-podpora" },
    create: {
      id: "forum-podpora",
      title: "PSYCHICKÁ PODPORA",
      description:
        "Priestor na rozhovor, otázky a vzájomnú podporu — anonymita a rešpekt sú prvoradé.",
      accentColor: "#E8A54B",
      published: true,
    },
    update: {},
  });

  // Targeted forum — only shown mainly to users with breast cancer.
  await prisma.forum.upsert({
    where: { id: "forum-prsnik" },
    create: {
      id: "forum-prsnik",
      title: "RAKOVINA PRSNÍKA",
      description:
        "Komunita pre pacientky a pacientov s rakovinou prsníka — skúsenosti, otázky a vzájomná podpora.",
      accentColor: "#CA6A8A",
      published: true,
      cancerTypes: ["PRSNIK"],
    },
    update: { cancerTypes: ["PRSNIK"] },
  });

  const sampleThread = await prisma.forumThread.upsert({
    where: { id: "thread-sample-1" },
    create: {
      id: "thread-sample-1",
      forumId: forumMindfulness.id,
      authorId: admin.id,
      title: "Ako začať s jemnou jogou doma?",
      body:
        "Ahojte všetkým, chcela by som sa podeliť o jednoduché cvičenia, ktoré mi pomáhajú po chemoterapii. Čo funguje vám?",
      likeCount: 15,
      status: "APPROVED",
    },
    update: { status: "APPROVED" },
  });

  await prisma.forumComment.upsert({
    where: { id: "comment-sample-1" },
    create: {
      id: "comment-sample-1",
      threadId: sampleThread.id,
      authorId: admin.id,
      body:
        "Ďakujem za otvorenie tejto témy — veľmi to pomáha novým členkám.",
      status: "APPROVED",
    },
    update: { status: "APPROVED" },
  });

  console.log(`✔ Profil, podujatie, obsah a fóra pripravené.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
