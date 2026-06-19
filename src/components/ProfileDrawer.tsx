"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchProfileDrawerAction } from "@/lib/actions/profile-drawer";
import { toggleProfileFollowAction } from "@/lib/actions/follows";
import { postCoverFallback } from "@/lib/post-display";
import type { PostType } from "@prisma/client";

type DrawerData = Awaited<ReturnType<typeof fetchProfileDrawerAction>> & { ok: true };

export function ProfileDrawer({
  profileId,
  open,
  onClose,
}: {
  profileId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<DrawerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchProfileDrawerAction(profileId).then((res) => {
      if (res.ok) {
        setData(res as DrawerData);
        setFollowing(res.isFollowing);
      }
      setLoading(false);
    });
  }, [open, profileId]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleFollow = () => {
    setFollowing(true);
    setShowConfirm(true);
    timerRef.current = setTimeout(() => setShowConfirm(false), 1400);
    const fd = new FormData();
    fd.set("profileId", profileId);
    fd.set("handle", data?.profile.handle ?? "");
    startTransition(() => { void toggleProfileFollowAction(fd); });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[101] mx-auto max-w-[430px]",
          "flex max-h-[88svh] flex-col rounded-t-3xl bg-white",
          "transform transition-transform duration-300 ease-in-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        {/* Handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-brand-purple/20" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Zatvoriť"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-brand-purple/10 text-brand-purple"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="space-y-3 p-5">
              <div className="h-24 w-24 rounded-full bg-brand-purple/8 animate-pulse mx-auto" />
              <div className="h-5 w-40 rounded-xl bg-brand-purple/8 animate-pulse mx-auto" />
              <div className="h-3 w-56 rounded-xl bg-brand-purple/5 animate-pulse mx-auto" />
            </div>
          )}

          {!loading && data && (
            <>
              {/* Cover / Avatar header */}
              <div className="relative">
                <div
                  className="h-28 w-full"
                  style={{
                    background: data.profile.coverUrl
                      ? `url(${data.profile.coverUrl}) center/cover`
                      : "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
                  }}
                />
                <div className="absolute -bottom-10 left-5">
                  <div
                    className="h-20 w-20 rounded-full ring-4 ring-white"
                    style={
                      data.profile.avatarUrl
                        ? { backgroundImage: `url(${data.profile.avatarUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                        : { background: "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)" }
                    }
                  />
                </div>
              </div>

              {/* Info */}
              <div className="mt-12 px-5 pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-brand-purple leading-tight">
                      {data.profile.displayName}
                    </h2>
                    <p className="text-xs text-brand-purple/50">@{data.profile.handle}</p>
                  </div>

                  {/* Follow button */}
                  {!following ? (
                    <button
                      onClick={handleFollow}
                      className="shrink-0 rounded-xl border border-brand-pink px-4 py-1.5 text-sm font-semibold text-brand-pink transition hover:bg-brand-pink/5 active:scale-95"
                    >
                      Sledovať
                    </button>
                  ) : showConfirm ? (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-purple/60">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Sledované
                    </span>
                  ) : null}
                </div>

                {/* Bio */}
                {data.profile.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-brand-purple/80">
                    {data.profile.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-4 flex gap-6">
                  <div className="text-center">
                    <p className="text-lg font-bold text-brand-purple">{data.postCount}</p>
                    <p className="text-[11px] text-brand-purple/50">príspevkov</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-brand-purple">{data.followerCount}</p>
                    <p className="text-[11px] text-brand-purple/50">sledujúcich</p>
                  </div>
                </div>
              </div>

              {/* Recent posts grid */}
              {data.recentPosts.length > 0 && (
                <div className="mt-4 px-5 pb-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-purple/50">
                    Príspevky
                  </p>
                  <div className="grid grid-cols-3 gap-1">
                    {data.recentPosts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/home/posts/${p.id}`}
                        onClick={onClose}
                        className="relative aspect-square overflow-hidden rounded-xl"
                      >
                        {p.coverUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.coverUrl}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{ background: postCoverFallback(p.type as PostType) }}
                          />
                        )}
                        {p.type === "VIDEO" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid h-7 w-7 place-items-center rounded-full bg-white/80 text-brand-purple">
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-px" fill="currentColor" aria-hidden>
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/home/profiles/${data.profile.handle}`}
                    onClick={onClose}
                    className="mt-3 block text-center text-xs font-semibold text-brand-purple/50 hover:text-brand-purple"
                  >
                    Zobraziť celý profil →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
