/**
 * Demo / test data: multiple users, forums, threads & comments (mixed moderation).
 *
 *   npm run db:demo          — add or refresh demo data
 *   npm run db:demo -- --clean   — remove demo data first, then re-seed
 *
 * All demo accounts use password: DemoTest#2026
 */
import { PrismaClient, ForumModerationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "DemoTest#2026";
const DEMO_EMAIL_SUFFIX = "@onkoklub.test";

const DEMO_USERS = [
  { key: "anna", fullName: "Anna Horváthová", city: "Bratislava", diagnosis: "Prsník", lat: 48.1486, lng: 17.1077 },
  { key: "peter", fullName: "Peter Kováč", city: "Košice", diagnosis: "Črevo", lat: 48.7164, lng: 21.2611 },
  { key: "maria", fullName: "Mária Nováková", city: "Žilina", diagnosis: "Vaječníky", lat: 49.2231, lng: 18.7394 },
  { key: "jozef", fullName: "Jozef Baláž", city: "Nitra", diagnosis: "Prostata", lat: 48.3069, lng: 18.0863 },
  { key: "zuzana", fullName: "Zuzana Vargová", city: "Trnava", diagnosis: "Pľúca", lat: 48.3774, lng: 17.5883 },
] as const;

const DEMO_FORUMS = [
  {
    id: "demo-forum-joga",
    title: "Joga a dýchanie",
    description: "Skúsenosti s jemným cvičením počas liečby.",
    accentColor: "#5B8FD4",
  },
  {
    id: "demo-forum-vyziva",
    title: "Strava a recepty",
    description: "Čo jesť, čo nejesť, jednoduché recepty.",
    accentColor: "#CA6A8A",
  },
  {
    id: "demo-forum-rodina",
    title: "Rodina a blízki",
    description: "Ako hovoriť s deťmi a partnerom o diagnóze.",
    accentColor: "#E8A54B",
  },
  {
    id: "demo-forum-praca",
    title: "Práca a financie",
    description: "PN, návrat do zamestnania, dávky a praktické tipy.",
    accentColor: "#6F2380",
  },
  {
    id: "demo-forum-noc",
    title: "Spánok a únava",
    description: "Insomnia po chemoterapii — čo pomáha vám?",
    accentColor: "#4A9B7F",
  },
] as const;

const THREAD_BODIES = [
  "Ahojte, má niekto skúsenosť s krátkymi prechádzkami hneď po liečbe?",
  "Chcela by som sa opýtať na jednoduché recepty, keď nemám chuť jesť.",
  "Ako ste povedali rodine o diagnóze? U nás to bolo náročné.",
  "Má niekto tip na aplikáciu na sledovanie liekov?",
  "Cítim sa dnes lepšie — chcela som sa podeliť o malé víťazstvo.",
  "Má zmysel online skupinová terapia, alebo radšej osobne?",
  "Po druhej chemoterapii ma veľmi bolí hlava — čo vám pomohlo?",
  "Hľadám odporúčanie na fyzioterapeuta v Bratislave.",
];

const COMMENT_BODIES = [
  "Ďakujem za zdieľanie, veľmi to pomáha.",
  "U mňa fungovalo rovnako — držím palce.",
  "Skús sa opýtať aj v ambulancii, mali dobrý tip.",
  "Súhlasím, nie je to jednoduché, ale nie si sama.",
  "Ja som začínal/a pomaly, len 5 minút denne.",
];

function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

function statusFor(index: number): ForumModerationStatus {
  const mod = index % 5;
  if (mod === 0) return "PENDING";
  if (mod === 1) return "REJECTED";
  return "APPROVED";
}

async function cleanDemoData() {
  const demoUsers = await prisma.user.findMany({
    where: { email: { endsWith: DEMO_EMAIL_SUFFIX } },
    select: { id: true },
  });
  const userIds = demoUsers.map((u) => u.id);

  if (userIds.length) {
    await prisma.notification.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.articleLike.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.profileFollow.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.eventRegistration.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.forumComment.deleteMany({ where: { authorId: { in: userIds } } });
    await prisma.forumThread.deleteMany({ where: { authorId: { in: userIds } } });
    await prisma.forumMembership.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  }

  await prisma.forumComment.deleteMany({
    where: { thread: { forumId: { startsWith: "demo-forum-" } } },
  });
  await prisma.forumThread.deleteMany({
    where: { forumId: { startsWith: "demo-forum-" } },
  });
  await prisma.forumMembership.deleteMany({
    where: { forumId: { startsWith: "demo-forum-" } },
  });
  await prisma.forum.deleteMany({
    where: { id: { startsWith: "demo-forum-" } },
  });

  console.log("✔ Demo dáta odstránené");
}

async function main() {
  const clean = process.argv.includes("--clean");
  if (clean) await cleanDemoData();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users: { id: string; email: string; fullName: string }[] = [];

  for (const u of DEMO_USERS) {
    const email = `demo-${u.key}${DEMO_EMAIL_SUFFIX}`;
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        fullName: u.fullName,
        passwordHash,
        role: "USER",
        birthDate: new Date(1975 + DEMO_USERS.indexOf(u), 2, 15),
        profile: {
          create: {
            city: u.city,
            region: "SK",
            latitude: u.lat,
            longitude: u.lng,
            diagnosis: u.diagnosis,
            diagnosisPhase: "liečba",
            interests: ["joga", "výživa"],
            expectations: ["podpora", "informácie"],
          },
        },
      },
      update: { passwordHash, fullName: u.fullName },
    });
    users.push({ id: user.id, email: user.email, fullName: user.fullName });
  }

  const forums = [];
  for (const f of DEMO_FORUMS) {
    const forum = await prisma.forum.upsert({
      where: { id: f.id },
      create: {
        id: f.id,
        title: f.title,
        description: f.description,
        accentColor: f.accentColor,
        published: true,
      },
      update: {
        title: f.title,
        description: f.description,
        accentColor: f.accentColor,
      },
    });
    forums.push(forum);

    for (const user of users) {
      await prisma.forumMembership.upsert({
        where: { forumId_userId: { forumId: forum.id, userId: user.id } },
        create: { forumId: forum.id, userId: user.id },
        update: {},
      });
    }
  }

  let threadIndex = 0;
  let commentIndex = 0;

  for (const forum of forums) {
    for (let t = 0; t < 4; t++) {
      const author = pick(users, threadIndex);
      const status = statusFor(threadIndex);
      const threadId = `demo-thread-${forum.id}-${t}`;

      const thread = await prisma.forumThread.upsert({
        where: { id: threadId },
        create: {
          id: threadId,
          forumId: forum.id,
          authorId: author.id,
          title:
            status === "REJECTED"
              ? null
              : `Téma ${t + 1} — ${pick(["Otázka", "Skúsenosť", "Tip", "Podpora"], t)}`,
          body: pick(THREAD_BODIES, threadIndex),
          likeCount: (threadIndex % 7) * 3,
          status,
        },
        update: {
          body: pick(THREAD_BODIES, threadIndex),
          status,
          authorId: author.id,
        },
      });

      if (status === "APPROVED") {
        for (let c = 0; c < 2; c++) {
          const commentAuthor = pick(users, commentIndex + c + 1);
          const commentStatus = statusFor(commentIndex);
          const commentId = `demo-comment-${thread.id}-${c}`;

          await prisma.forumComment.upsert({
            where: { id: commentId },
            create: {
              id: commentId,
              threadId: thread.id,
              authorId: commentAuthor.id,
              body: pick(COMMENT_BODIES, commentIndex),
              status: commentStatus,
            },
            update: {
              body: pick(COMMENT_BODIES, commentIndex),
              status: commentStatus,
              authorId: commentAuthor.id,
            },
          });
          commentIndex++;
        }
      }

      threadIndex++;
    }
  }

  const clubProfile = await prisma.clubProfile.findFirst({
    where: { handle: "onko-klub" },
  });
  if (clubProfile) {
    for (let i = 0; i < users.length; i++) {
      await prisma.profileFollow.upsert({
        where: {
          userId_profileId: { userId: users[i].id, profileId: clubProfile.id },
        },
        create: { userId: users[i].id, profileId: clubProfile.id },
        update: {},
      });
    }
  }

  console.log("\n✔ Demo dáta pripravené\n");
  console.log("Heslo pre všetky demo účty:", DEMO_PASSWORD);
  console.log("\nÚčty:");
  for (const u of users) {
    console.log(`  • ${u.email}  (${u.fullName})`);
  }
  console.log(`\nFóra: ${forums.length} (id prefix demo-forum-*)`);
  console.log(
    "Príspevky: mix PENDING / APPROVED / REJECTED — vhodné na test schvaľovania v /admin/forums/moderation",
  );
  console.log("\nPrihlásenie: /login → ľubovoľný demo email vyššie\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
