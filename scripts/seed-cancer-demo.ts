/**
 * Demo content ACCOUNTS targeted by cancer type — to verify personalisation.
 *
 *   npm run db:cancer-demo            — add or refresh the demo accounts
 *   npm run db:cancer-demo -- --clean — remove them first, then re-seed
 *
 * Creates several ClubProfiles (content accounts), each targeting a specific
 * cancer type, with tagged posts + a targeted forum + a targeted event.
 * Also creates two GENERAL accounts (no targeting) that everyone should see.
 *
 * To test: register a user and pick a cancer type (e.g. "Prsník"). On the
 * home feed / profiles / forums / calendar you should then see only the
 * matching accounts + the general ones — never the other cancer types.
 *
 * All ids are prefixed with `cdemo-` so --clean can remove them safely.
 */
import { PrismaClient, type CancerType } from "@prisma/client";

const prisma = new PrismaClient();

type AccountSpec = {
  key: string;
  displayName: string;
  bio: string;
  accent: string;
  cancerTypes: CancerType[];
  posts: {
    type: "ARTICLE" | "VIDEO" | "RECIPE";
    title: string;
    excerpt: string;
  }[];
  forum: { title: string; description: string };
  threads: { title: string; body: string }[];
  event: { title: string; description: string; city: string; lat: number; lng: number };
};

