import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatCancerTypes } from "@/lib/cancer-type";
import {
  subscriptionPlanLabel,
  subscriptionStatusLabel,
} from "@/lib/user-profile-display";

export function buildAdminUsersWhere(
  query: string,
): Prisma.UserWhereInput {
  const trimmed = query.trim();
  return {
    role: "USER",
    ...(trimmed
      ? {
          OR: [
            { fullName: { contains: trimmed, mode: "insensitive" } },
            { email: { contains: trimmed, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function fetchUsersForExport(query: string) {
  return prisma.user.findMany({
    where: buildAdminUsersWhere(query),
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });
}

function csvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("sk-SK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function formatDateTime(value: Date | null | undefined): string {
  if (!value) return "";
  return new Intl.DateTimeFormat("sk-SK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function yesNo(value: boolean | null | undefined): string {
  if (value == null) return "";
  return value ? "Áno" : "Nie";
}

type ExportUser = Awaited<ReturnType<typeof fetchUsersForExport>>[number];

function userToRow(user: ExportUser): string[] {
  const p = user.profile;
  return [
    user.fullName,
    user.email,
    formatDate(user.birthDate),
    yesNo(user.emailVerified),
    subscriptionPlanLabel(user.subscriptionPlan),
    subscriptionStatusLabel(user.subscriptionStatus),
    formatDate(user.subscriptionStart),
    formatDate(user.subscriptionEnd),
    p?.city ?? "",
    p?.region ?? "",
    p?.diagnosis ?? "",
    p?.diagnosisPhase ?? "",
    p?.diagnosisYear != null ? String(p.diagnosisYear) : "",
    p?.cancerTypes?.length ? formatCancerTypes(p.cancerTypes) : "",
    p?.interests?.length ? p.interests.join("; ") : "",
    yesNo(p?.consentNewsletter),
    formatDateTime(user.createdAt),
  ];
}

const CSV_HEADERS = [
  "Meno",
  "E-mail",
  "Dátum narodenia",
  "E-mail overený",
  "Balíček predplatného",
  "Stav predplatného",
  "Predplatné od",
  "Predplatné do",
  "Mesto",
  "Región",
  "Diagnóza",
  "Fáza liečby",
  "Rok diagnózy",
  "Typy rakoviny",
  "Záujmy",
  "Newsletter",
  "Dátum registrácie",
];

export function buildUsersCsv(
  users: Awaited<ReturnType<typeof fetchUsersForExport>>,
): string {
  const lines = [
    CSV_HEADERS.map(csvCell).join(","),
    ...users.map((user) => userToRow(user).map(csvCell).join(",")),
  ];
  // UTF-8 BOM helps Excel open Slovak characters correctly on Windows.
  return `\uFEFF${lines.join("\r\n")}`;
}

export function usersExportFilename(query: string): string {
  const date = new Date().toISOString().slice(0, 10);
  const suffix = query.trim() ? "-filtrovane" : "";
  return `onko-klub-pouzivatelia${suffix}-${date}.csv`;
}
