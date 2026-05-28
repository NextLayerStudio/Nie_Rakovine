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

  const yogaSlug = "yoga-sample";
  await prisma.event.upsert({
    where: { id: yogaSlug },
    create: {
      id: yogaSlug,
      title: "ONKO YOGA",
      description:
        "Pravidelné jogové stretnutia pre členky a členov klubu. Lekcia je vedená skúsenou cvičiteľkou špecializovanou na onkologických pacientov. Cvičenie je vhodné pre začiatočníkov.",
      location: "Trnavská cesta 25, Bratislava",
      startsAt,
      endsAt,
      capacity: 15,
      published: true,
    },
    update: {},
  });

  // ---------- Sample posts -------------------------------------------------
  const posts = [
    {
      id: "sample-video-1",
      type: "VIDEO" as const,
      title: "Joga pre ženy počas onkologickej liečby",
      excerpt: "12-minútová lekcia jemnej jogy s Ivanou Kováčovou.",
      body: null,
      coverUrl: null,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    },
    {
      id: "sample-recipe-1",
      type: "RECIPE" as const,
      title: "Vyživujúci paradajkový vývar s bazalkou",
      excerpt: "Ľahký, výživný a rýchly recept na 30 minút.",
      body: "**Suroviny:** paradajky, cibuľa, cesnak, bazalka, olivový olej...",
      coverUrl: null,
      videoUrl: null,
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { id: p.id },
      create: {
        ...p,
        published: true,
        publishedAt: new Date(),
      },
      update: {},
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
    },
    update: {},
  });

  await prisma.forumComment.upsert({
    where: { id: "comment-sample-1" },
    create: {
      id: "comment-sample-1",
      threadId: sampleThread.id,
      authorId: admin.id,
      body:
        "Ďakujem za otvorenie tejto témy — veľmi to pomáha novým členkám.",
    },
    update: {},
  });

  console.log(`✔ Vzorové podujatie, obsah a fóra pripravené.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
