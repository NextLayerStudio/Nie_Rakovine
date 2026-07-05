import { readSession } from "@/lib/auth";
import { canAccessMediaAsset } from "@/lib/media-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: {
      id: true,
      category: true,
      uploadedById: true,
      mimeType: true,
      data: true,
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

  const buffer = Buffer.from(asset.data);

  return new Response(buffer, {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
