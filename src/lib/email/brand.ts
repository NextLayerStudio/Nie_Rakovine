export const BRAND = {
  purple: "#6F2380",
  pink: "#CA6A8A",
  pinkDark: "#B8557A",
  background: "#FFF3F9",
  text: "#4A1A56",
  textMuted: "#6F2380B3",
  white: "#FFFFFF",
} as const;

export function getAppUrlFromEnv(env: NodeJS.ProcessEnv = process.env): string {
  const raw =
    env.APP_URL?.trim() ||
    env.NEXTAUTH_URL?.trim() ||
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
