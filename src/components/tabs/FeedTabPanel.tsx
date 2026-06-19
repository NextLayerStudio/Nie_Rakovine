"use client";

import { useEffect, useState } from "react";
import { FeedProfileHeader } from "@/components/FeedProfileHeader";
import { FeedPostItem } from "@/components/FeedPostItem";
import { FeedEventItem } from "@/components/FeedEventItem";
import { fetchFeedTabAction } from "@/lib/actions/tabs";
import { buildHomeFeed } from "@/lib/feed";
import { buildPostGallery, postPublicHref } from "@/lib/post-display";
import { defaultProfileLabel } from "@/lib/feed";
import { FEED_DISPLAY_LIMIT } from "@/lib/feed-queries";
import type { CancerType } from "@prisma/client";

type FeedData = Awaited<ReturnType<typeof fetchFeedTabAction>> & { ok: true };

function TabSkeleton() {
  return (
    <div className="space-y-4 px-4 py-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-brand-purple/10" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 rounded-full bg-brand-purple/10" />
              <div className="h-2.5 w-16 rounded-full bg-brand-purple/8" />
            </div>
          </div>
          <div className="h-52 w-full rounded-2xl bg-brand-purple/10" />
          <div className="h-3 w-3/4 rounded-full bg-brand-purple/8" />
        </div>
      ))}
    </div>
  );
}

export function FeedTabPanel() {
  const [data, setData] = useState<FeedData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetchFeedTabAction()
      .then((res) => {
        if (res.ok) setData(res as FeedData);
        else setFailed(true);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed)
    return (
      <div className="px-5 py-8 text-center text-sm text-brand-purple/50">
        Obsah sa nepodarilo načítať. Skúste obnoviť stránku.
      </div>
    );

  if (!data) return <TabSkeleton />;

  const likedIds = new Set(data.likedPostIds);
  const savedIds = new Set(data.savedPostIds);
  const followingIds = new Set(data.followingProfileIds);
  const registeredIds = new Set(data.registeredEventIds);
  const [firstName, ...rest] = data.userName.split(" ");
  const lastName = rest.join(" ");

  const feed = buildHomeFeed(
    data.posts,
    data.events,
    data.userTypes as CancerType[],
    FEED_DISPLAY_LIMIT,
  );

  if (feed.length === 0) {
    return (
      <div className="mx-4 mt-4 rounded-3xl bg-white p-6 text-center text-xs text-brand-purple/70 shadow-card">
        Zatiaľ žiadny obsah. Admin môže pridať príspevky v profiloch.
      </div>
    );
  }

  return (
    <section>
      {feed.map((item) => {
        if (item.kind === "event") {
          const e = item.event;
          const label = defaultProfileLabel(e.profile);
          return (
            <div key={`event-${e.id}`}>
              <FeedProfileHeader
                profileId={e.profile?.id}
                isFollowing={e.profile ? followingIds.has(e.profile.id) : false}
                {...label}
              />
              <FeedEventItem
                id={e.id}
                title={e.title}
                description={e.description}
                startsAt={e.startsAt.toISOString()}
                endsAt={e.endsAt?.toISOString() ?? null}
                location={e.location}
                coverUrl={e.coverUrl}
                isRegistered={registeredIds.has(e.id)}
                defaultName={firstName ?? ""}
                defaultSurname={lastName}
              />
            </div>
          );
        }

        const p = item.post;
        const label = defaultProfileLabel(p.profile);
        return (
          <div key={`post-${p.id}`}>
            <FeedProfileHeader
              profileId={p.profile?.id}
              isFollowing={p.profile ? followingIds.has(p.profile.id) : false}
              {...label}
            />
            <FeedPostItem
              postId={p.id}
              href={postPublicHref(p)}
              type={p.type}
              title={p.title}
              excerpt={p.excerpt}
              imageUrls={buildPostGallery(p.coverUrl, p.images)}
              videoUrl={p.videoUrl ?? null}
              liked={likedIds.has(p.id)}
              likeCount={p._count.likes}
              saved={savedIds.has(p.id)}
            />
          </div>
        );
      })}
    </section>
  );
}
