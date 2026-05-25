# ONKO KLUB

Mobile-first podporná webová aplikácia pre ľudí s onkologickým ochorením.
Postavená výhradne na **Next.js + TypeScript + Tailwind CSS** s **Prisma**
ako ORM pripraveným na **Neon (Vercel Postgres)**.

## Tech stack

- **Next.js 15** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** s vlastnou paletou ONKO KLUBU
- **Prisma** (PostgreSQL / Neon) — schéma je pripravená, pripojenie sa spraví
  hneď po prvom pushi
- Vykreslenie na mobil prvé (`phone-shell` kontajner), na desktope sa zobrazí
  ako náhľad telefónu

## Farebná paleta

| Token              | HEX         | Použitie                              |
| ------------------ | ----------- | ------------------------------------- |
| `brand.purple`     | `#6F2380`   | Primárna (CTA, nadpisy, ikony)        |
| `brand.purple-soft`| `#6F238066` | Tlmené plochy, gradient               |
| `brand.pink`       | `#CA6A8A`   | Sekundárna (tlačidlá, akcent)         |
| `brand.pink-soft`  | `#CA6A8ACC` | Vstupy, prekryvy                      |
| `brand.white`      | `#FFFFFF`   | Pozadie kariet, kontrast              |

Použiť napr. cez `bg-brand-purple` / `text-brand-pink` v Tailwinde.

## Štruktúra obrazoviek

| Cesta                                | Obrazovka z dizajnu                              |
| ------------------------------------ | ------------------------------------------------ |
| `/`                                  | (1) Splash screen                                |
| `/welcome`                           | (2) Welcome — Prihlásiť / Registrovať            |
| `/login`                             | (3) Prihlásenie                                  |
| `/register`                          | (3) Nový účet                                    |
| `/register/subscription`             | (2) Výber predplatného (ročné / mesačné)         |
| `/register/profile/location`         | (3) Miesto, kde sa nachádzate                    |
| `/register/profile/diagnosis`        | (3) Diagnóza, fáza, rok                          |
| `/register/profile/interests`        | (3) O čo máte záujem                             |
| `/register/profile/expectations`     | (3) Očakávania + s čím pomôcť                    |
| `/register/profile/source`           | (3) Čo získate + odkiaľ ste sa dozvedeli         |
| `/register/profile/done`             | (3) Vitajte v ONKO KLUBE                         |
| `/reset-password`                    | (3) Zmena hesla                                  |
| `/home`                              | (4) Domov — videá                                |
| `/home/articles`                     | (4) Domov — články                               |
| `/home/recipes`                      | (4) Domov — recepty                              |
| `/home/events/yoga`                  | (4) Registrácia na podujatie ONKO YOGA           |
| `/menu`                              | (4) Menu (sidebar)                               |
| `/admin`                             | Admin — prehľad (mimo mobilného shellu)          |
| `/admin/events`, `/admin/events/new` | Admin — správa podujatí                          |

## Lokálny vývoj

```bash
npm install
npm run dev
```

App beží na `http://localhost:3000`.

## Pripojenie Neon (po prvom pushi)

1. Vo Vercel vytvor projekt a pridaj **Neon Postgres** integráciu.
2. Skopíruj `DATABASE_URL` a `DIRECT_URL` do `.env.local`
   (vzor je v `.env.example`).
3. Vygeneruj klienta a spusti prvú migráciu:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   ```

4. (voliteľné) Otvor Prisma Studio:

   ```bash
   npm run db:studio
   ```

## Admin

Pre administračný účet (správa podujatí, obsahu a používateľov) je v schéme
pripravená rola `ADMIN`. Bootstrap admina sa vytvorí seedom po pripojení DB
(`ADMIN_EMAIL` / `ADMIN_PASSWORD` v `.env.local`).

## Poznámky k dizajnu

- Aplikácia je primárne pre **mobilné zariadenia** — používame `phone-shell`
  kontajner šírky 420 px, na desktope sa centruje s tieňom ako náhľad telefónu.
- `viewport` má `userScalable: false` a `viewportFit: "cover"` pre PWA-like
  zobrazenie na iOS.
- Slovenská lokalizácia (`lang="sk"`) priamo v `RootLayout`.
