"use client";

import { useState } from "react";
import Link from "next/link";
import { MembershipDiscountCard } from "@/components/membership/MembershipDiscountCard";
import { NoScreenshotGuard } from "@/components/membership/NoScreenshotGuard";
import { UserAvatarPromptGate } from "@/components/profile/UserAvatarPromptDialog";
import { UserAvatarUploadModal } from "@/components/profile/UserAvatarUploadModal";
import type { MembershipSubscriptionInfo } from "@/lib/membership-card";
import { profileDiagnosisLine } from "@/lib/profile-page";

export function ProfileAvatarSection({
  fullName,
  userId,
  profile,
  subscription,
  initialAvatarUrl,
  forceAvatarPrompt = false,
}: {
  fullName: string;
  userId: string;
  profile: {
    diagnosis: string | null;
    diagnosisPhase: string | null;
    cancerTypes: string[];
  } | null;
  subscription: MembershipSubscriptionInfo;
  initialAvatarUrl?: string | null;
  forceAvatarPrompt?: boolean;
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);
  const subtitle = profileDiagnosisLine(profile);

  return (
    <div className="mx-4">
      <NoScreenshotGuard>
        <MembershipDiscountCard
          fullName={fullName}
          userId={userId}
          avatarUrl={avatarUrl}
          subscription={subscription}
          onPhotoClick={() => setUploadOpen(true)}
        />
      </NoScreenshotGuard>

      {subtitle &&
        subtitle !== "Člen ONKO KLUBU" &&
        subtitle !== "Pacient ONKO KLUBU" && (
          <p className="mt-2 px-1 text-center text-[11px] text-brand-purple/55">
            {subtitle}
          </p>
        )}

      <Link
        href="/menu/zlavova-karta"
        className="mt-2 block text-center text-[11px] font-semibold text-brand-pink"
      >
        Otvoriť zľavovú kartu
      </Link>

      <UserAvatarUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        fullName={fullName}
        avatarUrl={avatarUrl}
        onUploaded={setAvatarUrl}
      />

      <UserAvatarPromptGate
        avatarUrl={avatarUrl}
        forcePrompt={forceAvatarPrompt}
        dismissed={promptDismissed}
        onDismiss={() => setPromptDismissed(true)}
        onOpenUpload={() => setUploadOpen(true)}
      />
    </div>
  );
}
