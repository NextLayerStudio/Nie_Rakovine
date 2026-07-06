import { readSession } from "@/lib/auth";
import { canAccessMediaAsset } from "@/lib/media-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Parses a single "bytes=start-end" Range header value against a known total size. */
function parseRange(
  header: string,
  totalSize: number,
): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!match) return null;
  const [, startStr, endStr] = match;
  if (!startStr && !endStr) return null;

  let start: number;
  let end: number;
  if (!startStr) {
    // Suffix range, e.g. "bytes=-500" — last 500 bytes.
    const suffixLength = Number(endStr);
    start = Math.max(0, totalSize - suffixLength);
    end = totalSize - 1;
  } else {
    start = Number(startStr);
    end = endStr ? Number(endStr) : totalSize - 1;
  }

  start = Math.max(0, Math.min(start, Math.max(totalSize - 1, 0)));
  end = Math.max(start, Math.min(end, Math.max(totalSize - 1, 0)));
  return { start, end };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // Metadata-only lookup first — the actual bytes are fetched separately as a
  // byte-range slice so large videos never need to be buffered in full.
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: {
      id: true,
      category: true,
      uploadedById: true,
      mimeType: true,
      size: true,
    },
  });

  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const allowed = await canAccessMediaAsset(asset, session);
  if (!allowed) {
    return new Response("Forbidden", { status: 403 });
  }

  const totalSize = asset.size;
  const rangeHeader = request.headers.get("range");
  const range = rangeHeader ? parseRange(rangeHeader, totalSize) : null;

  const start = range?.start ?? 0;
  const end = range?.end ?? Math.max(totalSize - 1, 0);
  const length = totalSize > 0 ? end - start + 1 : 0;

  const rows = await prisma.$queryRaw<{ chunk: Uint8Array }[]>`
    SELECT substring(data from ${start + 1}::int for ${length}::int) as chunk
    FROM "MediaAsset" WHERE id = ${id}
  `;
  const buffer = Buffer.from(rows[0]?.chunk ?? new Uint8Array(0));

  const headers: Record<string, string> = {
    "Content-Type": asset.mimeType,
    "Content-Length": String(buffer.length),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  };

  if (range) {
    headers["Content-Range"] = `bytes ${start}-${end}/${totalSize}`;
  }

  return new Response(buffer, {
    status: range ? 206 : 200,
    headers,
  });
}
