import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Vercel Storage / Neon may expose STORAGE_DATABASE_URL instead of DATABASE_URL. */
function getRawDatabaseUrl(): string {
  for (const key of ["DATABASE_URL", "STORAGE_DATABASE_URL", "POSTGRES_URL"]) {
    const raw = process.env[key]?.trim().replace(/^["']|["']$/g, "");
    if (raw) return raw;
  }
  throw new Error(
    "DATABASE_URL is not set (also checked STORAGE_DATABASE_URL)",
  );
}

/**
 * Neon on Vercel: use the *pooler* URL for runtime (host contains "-pooler").
 * Only then add pgbouncer=true — never add it to the direct / unpooled URL.
 */
function getDatabaseUrl(): string {
  const raw = getRawDatabaseUrl();

  try {
    const normalized = raw.replace(/^postgresql:/, "postgres:");
    const url = new URL(normalized);

    // channel_binding breaks Prisma + PgBouncer on Neon
    url.searchParams.delete("channel_binding");

    const isPooler =
      url.hostname.includes("-pooler") ||
      url.searchParams.get("pgbouncer") === "true";

    if (isPooler && url.searchParams.get("pgbouncer") !== "true") {
      url.searchParams.set("pgbouncer", "true");
    }

    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "5");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "15");
    }
    if (!url.searchParams.has("sslmode")) {
      url.searchParams.set("sslmode", "require");
    }

    return url.toString().replace(/^postgres:/, "postgresql:");
  } catch {
    return raw;
  }
}

function createPrismaClient() {
  return new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

/** Reuse one client per serverless instance (required for Neon pooler on Vercel). */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
