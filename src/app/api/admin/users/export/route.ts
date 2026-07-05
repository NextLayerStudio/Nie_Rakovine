import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import {
  buildUsersCsv,
  fetchUsersForExport,
  usersExportFilename,
} from "@/lib/admin-users-export";

export async function GET(request: Request) {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const users = await fetchUsersForExport(query);
  const csv = buildUsersCsv(users);
  const filename = usersExportFilename(query);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
