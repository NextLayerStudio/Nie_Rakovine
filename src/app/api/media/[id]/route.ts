import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    select: { mimeType: true, data: true },
  });

  if (!asset) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(asset.data), {
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
