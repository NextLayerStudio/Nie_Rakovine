"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { CancerType } from "@prisma/client";

export async function seedContentAction(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  // Nájsť prvý dostupný ClubProfile
  const profile = await prisma.clubProfile.findFirst({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  if (!profile) {
    return { ok: false, message: "Žiadny profil neexistuje. Najprv spusti základný seed (npm run db:seed)." };
  }

  const posts = [
    // --- FOTO príspevky ---
    {
      id: "seed-photo-1",
      type: "PHOTO" as const,
      title: "Letný tábor OnkoKlub 2026",
      excerpt: "Krásny víkend plný slnka, pohybu a vzájomnej podpory. Stretli sme sa v krásnom prostredí Malých Karpát, kde sme spoločne cvičili, varili zdravé jedlá a hlavne — rozprávali sa. Ďakujeme všetkým 47 účastníkom, ktorí prišli, a tešíme sa na vás na ďalšom tábore v septembri!",
      body: null,
      coverUrl: "https://picsum.photos/seed/onko-tabor/800/800",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-photo-2",
      type: "PHOTO" as const,
      title: "Ranná joga na terase",
      excerpt: "Každý deň začíname pohybom. Pridaj sa k nám každú stredu o 8:00 na terase nášho centra. Lekcia trvá 45 minút, je vhodná pre všetky úrovne zdatnosti a je úplne zadarmo pre členov ONKO KLUBU. Prines si vlastnú podložku a pohodlné oblečenie.",
      body: null,
      coverUrl: "https://picsum.photos/seed/onko-joga/800/1000",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-photo-3",
      type: "PHOTO" as const,
      title: "Varenie zdravých jedál — workshop",
      excerpt: "Naučili sme sa variť chutne aj počas liečby. Výživová poradkyňa Katarína Mináčová nás previedla jednoduchými receptmi, ktoré sú šetrné k žalúdku a zároveň plné živín. Recept na smoothie bowl a zelerový vývar nájdeš priamo v komentároch pod týmto príspevkom!",
      body: null,
      coverUrl: "https://picsum.photos/seed/onko-food/800/800",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-photo-4",
      type: "PHOTO" as const,
      title: "Skupinová prechádzka — Devínska Kobyla",
      excerpt: "5 km trasa, čerstvý vzduch, nádherné výhľady a úžasná partia ľudí. Tohto rána sa nás zišlo 23 — rekord! Najbližšia prechádzka je naplánovaná na 28. júna o 9:00, zraz pri parkovisku pri hrade Devín. Kapacita je obmedzená, prihláste sa cez sekciu Aktivity.",
      body: null,
      coverUrl: "https://picsum.photos/seed/onko-hiking/800/600",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    // --- VIDEO príspevky ---
    {
      id: "seed-video-1",
      type: "VIDEO" as const,
      title: "Joga pre ženy počas onkologickej liečby",
      excerpt: "12-minútová lekcia jemnej jogy s Ivanou Kováčovou, certifikovanou inštruktorkou pre onkologických pacientov. Cvičenie je vhodné pre úplných začiatočníkov a dá sa robiť aj v byte bez akýchkoľvek pomôcok. Zameráme sa na dychové cvičenia, jemné naťahovanie a uvoľnenie napätia v krku a ramenách — oblasti, ktoré sú po chemoterapii a rádioterapii najčastejšie postihnuté únavou.",
      body: "Táto lekcia je špeciálne navrhnutá pre pacientky v liečbe. Zameráva sa na dychové cvičenia a jemné pohyby, ktoré pomáhajú s únavou a stresom.\n\nCvičenie vždy prispôsobte svojmu aktuálnemu stavu. Ak niečo bolí, preskočte to.",
      coverUrl: "https://picsum.photos/seed/onko-yoga-video/800/450",
      videoUrl: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-video-2",
      type: "VIDEO" as const,
      title: "Rozhovor: Výživa počas chemoterapie",
      excerpt: "Výživová poradkyňa Mgr. Jana Horváthová vysvetľuje, čo jesť a čomu sa vyhnúť počas jednotlivých fáz chemoterapie. V rozhovore sa dozviete, prečo je dôležité udržiavať telesnú hmotnosť, aké potraviny pomáhajú zmierniť nevoľnosť, a ako si pripraviť jednoduché jedlá aj vtedy, keď nemáte chuť ani energiu stáť pri sporáku.",
      body: "V tomto rozhovore sa dozviete:\n- Aké potraviny podporujú imunitu\n- Čomu sa vyhnúť počas chemo\n- Ako prekonať nechutenstvo\n- Tipy na ľahké jedlá, keď vám je zle",
      coverUrl: "https://picsum.photos/seed/onko-nutrition-video/800/450",
      videoUrl: "https://www.youtube.com/watch?v=UItWltVZZmE",
      cancerTypes: [] as CancerType[],
    },
    // --- ČLÁNOK príspevky ---
    {
      id: "seed-article-1",
      type: "ARTICLE" as const,
      title: "Čo robiť po skončení liečby — sprievodca prvými 100 dňami",
      excerpt: "Praktické rady, ako sa vrátiť do bežného života po onkologickej liečbe. Po skončení liečby mnohí pacienti zistia, že návrat do normálu nie je taký jednoduchý, ako očakávali. Telo potrebuje čas, emócie sú rozkolísané a okolie niekedy nerozumie, prečo vám ešte stále nie je dobre. V tomto článku vás prevedieme prvými 100 dňami krok za krokom — od pohybu a výživy až po psychickú pohodu a vzťahy.",
      body: "## Prvý mesiac\n\nPo skončení liečby je prirodzené cítiť zmes úľavy, strachu a neistoty. Telo potrebuje čas na zotavenie.\n\n**Čo je normálne:**\n- Únava, ktorá môže trvať týždne až mesiace\n- Emocionálne výkyvy\n- Strach z návratu choroby\n\n## Pohyb a rehabilitácia\n\nZačnite pomaly. Aj 10-minútová prechádzka denne má obrovský vplyv na vašu pohodu a fyzickú kondíciu.\n\n## Psychická podpora\n\nNebojte sa vyhľadať pomoc psychológa alebo sa pripojiť k podpornej skupine — práve na to tu sme.",
      coverUrl: "https://picsum.photos/seed/onko-article-1/800/500",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-article-2",
      type: "ARTICLE" as const,
      title: "Spánok počas liečby — prečo nespíme a čo s tým",
      excerpt: "Problémy so spánkom sú jednou z najčastejších sťažností onkologických pacientov — až 75 % z nich trpí nespavosťou v niektorej fáze liečby. Chemoterapia, stres, hormonálne zmeny a lieky môžu úplne rozbiť prirodzený rytmus spánku. Dobrou správou je, že existujú overené techniky, ktoré pomáhajú aj bez liekov na spanie.",
      body: "## Prečo chemo kradne spánok\n\nChemoterapia, hormóny a stres spôsobujú, že mozog nedokáže prepnúť do spánkového režimu. Nie ste sami — až 75 % pacientov hlási problémy so spánkom.\n\n## Čo pomáha\n\n**Spánková hygiena:**\n- Chodiť spať a vstávať v rovnaký čas\n- Vyhnúť sa obrazovkám hodinu pred spaním\n- Chladná a tmavá miestnosť\n\n**Relaxačné techniky:**\n- Progresívna svalová relaxácia\n- Dychové cvičenia 4-7-8\n- Meditácia (aplikácie Calm, Headspace)\n\n## Kedy vyhľadať pomoc\n\nAk nespíte viac ako 3 týždne, povedzte to svojmu lekárovi.",
      coverUrl: "https://picsum.photos/seed/onko-sleep/800/500",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-article-3",
      type: "ARTICLE" as const,
      title: "Rakovina prsníka: čo očakávať po operácii",
      excerpt: "Sprievodca rekonvalescenciou a rehabilitáciou. Od starostlivosti o jazvu až po cvičenia na obnovenie pohyblivosti.",
      body: "## Prvé dni doma\n\nPo prepustení budete potrebovať pomoc s bežnými aktivitami. Nebojte sa o to požiadať.\n\n## Starostlivosť o jazvu\n\n- Jemná masáž jazvy po zahojení pomáha s citlivosťou\n- Používajte silikónové náplasti alebo gél\n- Chráňte jazvu pred slnkom aspoň rok\n\n## Rehabilitácia ramena\n\nŠpeciálne cvičenia pomáhajú obnoviť pohyblivosť a predchádzajú lymfedému. Váš fyzioterapeut vám ukáže správnu techniku.",
      coverUrl: "https://picsum.photos/seed/onko-breast/800/500",
      videoUrl: null,
      cancerTypes: ["PRSNIK"] as CancerType[],
    },
    // --- RECEPT príspevky ---
    {
      id: "seed-recipe-1",
      type: "RECIPE" as const,
      title: "Energetické guľôčky bez pečenia",
      excerpt: "Zdravá maškrta pripravená za 15 minút, bez rúry a bez komplikácií. Tieto guľôčky sú plné energie, vlákniny a zdravých tukov — perfektné vtedy, keď potrebujete niečo zjesť, ale nemáte chuť ani náladu variť. Vydrží v chladničke až 2 týždne, takže ich môžete pripraviť raz a mať poruke celý čas.",
      body: "## Suroviny (na 20 kusov)\n\n- 1 hrnček ovsených vločiek\n- ½ hrnčeka arašidového masla\n- 3 lyžice medu\n- ½ hrnčeka tmavej čokolády (kúsky)\n- 2 lyžice chia semienok\n- 1 lyžička vanilkového extraktu\n\n## Postup\n\n1. Zmiešajte všetky suroviny v miske\n2. Nechajte 30 minút v chladničke\n3. Tvarujte guľôčky veľkosti vlašského orecha\n4. Uchovávajte v chladničke až 2 týždne\n\n**Tip:** Môžete nahradiť arašidové maslo mandľovým alebo slnečnicovým.",
      coverUrl: "https://picsum.photos/seed/onko-balls/800/800",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
    {
      id: "seed-recipe-2",
      type: "RECIPE" as const,
      title: "Krémová zelerová polievka",
      excerpt: "Jemná, ľahko stráviteľná polievka plná vitamínov. Hotová za 25 minút.",
      body: "## Suroviny (4 porcie)\n\n- 1 väčší zeler (koreňový)\n- 2 zemiaky\n- 1 cibuľa\n- 500 ml zeleninovej polievky\n- 200 ml smotany (alebo kokosového mlieka)\n- Soľ, biele korenie, muškátový orech\n- Čerstvá petržlenová vňať\n\n## Postup\n\n1. Nakrájajte zeler a zemiaky na kúsky\n2. Osmažte cibuľu na trochu olivového oleja\n3. Pridajte zeleninu a polievku, varte 20 minút\n4. Rozmixujte dohladka, pridajte smotanu\n5. Dochuťte a podávajte s petržlenkou\n\n**Prečo je dobrá počas liečby:** Zeler je bohatý na vitamín C a draslík, ľahko stráviteľný a šetrný k žalúdku.",
      coverUrl: "https://picsum.photos/seed/onko-soup/800/600",
      videoUrl: null,
      cancerTypes: [] as CancerType[],
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const p of posts) {
    const existing = await prisma.post.findUnique({ where: { id: p.id } });
    if (existing) {
      // Update excerpt and title so re-running seed refreshes long descriptions
      await prisma.post.update({
        where: { id: p.id },
        data: { title: p.title, excerpt: p.excerpt },
      });
      skipped++;
      continue;
    }

    await prisma.post.create({
      data: {
        id: p.id,
        type: p.type,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        coverUrl: p.coverUrl,
        videoUrl: p.videoUrl ?? null,
        cancerTypes: p.cancerTypes,
        profileId: profile.id,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
    created++;
  }

  return {
    ok: true,
    message: `✅ Hotovo! Vytvorených: ${created} príspevkov, preskočených: ${skipped} (už existujú).`,
  };
}

export async function deleteSeedContentAction(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  const seedIds = [
    "seed-photo-1", "seed-photo-2", "seed-photo-3", "seed-photo-4",
    "seed-video-1", "seed-video-2",
    "seed-article-1", "seed-article-2", "seed-article-3",
    "seed-recipe-1", "seed-recipe-2",
  ];

  const { count } = await prisma.post.deleteMany({
    where: { id: { in: seedIds } },
  });

  return { ok: true, message: `🗑️ Vymazaných ${count} testovacích príspevkov.` };
}