const ACCOUNTS: AccountSpec[] = [
  {
    key: "prsnik",
    displayName: "Prsník — podpora",
    bio: "Obsah a komunita pre pacientky a pacientov s rakovinou prsníka.",
    accent: "#CA6A8A",
    cancerTypes: ["PRSNIK"],
    posts: [
      { type: "ARTICLE", title: "Rehabilitácia ramena po operácii prsníka", excerpt: "Cviky a postup krok za krokom." },
      { type: "VIDEO", title: "Lymfodrenáž po mastektómii — video", excerpt: "Praktická ukážka domácej starostlivosti." },
      { type: "RECIPE", title: "Strava pri hormonálnej liečbe", excerpt: "Jedálniček pre lepšiu kondíciu." },
    ],
    forum: { title: "RAKOVINA PRSNÍKA", description: "Skúsenosti, otázky a vzájomná podpora." },
    threads: [
      { title: "Ako ste zvládli prvé dni po operácii?", body: "Práve ma čaká operácia a som nervózna. Ako to bolo u vás?" },
      { title: "Tip na rehabilitačné cviky", body: "Zdieľam cviky na rameno, ktoré mi odporučila fyzioterapeutka." },
    ],
    event: { title: "Stretnutie: život po prsníku", description: "Diskusia a zdieľanie skúseností.", city: "Bratislava", lat: 48.1486, lng: 17.1077 },
  },
  {
    key: "prostata",
    displayName: "Prostata — sprievodca",
    bio: "Informácie a podpora pri rakovine prostaty.",
    accent: "#5B8FD4",
    cancerTypes: ["PROSTATA"],
    posts: [
      { type: "ARTICLE", title: "Možnosti liečby rakoviny prostaty", excerpt: "Prehľad od sledovania po operáciu." },
      { type: "VIDEO", title: "Cviky na panvové dno", excerpt: "Pomoc pri inkontinencii po liečbe." },
    ],
    forum: { title: "RAKOVINA PROSTATY", description: "Mužská komunita — otvorene a bez tabu." },
    threads: [
      { title: "Sledovanie alebo operácia?", body: "Lekár mi dáva na výber. Aké máte skúsenosti s aktívnym sledovaním?" },
      { title: "Cviky na panvové dno fungujú", body: "Po pár týždňoch sa to výrazne zlepšilo. Vydržte to." },
    ],
    event: { title: "Beseda: prostata a kvalita života", description: "Stretnutie s odborníkom.", city: "Nitra", lat: 48.3069, lng: 18.0863 },
  },
  {
    key: "pluca",
    displayName: "Pľúca — dýchaj",
    bio: "Pre pacientov s rakovinou pľúc — dýchanie, kondícia, podpora.",
    accent: "#4A9B7F",
    cancerTypes: ["PLUCA"],
    posts: [
      { type: "ARTICLE", title: "Dychové cvičenia počas liečby pľúc", excerpt: "Ako si uľaviť pri dýchavičnosti." },
      { type: "VIDEO", title: "Jemná rozcvička pri nízkej kondícii", excerpt: "10 minút denne." },
    ],
    forum: { title: "RAKOVINA PĽÚC", description: "Zdieľajte, čo vám pomáha pri dýchaní a únave." },
    threads: [
      { title: "Dýchavičnosť po liečbe", body: "Čo vám pomohlo pri zadýchavaní sa pri bežných činnostiach?" },
      { title: "Malé víťazstvo", body: "Dnes som prešla 1 km bez zastavenia. Pomaly to ide!" },
    ],
    event: { title: "Prechádzka s dychovým trénerom", description: "Pomalá prechádzka a dýchanie.", city: "Žilina", lat: 49.2231, lng: 18.7394 },
  },
  {
    key: "creva",
    displayName: "Hrubé črevo — výživa",
    bio: "Strava a život s kolorektálnym karcinómom.",
    accent: "#E8A54B",
    cancerTypes: ["HRUBE_CREVO"],
    posts: [
      { type: "RECIPE", title: "Šetrná strava po operácii čreva", excerpt: "Ľahko stráviteľné jedlá." },
      { type: "ARTICLE", title: "Život so stómiou — praktické tipy", excerpt: "Bežný deň, cestovanie, sebavedomie." },
    ],
    forum: { title: "HRUBÉ ČREVO A KONEČNÍK", description: "Stómia, strava a každodenný život." },
    threads: [
      { title: "Strava prvé týždne po operácii", body: "Čo ste jedli, keď ešte nešlo skoro nič? Hľadám tipy." },
      { title: "Cestovanie so stómiou", body: "Plánujem dovolenku — na čo si dať pozor?" },
    ],
    event: { title: "Workshop: varíme šetrne", description: "Spoločné varenie a ochutnávka.", city: "Košice", lat: 48.7164, lng: 21.2611 },
  },
  {
    key: "koza",
    displayName: "Koža / melanóm",
    bio: "Prevencia, ochrana a život po melanóme.",
    accent: "#9B6F2D",
    cancerTypes: ["KOZA"],
    posts: [
      { type: "ARTICLE", title: "Ochrana pokožky počas a po liečbe", excerpt: "SPF, samovyšetrenie, kontroly." },
    ],
    forum: { title: "KOŽA A MELANÓM", description: "Skúsenosti s liečbou a prevenciou." },
    threads: [
      { title: "Kontroly znamienok — ako často?", body: "Ako často chodíte na kontroly po melanóme?" },
    ],
    event: { title: "Dermato-poradňa", description: "Konzultácie a vyšetrenie znamienok.", city: "Trnava", lat: 48.3774, lng: 17.5883 },
  },
  // ---- GENERAL accounts (no targeting) — visible to everyone ---------------
  {
    key: "general-psych",
    displayName: "Psychická podpora (pre všetkých)",
    bio: "Podpora a sprevádzanie bez ohľadu na diagnózu.",
    accent: "#6F2380",
    cancerTypes: [],
    posts: [
      { type: "ARTICLE", title: "Ako zvládať úzkosť po diagnóze", excerpt: "Techniky, ktoré pomáhajú každému." },
      { type: "VIDEO", title: "Riadené uvoľnenie — 8 minút", excerpt: "Relaxácia pre každý deň." },
    ],
    forum: { title: "PSYCHICKÁ PODPORA (VŠETCI)", description: "Bezpečný priestor pre všetkých." },
    threads: [
      { title: "Ako zvládate strach z recidívy?", body: "Niekedy ma to celkom premôže. Ako to máte vy?" },
      { title: "Pomohla mi terapia", body: "Chcem povzbudiť — vyhľadať pomoc nie je slabosť." },
    ],
    event: { title: "Otvorené stretnutie klubu", description: "Pre všetkých členov a členky.", city: "Bratislava", lat: 48.1486, lng: 17.1077 },
  },
  {
    key: "general-vyziva",
    displayName: "Výživa (pre všetkých)",
    bio: "Všeobecné rady o strave počas onkologickej liečby.",
    accent: "#CA6A8A",
    cancerTypes: [],
    posts: [
      { type: "RECIPE", title: "Výživný vývar pre každého", excerpt: "Jednoduchý a ľahko stráviteľný." },
    ],
    forum: { title: "VÝŽIVA (VŠETCI)", description: "Recepty a tipy pre všetkých." },
    threads: [
      { title: "Čo jesť, keď nie je chuť?", body: "Po chemoterapii nemám chuť do jedla. Čo vám pomohlo?" },
      { title: "Obľúbený jednoduchý recept", body: "Podeľte sa o recept, ktorý zvládnete aj v zlý deň." },
    ],
    event: { title: "Prednáška o výžive", description: "Základy stravy počas liečby.", city: "Nitra", lat: 48.3069, lng: 18.0863 },
  },
];

const VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

async function cleanDemo() {
  await prisma.post.deleteMany({ where: { id: { startsWith: "cdemo-" } } });
  await prisma.event.deleteMany({ where: { id: { startsWith: "cdemo-" } } });
  await prisma.forumComment.deleteMany({
    where: { thread: { forumId: { startsWith: "cdemo-forum-" } } },
  });
  await prisma.forumThread.deleteMany({
    where: { forumId: { startsWith: "cdemo-forum-" } },
  });
  await prisma.forumMembership.deleteMany({
    where: { forumId: { startsWith: "cdemo-forum-" } },
  });
  await prisma.forum.deleteMany({ where: { id: { startsWith: "cdemo-forum-" } } });
  await prisma.clubProfile.deleteMany({
    where: { handle: { startsWith: "cdemo-" } },
  });
  console.log("✔ Predošlé demo účty odstránené");
}

