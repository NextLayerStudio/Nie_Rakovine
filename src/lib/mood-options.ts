// Shared between client (popup UI) and server (validation) — no server-only import here.

export const MOOD_OPTIONS = [
  { score: 1, emoji: "😔", label: "Veľmi zle" },
  { score: 2, emoji: "🙁", label: "Zle" },
  { score: 3, emoji: "😐", label: "Priemerne" },
  { score: 4, emoji: "🙂", label: "Dobre" },
  { score: 5, emoji: "😄", label: "Výborne" },
] as const;

export type MoodScore = (typeof MOOD_OPTIONS)[number]["score"];

export function isMoodScore(value: number): value is MoodScore {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

export function moodColor(score: number): string {
  switch (score) {
    case 1: return "#E0685E";
    case 2: return "#EA9A5C";
    case 3: return "#E4C860";
    case 4: return "#8FC46E";
    case 5: return "#54B08A";
    default: return "#6F238014";
  }
}
