import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getAppUrlFromEnv } from "@/lib/email/brand";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Public — no auth. Ticket ids are unguessable cuids, same trust model as other public asset ids. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const ticket = await prisma.eventTicket.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!ticket) {
    return new Response("Not found", { status: 404 });
  }

  const appUrl = getAppUrlFromEnv();
  const ticketUrl = `${appUrl}/podujatia/listok/${ticket.id}`;

  const png = await QRCode.toBuffer(ticketUrl, {
    type: "png",
    width: 320,
    margin: 1,
    color: { dark: "#6F2380", light: "#FFFFFF" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
