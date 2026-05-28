# ONKO KLUB

Mobile-first podporná webová aplikácia pre ľudí s onkologickým ochorením.
Postavená výhradne na **Next.js + TypeScript + Tailwind CSS** s **Prisma**
nad **Neon (Vercel Postgres)**.

## Tech stack

- **Next.js 15** (App Router, Server Actions)
- **TypeScript** (strict)
- **Tailwind CSS** s vlastnou paletou ONKO KLUBU
- **Prisma 5** + **Neon Postgres**
- **bcryptjs** (hashovanie hesiel) + **jose** (podpis session cookies)
- Mobile-first canvas (`phone-shell`), na desktope sa zobrazí ako náhľad telefónu

## Farebná paleta

| Token              | HEX         | Použitie                              |
| ------------------ | ----------- | ------------------------------------- |
| `brand.purple`     | `#6F2380`   | Primárna (CTA, nadpisy, ikony)        |
| `brand.purple-soft`| `#6F238066` | Tlmené plochy, gradient               |
| `brand.pink`       | `#CA6A8A`   | Sekundárna (tlačidlá, akcent)         |
| `brand.pink-soft`  | `#CA6A8ACC` | Vstupy, prekryvy                      |
| `brand.white`      | `#FFFFFF`   | Pozadie kariet, kontrast              |

## Lokálny vývoj

```bash
npm install
npm run dev          # http://localhost:3000
```

## Databáza (Neon)

Spojenie je v `.env` (premenné `DATABASE_URL` pooled +
`DATABASE_URL_UNPOOLED` direct).

```bash
npm run db:generate  # vygeneruje Prisma klienta
npm run db:migrate   # vytvorí novú migráciu (dev)
npm run db:push      # priame push schémy (bez migrácie)
npm run db:studio    # Prisma Studio (vizuálny editor DB)
npm run db:seed      # vytvorí admina + vzorové podujatie a obsah
```

> Pri prvom spustení už bola migrácia `init` aplikovaná a seed naplnil
> admina, jedno vzorové podujatie a 3 obsahy.

## Auth (vlastná, lightweight)

- **Hashovanie:** `bcryptjs` (10 rounds)
- **Session:** signovaný JWT v httpOnly cookie `onko_session` (30 dní),
  HS256 cez `jose`
- **Middleware** (`src/middleware.ts`): chráni `/home`, `/menu`, `/profile`,
  `/admin` — ak chýba session, presmeruje na `/login?next=...`
- **Server-side role check:** `requireUser()` / `requireAdmin()`
  v `src/lib/auth.ts`

### Admin účet (zo seedu, z `.env`)

| | |
|---|---|
| Email | `admin@onkoklub.sk` |
| Heslo | `OnkoAdmin#2026` |

Tieto údaje **zmeňte v produkcii** v `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
a spustite `npm run db:seed` znova — heslo sa prepíše.

## Dátový model (Prisma)

- **User** + **UserProfile** (lokalita, diagnóza, fáza, rok, záujmy,
  očakávania, hearAboutUs, predplatné)
- **Post** (VIDEO / ARTICLE / RECIPE) + **ArticleLike**
- **Event** + **EventRegistration**
- Enumy: `UserRole`, `SubscriptionPlan`, `SubscriptionStatus`, `PostType`

## Štruktúra obrazoviek

### Verejné (mobilné)

| Cesta                                | Popis                                        |
| ------------------------------------ | -------------------------------------------- |
| `/`                                  | Splash (pink) → auto-redirect na `/welcome` |
| `/welcome`                           | Prihlásiť / Registrovať                      |
| `/login`                             | Prihlásenie (server action)                  |
| `/register`                          | Nový účet (server action, hashed password)   |
| `/register/subscription`             | Výber predplatného (uloží do DB)             |
| `/register/profile/location`         | Krok 1 – lokalita                            |
| `/register/profile/diagnosis`        | Krok 2 – diagnóza, fáza, rok                 |
| `/register/profile/interests`        | Krok 3 – záujmy                              |
| `/register/profile/expectations`     | Krok 4 – očakávania + pomoc                  |
| `/register/profile/source`           | Krok 5 – čo získate + ako ste sa dozvedeli   |
| `/register/profile/done`             | Vitajte v ONKO KLUBE                         |
| `/reset-password`                    | Zmena hesla                                  |

### Po prihlásení (chránené middleware)

| Cesta                                | Popis                                        |
| ------------------------------------ | -------------------------------------------- |
| `/home`                              | Domov – videá + najbližšie podujatia         |
| `/home/articles`                     | Domov – články                               |
| `/home/recipes`                      | Domov – recepty                              |
| `/home/calendar`                     | Pripravované podujatia                       |
| `/home/notifications`                | Notifikácie                                  |
| `/home/search`                       | Vyhľadávanie                                 |
| `/home/events/[id]`                  | Detail podujatia + registrácia               |
| `/home/events/[id]/registered`      | Potvrdenie registrácie                       |
| `/menu`                              | Sidebar menu                                 |
| `/menu/[slug]`                       | Stránky z menu                               |
| `/profile`                           | Môj profil (všetky uložené info z DB)        |

### Admin (chránené `requireAdmin`)

| Cesta                                | Popis                                        |
| ------------------------------------ | -------------------------------------------- |
| `/admin`                             | Dashboard (počty, najbližšie podujatie)      |
| `/admin/events`                      | Zoznam podujatí + zmazať                     |
| `/admin/events/new`                  | Vytvoriť podujatie                           |
| `/admin/events/[id]`                 | Upraviť + zoznam registrácií                 |
| `/admin/posts`                       | Zoznam obsahu                                |
| `/admin/posts/new`                   | Vytvoriť video / článok / recept             |
| `/admin/posts/[id]`                  | Upraviť obsah                                |
| `/admin/users`                       | Zoznam registrovaných používateľov           |

## Server actions

Všetky mutácie idú cez React Server Actions (`useActionState`):

- `src/lib/actions/auth.ts` — `registerAction`, `loginAction`, `logoutAction`, `resetPasswordAction`
- `src/lib/actions/profile.ts` — `chooseSubscriptionAction`, `saveLocationAction`, `saveDiagnosisAction`, `saveInterestsAction`, `saveExpectationsAction`, `saveSourceAction`
- `src/lib/actions/events.ts` — `createEventAction`, `updateEventAction`, `deleteEventAction`, `registerForEventAction`
- `src/lib/actions/posts.ts` — `createPostAction`, `updatePostAction`, `deletePostAction`, `togglePostLikeAction`

## Logo

Aktuálne sa používa inline SVG placeholder v `src/components/OnkoLogo.tsx`.
Keď budú dodané oficiálne logo súbory, ulož ich do `public/logo/`
(vid `public/logo/README.md`) a swapni inline SVG za `<Image>` v
`OnkoLogo.tsx` / `NieRakovineMark`.
