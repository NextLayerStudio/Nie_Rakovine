"use client";

import { useState, type ReactNode } from "react";
import { ForumDetailHeader } from "@/components/ForumDetailHeader";
import { ForumFollowButton } from "@/components/ForumFollowButton";
import { forumAvatarStyle } from "@/lib/avatar-style";

export function ForumDetailLayout({
  backHref,
  forumId,
  initialJoined,
  imageUrl,
  accentColor,
  title,
  description,
  memberCount,
  children,
}: {
  backHref: string;
  forumId: string;
  initialJoined: boolean;
  imageUrl: string | null;
  accentColor: string | null;
  title: string;
  description: string | null;
  memberCount: number;
  children: ReactNode;
}) {
  const [joined, setJoined] = useState(initialJoined);

  return (
    <>
      <ForumDetailHeader
        backHref={backHref}
        imageUrl={imageUrl}
        accentColor={accentColor}
        title={title}
        newPostHref={joined ? `/home/forums/${forumId}/new` : undefined}
      />

      <section className="px-5 pt-4">
        <div className="flex items-start gap-4">
          <div
            aria-hidden
            className="h-[72px] w-[72px] shrink-0 rounded-2xl bg-cover bg-center ring-[3px] ring-white shadow-md"
            style={forumAvatarStyle({ imageUrl, accentColor })}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-base font-bold leading-snug text-brand-purple">
                {title}
              </h1>
              <ForumFollowButton
                forumId={forumId}
                isFollowing={joined}
                onFollowingChange={setJoined}
                size="md"
                joinLabel="Zapojiť sa"
                joinedLabel="Zapojené"
              />
            </div>
            <span className="forum-chip mt-2">{memberCount} členov</span>
          </div>
        </div>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-brand-purple/80">
            {description}
          </p>
        )}
      </section>

      {children}
    </>
  );
}
