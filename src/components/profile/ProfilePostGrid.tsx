"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PostType } from "@prisma/client";
import { PostDetailModal } from "@/components/PostDetailModal";

export type ProfileGridPost = {
  id: string;
  type: PostType;
  title: string;
  coverUrl: string | null;
  fallback: string;
  imageCount: number;
};

// ARTICLE, VIDEO, AUDIO open the full detail page (content library style).
// Everything else (PHOTO, RECIPE, NEWS…) opens the fullscreen modal.
function isContentLibraryType(type: PostType): boolean {
  return type === "ARTICLE" || type === "VIDEO" || type === "AUDIO";
}

export function ProfilePostGrid({
  posts,
  emptyMessage = "Zatiaľ žiadne príspevky.",
  profileHandle,
}: {
  posts: ProfileGridPost[];
  emptyMessage?: string;
  profileHandle?: string;
}) {
  const router = useRouter();
  const [activePostId, setActivePostId] = useState<string | null>(null);

  function handlePostClick(post: ProfileGridPost) {
    if (isContentLibraryType(post.type)) {
      const from = profileHandle
        ? `/home/profiles/${profileHandle}`
        : "/home/profiles";
      router.push(`/home/posts/${post.id}?from=${encodeURIComponent(from)}`);
    } else {
      setActivePostId(post.id);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-16 text-sm text-brand-purple/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-px bg-brand-purple/10">
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => handlePostClick(post)}
            className="relative aspect-square overflow-hidden"
            aria-label={`Otvoriť príspevok ${post.title}`}
          >
            {post.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{ background: post.fallback }}
              />
            )}

            {post.type === "VIDEO" && <TypeBadge icon="play" />}
            {post.type === "ARTICLE" && <TypeBadge icon="article" />}
            {post.type === "RECIPE" && <TypeBadge icon="recipe" />}
            {post.type === "PHOTO" && post.imageCount > 1 && (
              <TypeBadge icon="stack" />
            )}
          </button>
        ))}
      </div>

      {activePostId && (
        <PostDetailModal
          postId={activePostId}
          onClose={() => setActivePostId(null)}
        />
      )}
    </>
  );
}

function TypeBadge({ icon }: { icon: "play" | "article" | "recipe" | "stack" }) {
  return (
    <div className="absolute right-1.5 top-1.5">
      <div className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
        {icon === "play" && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3 translate-x-px text-white"
            fill="currentColor"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {icon === "article" && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M4 6h16M4 10h16M4 14h10" strokeLinecap="round" />
          </svg>
        )}
        {icon === "recipe" && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M12 2v7m0 0c0-3.5-4-5-4-5m4 5c0-3.5 4-5 4-5M5 9h14l-1.5 11H6.5L5 9z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {icon === "stack" && (
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <rect x="5" y="5" width="14" height="14" rx="2" />
            <rect x="2" y="2" width="14" height="14" rx="2" />
          </svg>
        )}
      </div>
    </div>
  );
}
