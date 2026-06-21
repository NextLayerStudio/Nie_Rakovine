"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserAvatarPromptGate } from "@/components/profile/UserAvatarPromptDialog";
import { UserAvatarUploadModal } from "@/components/profile/UserAvatarUploadModal";

/** Reminds users without a profile photo to upload one (home + after registration). */
export function HomeAvatarPrompt({
  fullName,
  avatarUrl,
}: {
  fullName: string;
  avatarUrl?: string | null;
}) {
  const searchParams = useSearchParams();
  const forcePrompt = searchParams.get("setupAvatar") === "1";
  const [currentUrl, setCurrentUrl] = useState(avatarUrl ?? null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  return (
    <>
      <UserAvatarUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        fullName={fullName}
        avatarUrl={currentUrl}
        onUploaded={setCurrentUrl}
      />
      <UserAvatarPromptGate
        avatarUrl={currentUrl}
        forcePrompt={forcePrompt}
        dismissed={promptDismissed}
        onDismiss={() => setPromptDismissed(true)}
        onOpenUpload={() => setUploadOpen(true)}
      />
    </>
  );
}
