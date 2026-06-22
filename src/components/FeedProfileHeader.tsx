"use client";

import { useState } from "react";
import { FollowProfileButton } from "@/components/FollowProfileButton";
import { ProfileDrawer } from "@/components/ProfileDrawer";

export function FeedProfileHeader({
  profileId,
  displayName,
  handle,
  avatarUrl,
  isFollowing = false,
}: {
  profileId?: string | null;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  isFollowing?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const avatarStyle = avatarUrl
    ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" };

  const openDrawer = () => { if (profileId) setDrawerOpen(true); };

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-2">
        <button onClick={openDrawer} className="shrink-0" aria-label={`Zobraziť profil ${displayName}`}>
          <div
            aria-hidden
            className="h-14 w-14 rounded-full ring-2 ring-brand-purple/10"
            style={avatarStyle}
          />
        </button>

        <div className="min-w-0 flex-1">
          <button onClick={openDrawer} className="block w-full text-left">
            <span className="block truncate text-base font-bold text-brand-purple leading-tight">
              {displayName}
            </span>
          </button>
          <span className="block text-xs text-brand-purple/50">@{handle}</span>
        </div>

        {profileId && (
          <div className="shrink-0">
            <FollowProfileButton
              profileId={profileId}
              handle={handle}
              isFollowing={isFollowing}
            />
          </div>
        )}
      </div>

      {profileId && (
        <ProfileDrawer
          profileId={profileId}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}
