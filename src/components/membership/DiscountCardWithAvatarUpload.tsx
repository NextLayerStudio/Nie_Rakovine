"use client";

import { useState } from "react";
import { MembershipDiscountCard } from "@/components/membership/MembershipDiscountCard";
import { UserAvatarUploadModal } from "@/components/profile/UserAvatarUploadModal";
import type { MembershipSubscriptionInfo } from "@/lib/membership-card";

export function DiscountCardWithAvatarUpload({
  fullName,
  userId,
  initialAvatarUrl,
  subscription,
}: {
  fullName: string;
  userId: string;
  initialAvatarUrl?: string | null;
  subscription: MembershipSubscriptionInfo;
}) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? null);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <MembershipDiscountCard
        fullName={fullName}
        userId={userId}
        avatarUrl={avatarUrl}
        subscription={subscription}
        onPhotoClick={() => setUploadOpen(true)}
      />
      <UserAvatarUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        fullName={fullName}
        avatarUrl={avatarUrl}
        onUploaded={setAvatarUrl}
      />
    </>
  );
}
