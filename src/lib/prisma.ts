import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Tune Neon pooler URL — avoids P2024 pool exhaustion in Next.js dev. */
function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, "");
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }

  try {
    const normalized = raw.replace(/^postgresql:/, "postgres:");
    const url = new URL(normalized);

    // channel_binding often breaks Prisma + PgBouncer on Neon
    url.searchParams.delete("channel_binding");

    if (!url.searchParams.has("pgbouncer")) {
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

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
