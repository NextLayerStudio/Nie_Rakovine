export const APP_NAME = "ONKO KLUB";
export const APP_TAGLINE = "Podpora pre Vás na ceste životom";

export const COLORS = {
  primary: "#6F2380",
  primarySoft: "#6F238066",
  secondary: "#CA6A8A",
  secondarySoft: "#CA6A8ACC",
  white: "#FFFFFF",
} as const;

export const INTEREST_OPTIONS = [
  "cvičenie a relaxácia",
  "psychológia a duševné zdravie",
  "strava a recepty",
  "individuálne konzultácie",
  "online besedy a podujatia",
  "dobrovoľníctvo",
];

export const EXPECTATIONS_OPTIONS = [
  "informácie a poradenstvo",
  "komunitu ľudí s podobnou skúsenosťou",
  "pomoc pri liečbe",
  "psychickú podporu",
  "zľavy u partnerov",
  "tematické podujatia a workshopy",
  "online obsah - videá, články, recepty",
  "iné",
];

export const HELP_OPTIONS = [
  "odborné konzultácie",
  "psychologická podpora",
  "podpora pri liečbe",
  "komunitné aktivity",
  "informácie, na čo mám nárok",
  "iné",
];

/** Legacy labels stored before copy updates — mapped to current HELP_OPTIONS. */
export const HELP_LABEL_ALIASES: Record<string, string> = {
  "psychologickú podporu": "psychologická podpora",
  "podporu pri liečbe": "podpora pri liečbe",
  "informácie o nárokoch": "informácie, na čo mám nárok",
};

/** Step-5 gain answers (removed from form) merged into expectations stats. */
export const LEGACY_GAIN_TO_EXPECTATION: Record<string, string> = {
  "podujatia a workshopy": "tematické podujatia a workshopy",
};

export function normalizeHelpLabel(label: string): string {
  const trimmed = label.trim();
  return HELP_LABEL_ALIASES[trimmed] ?? trimmed;
}

export function normalizeExpectationLabel(label: string): string {
  const trimmed = label.trim();
  return LEGACY_GAIN_TO_EXPECTATION[trimmed] ?? trimmed;
}

export function combinedExpectationAnswers(
  general: string[],
  gain: string[] = [],
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of [...general, ...gain]) {
    const label = normalizeExpectationLabel(raw);
    if (!label || seen.has(label)) continue;
    seen.add(label);
    out.push(label);
  }
  return out;
}

export const HEAR_ABOUT_US_OPTIONS = [
  "sociálne siete (Facebook, Instagram…)",
  "od priateľov / rodiny",
  "od lekára",
  "z médií",
  "iné",
];

export const SUBSCRIPTION_PLANS = [
  {
    id: "YEARLY" as const,
    name: "Ročné predplatné",
    description:
      "Zaplatíte raz ročne. Predplatné môžete kedykoľvek zrušiť.",
    price: "60€ / rok",
    accent: "secondary" as const,
  },
  {
    id: "MONTHLY" as const,
    name: "Mesačné predplatné",
    description:
      "Zaplatíte raz mesačne. Predplatné môžete kedykoľvek zrušiť.",
    price: "5€ / mesiac",
    accent: "primary" as const,
  },
];
