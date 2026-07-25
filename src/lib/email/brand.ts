export const BRAND = {
  purple: "#6F2380",
  pink: "#FDA4C7",
  background: "#FFF3F9",
  text: "#4A1A56",
  textMuted: "#6F2380B3",
  white: "#FFFFFF",
} as const;

/** Dark-mode equivalents, applied via the .ok-* classes in emailDarkModeStyleTag(). */
export const BRAND_DARK = {
  background: "#121212",
  surface: "#221A26",
  text: "#F3E6F5",
  textMuted: "#C9A9D6",
} as const;

export function getAppUrlFromEnv(env: NodeJS.ProcessEnv = process.env): string {
  const raw =
    env.APP_URL?.trim() ||
    env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
