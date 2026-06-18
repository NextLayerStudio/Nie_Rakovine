import "server-only";

import { Prisma } from "@prisma/client";
import { getSessionUserForAction } from "@/lib/auth";

export type SafeActionResult = { ok: boolean; message?: string };

export async function requireActionUser(): Promise<
  | { ok: true; user: { id: string; fullName: string } }
  | { ok: false; message: string }
> {
  const user = await getSessionUserForAction();
  if (!user) {
    return { ok: false, message: "Prihláste sa prosím znova." };
  }
  return { ok: true, user };
}

export function prismaActionError(err: unknown, fallback: string): string {
  console.error(fallback, err);
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2021") {
      return "Databáza nie je pripravená. Spustite migrácie na Verceli.";
    }
    if (err.code === "P2002") {
      return fallback;
    }
  }
  return fallback;
}
