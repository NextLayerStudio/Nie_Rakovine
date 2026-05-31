/**
 * Ensures Prisma env vars exist before CLI commands.
 *
 * Vercel Storage / Neon integration uses STORAGE_* names; Prisma expects
 * DATABASE_URL and DATABASE_URL_UNPOOLED — this script maps them.
 *
 * postinstall: use --generate-only (no real DB needed during npm install).
 * build: requires a real URL from Vercel env (STORAGE_* or standard names).
 */
import fs from "node:fs";
import path from "node:path";

const PLACEHOLDER =
  "postgresql://build:build@127.0.0.1:5432/build?schema=public";

const generateOnly = process.argv.includes("--generate-only");

const POOLED_KEYS = [
  "DATABASE_URL",
  "STORAGE_DATABASE_URL",
  "POSTGRES_URL",
];

const UNPOOLED_KEYS = [
  "DATABASE_URL_UNPOOLED",
  "STORAGE_DATABASE_URL_UNPOOLED",
  "DIRECT_URL",
  "POSTGRES_URL_NON_POOLING",
];

function trimQuotes(v) {
  return v?.trim().replace(/^["']|["']$/g, "") ?? "";
}

function firstEnv(keys) {
  for (const key of keys) {
    const v = trimQuotes(process.env[key]);
    if (v) return v;
  }
  return "";
}

function deriveFromPooled(pooled) {
  const raw = trimQuotes(pooled);
  if (!raw) return null;
  try {
    const normalized = raw.replace(/^postgresql:/, "postgres:");
    const url = new URL(normalized);
    if (url.hostname.includes("-pooler")) {
      url.hostname = url.hostname.replace("-pooler", "");
    }
    url.searchParams.delete("channel_binding");
    url.searchParams.delete("pgbouncer");
    return url.toString().replace(/^postgres:/, "postgresql:");
  } catch {
    return raw.replace("-pooler", "");
  }
}

function resolveUnpooledUrl(pooledUrl) {
  const explicit = firstEnv(UNPOOLED_KEYS);
  if (explicit) return explicit;
  return deriveFromPooled(pooledUrl);
}

function upsertEnvFile(key, value) {
  const envPath = path.join(process.cwd(), ".env");
  let lines = [];
  if (fs.existsSync(envPath)) {
    lines = fs.readFileSync(envPath, "utf8").split("\n");
    lines = lines.filter((line) => !line.startsWith(`${key}=`));
  }
  const safe = value.replace(/"/g, '\\"');
  lines.push(`${key}="${safe}"`);
  fs.writeFileSync(envPath, lines.filter(Boolean).join("\n") + "\n");
}

let databaseUrl = firstEnv(POOLED_KEYS);
let unpooled = resolveUnpooledUrl(databaseUrl);

if (!databaseUrl || !unpooled) {
  if (generateOnly) {
    if (!databaseUrl) databaseUrl = PLACEHOLDER;
    if (!unpooled) unpooled = deriveFromPooled(databaseUrl) ?? PLACEHOLDER;
    console.log(
      "[ensure-db-env] generate-only: placeholder env (install phase, no DB needed)",
    );
  } else {
    console.error(
      "\n[ensure-db-env] Missing database URL for Prisma migrations.\n" +
        "On Vercel with Storage, you should have STORAGE_DATABASE_URL.\n" +
        "Or set DATABASE_URL manually in Environment Variables.\n",
    );
    process.exit(1);
  }
} else {
  const source = trimQuotes(process.env.STORAGE_DATABASE_URL)
    ? "STORAGE_DATABASE_URL"
    : "DATABASE_URL";
  console.log(`[ensure-db-env] Mapped ${source} → DATABASE_URL for Prisma`);
}

process.env.DATABASE_URL = databaseUrl;
process.env.DATABASE_URL_UNPOOLED = unpooled;
upsertEnvFile("DATABASE_URL", databaseUrl);
upsertEnvFile("DATABASE_URL_UNPOOLED", unpooled);
