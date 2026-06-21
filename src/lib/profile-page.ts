export const PROFILE_SLOGANS = [
  "Každý deň je príležitosťou na nový začiatok.",
  "Spolu sme silnejší — ONKO KLUB je tu pre vás.",
  "Starostlivosť o seba nie je luxus, je to nevyhnutnosť.",
  "Veríme vo vašu silu a odhodlanie.",
];

export type ProfileTab = "calendar" | "forums" | "discounts" | "saved";

export function parseProfileTab(value: string | null | undefined): ProfileTab {
  if (value === "forums" || value === "discounts" || value === "saved") {
    return value;
  }
  return "calendar";
}

export function profileDiagnosisLine(profile: {
  diagnosis: string | null;
  diagnosisPhase: string | null;
  cancerTypes: string[];
} | null): string {
  if (!profile) return "Člen ONKO KLUBU";
  const parts = [profile.diagnosis, profile.diagnosisPhase].filter(Boolean);
  if (parts.length > 0) return parts.join(" · ");
  if (profile.cancerTypes.length > 0) {
    return profile.cancerTypes.join(", ");
  }
  return "Pacient ONKO KLUBU";
}

/** Display-friendly membership number derived from user id. */
export function membershipBarcode(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const digits = String(hash).padStart(12, "0").slice(0, 12);
  return `${digits[0]} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 12)} 8`;
}
