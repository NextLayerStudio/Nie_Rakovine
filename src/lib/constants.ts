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
  "iné",
];

export const HELP_OPTIONS = [
  "odborné konzultácie",
  "psychologickú podporu",
  "podporu pri liečbe",
  "komunitné aktivity",
  "informácie o nárokoch",
  "iné",
];

export const GAIN_OPTIONS = [
  "prístup ku komunite",
  "odborné poradenstvo",
  "zľavy u partnerov",
  "podujatia a workshopy",
  "online obsah - videá, články, recepty",
  "iné",
];

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
      "Zaplatíte raz ročne za predplatné a máte neobmedzený prístup.",
    price: "60€ / rok",
    accent: "secondary" as const,
  },
  {
    id: "MONTHLY" as const,
    name: "Mesačné predplatné",
    description:
      "Každý mesiac zaplatíte platbu, ľubovoľne môžete predplatné zrušiť.",
    price: "5€ / mesiac",
    accent: "primary" as const,
  },
];
