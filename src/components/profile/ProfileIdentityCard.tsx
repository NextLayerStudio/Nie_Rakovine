import type { MembershipSubscriptionInfo } from "@/lib/membership-card";
import { ProfileAvatarSection } from "@/components/profile/ProfileAvatarSection";

export function ProfileIdentityCard({
  fullName,
  userId,
  profile,
  subscription,
  avatarUrl,
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
  avatarUrl?: string | null;
  forceAvatarPrompt?: boolean;
}) {
  return (
    <ProfileAvatarSection
      fullName={fullName}
      userId={userId}
      profile={profile}
      subscription={subscription}
      initialAvatarUrl={avatarUrl}
      forceAvatarPrompt={forceAvatarPrompt}
    />
  );
}
