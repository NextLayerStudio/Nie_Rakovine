import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { MAX_BLOB_VIDEO_BYTES, VIDEO_CONTENT_TYPES } from "@/lib/uploads";

export const runtime = "nodejs";

/**
 * Issues short-lived client tokens for admin video uploads. The heavy bytes
 * go straight from the browser to Blob storage — this route only authorizes
 * the upload and never sees the file itself.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
          throw new Error("Not authorized");
        }

        return {
          allowedContentTypes: VIDEO_CONTENT_TYPES,
          maximumSizeInBytes: MAX_BLOB_VIDEO_BYTES,
          addRandomSuffix: true,
          allowOverwrite: false,
          cacheControlMaxAge: 30 * 24 * 60 * 60,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: message },
      { status: message === "Not authorized" ? 401 : 400 },
    );
  }
}
