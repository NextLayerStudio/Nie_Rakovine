import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: { mimeType: true, data: true, size: true },
  });

  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  const buffer = Buffer.from(asset.data);

  return new Response(buffer, {
    headers: {
      "Content-Type": asset.mimeType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