async function main() {
  if (process.argv.includes("--clean")) await cleanDemo();

  // Threads need an author — use an admin, else any existing user.
  const author =
    (await prisma.user.findFirst({ where: { role: "ADMIN" } })) ??
    (await prisma.user.findFirst());
  if (!author) {
    throw new Error(
      "Žiadny používateľ v DB — najprv spustite `npm run db:seed` (vytvorí admina).",
    );
  }

  let dayOffset = 3;

  for (const acc of ACCOUNTS) {
    const handle = `cdemo-${acc.key}`;
    const profile = await prisma.clubProfile.upsert({
      where: { handle },
      create: {
        handle,
        displayName: acc.displayName,
        bio: acc.bio,
        published: true,
        cancerTypes: acc.cancerTypes,
      },
      update: { displayName: acc.displayName, bio: acc.bio, cancerTypes: acc.cancerTypes },
    });

    // Posts (tagged with the same cancer types as the account)
    for (let i = 0; i < acc.posts.length; i++) {
      const p = acc.posts[i];
      const id = `cdemo-post-${acc.key}-${i}`;
      await prisma.post.upsert({
        where: { id },
        create: {
          id,
          profileId: profile.id,
          type: p.type,
          title: p.title,
          excerpt: p.excerpt,
          body: p.type === "VIDEO" ? null : `## ${p.title}\n\n${p.excerpt}`,
          videoUrl: p.type === "VIDEO" ? VIDEO_URL : null,
          published: true,
          publishedAt: new Date(),
          cancerTypes: acc.cancerTypes,
        },
        update: {
          title: p.title,
          excerpt: p.excerpt,
          cancerTypes: acc.cancerTypes,
          profileId: profile.id,
        },
      });
    }

    // Targeted forum
    const forumId = `cdemo-forum-${acc.key}`;
    await prisma.forum.upsert({
      where: { id: forumId },
      create: {
        id: forumId,
        title: acc.forum.title,
        description: acc.forum.description,
        accentColor: acc.accent,
        published: true,
        cancerTypes: acc.cancerTypes,
      },
      update: {
        title: acc.forum.title,
        description: acc.forum.description,
        cancerTypes: acc.cancerTypes,
      },
    });

    // Approved threads so the forum shows up in the "Príspevky" feed.
    // Visibility follows the forum's cancer types (filtered per user).
    for (let i = 0; i < acc.threads.length; i++) {
      const th = acc.threads[i];
      const threadId = `cdemo-thread-${acc.key}-${i}`;
      await prisma.forumThread.upsert({
        where: { id: threadId },
        create: {
          id: threadId,
          forumId,
          authorId: author.id,
          title: th.title,
          body: th.body,
          likeCount: 3 + i * 4,
          status: "APPROVED",
        },
        update: { title: th.title, body: th.body, status: "APPROVED" },
      });
    }

    // Targeted event
    const eventId = `cdemo-event-${acc.key}`;
    const startsAt = new Date();
    startsAt.setDate(startsAt.getDate() + dayOffset);
    startsAt.setHours(17, 0, 0, 0);
    const endsAt = new Date(startsAt);
    endsAt.setHours(18, 30, 0, 0);
    dayOffset += 2;

    await prisma.event.upsert({
      where: { id: eventId },
      create: {
        id: eventId,
        profileId: profile.id,
        title: acc.event.title,
        description: acc.event.description,
        category: "EXTERNE",
        location: `${acc.event.city}`,
        latitude: acc.event.lat,
        longitude: acc.event.lng,
        startsAt,
        endsAt,
        capacity: 20,
        published: true,
        cancerTypes: acc.cancerTypes,
      },
      update: {
        title: acc.event.title,
        cancerTypes: acc.cancerTypes,
        latitude: acc.event.lat,
        longitude: acc.event.lng,
      },
    });
  }

  console.log("\n✔ Demo účty podľa typu rakoviny pripravené\n");
  for (const acc of ACCOUNTS) {
    const tag = acc.cancerTypes.length ? acc.cancerTypes.join(", ") : "VŠEOBECNÉ";
    console.log(`  • ${acc.displayName}  →  ${tag}`);
  }
  console.log(
    "\nTest: zaregistruj používateľa, vyber napr. typ Prsník, a na home/profily/fóra/kalendári",
  );
  console.log(
    "uvidíš iba zhodné účty + všeobecné. Účty s iným typom rakoviny sa skryjú.\n",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
