"use client";

import { useMemo, useState } from "react";
import {
  CLUB_PROFILE_POST_TYPES,
  type ClubProfilePostCategory,
} from "@/lib/club-profile-posts";
import { postKindLabel } from "@/lib/post-display";
import {
  ProfilePostGrid,
  type ProfileGridPost,
} from "@/components/profile/ProfilePostGrid";

export function ClubProfilePostsSection({ posts }: { posts: ProfileGridPost[] }) {
  const [active, setActive] = useState<ClubProfilePostCategory>("all");

  const filtered = useMemo(
    () => (active === "all" ? posts : posts.filter((post) => post.type === active)),
    [active, posts],
  );

  return (
    <>
      <section className="border-y border-brand-purple/10 bg-brand-purple/[0.04]">
        <ClubProfilePostTabBar active={active} onChange={setActive} />
      </section>
      <ProfilePostGrid
        posts={filtered}
        emptyMessage={
          active === "all"
            ? "Zatiaľ žiadne príspevky."
            : `V kategórii „${postKindLabel(active)}“ zatiaľ nie sú príspevky.`
        }
      />
    </>
  );
}

function ClubProfilePostTabBar({
  active,
  onChange,
}: {
  active: ClubProfilePostCategory;
  onChange: (category: ClubProfilePostCategory) => void;
}) {
  const tabs: { id: ClubProfilePostCategory; label: string }[] = [
    { id: "all", label: "Všetko" },
    ...CLUB_PROFILE_POST_TYPES.map((type) => ({
      id: type as ClubProfilePostCategory,
      label: postKindLabel(type),
    })),
  ];

  return (
    <nav
      aria-label="Kategórie príspevkov"
      className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-px-4 px-4 py-2.5"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              onChange(tab.id);
              document
                .querySelector("[data-app-scroll]")
                ?.scrollTo({ top: 0, behavior: "instant" });
            }}
            className={`shrink-0 rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
              isActive
                ? "border-brand-pink bg-brand-pink text-white shadow-sm"
                : "border-brand-purple/20 bg-white text-brand-purple"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
