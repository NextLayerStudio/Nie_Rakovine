import Link from "next/link";
import { notFound } from "next/navigation";
import { FeedHeaderWrapper } from "@/components/FeedHeaderWrapper";
import { LikeButton } from "@/components/LikeButton";
import { PostImageCarousel } from "@/components/PostImageCarousel";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import {
  buildPostGallery,
  isEmbeddableVideo,
  isLocalMedia,
  postKindLabel,
} from "@/lib/post-display";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const post = await prisma.post.findFirst({
    where: { id, published: true },
    include: {
      profile: true,
      images: { orderBy: { sortOrder: "asc" } },
      _count: { select: { likes: true } },
    },
  });

  if (!post) notFound();

  const like = await prisma.articleLike.findUnique({
    where: { userId_postId: { userId: user.id, postId: post.id } },
  });

  const gallery = buildPostGallery(post.coverUrl, post.images);
  const isEditorial = post.type === "ARTICLE" || post.type === "RECIPE";

  if (isEditorial) {
    return (
      <>
        <FeedHeaderWrapper />
        <EditorialArticle post={post} gallery={gallery} liked={!!like} />
      </>
    );
  }

  return (
    <>
      <FeedHeaderWrapper />
      <article className="px-5 pb-24 pt-2">
        <Link
          href={post.profile ? `/home/profiles/${post.profile.handle}` : "/home"}
          className="text-xs font-semibold text-brand-purple"
        >
          ← Späť
        </Link>

        <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
              {postKindLabel(post.type)}
            </span>
            {post.profile && (
              <span className="text-xs font-medium text-brand-purple/60">
                {post.profile.displayName}
              </span>
            )}
          </div>

          {post.type === "VIDEO" && post.videoUrl ? (
            <VideoBlock url={post.videoUrl} coverUrl={post.coverUrl} />
          ) : (
            <div className="mt-3 px-4">
              <PostImageCarousel
                images={gallery}
                type={post.type}
                aspectClass="aspect-[4/3]"
                maxHeightClass=""
                showDots={gallery.length > 1}
              />
            </div>
          )}

          <div className="px-4 py-4">
            <h1 className="text-lg font-bold leading-snug text-brand-purple">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-brand-purple/75">
                {post.excerpt}
              </p>
            )}
            {post.body && (
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-brand-purple/90">
                {post.body}
              </div>
            )}
            <div className="mt-5 border-t border-brand-purple/10 pt-4">
              <LikeButton postId={post.id} liked={!!like} count={post._count.likes} />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

/* ─── Editorial layout (Article & Recipe) ─── */

type PostWithProfile = Awaited<ReturnType<typeof prisma.post.findFirst>> & {
  profile: NonNullable<unknown> | null;
  _count: { likes: number };
};

function EditorialArticle({
  post,
  gallery,
  liked,
}: {
  post: NonNullable<PostWithProfile>;
  gallery: string[];
  liked: boolean;
}) {
  const backHref =
    post.profile && "handle" in (post.profile as object)
      ? `/home/profiles/${(post.profile as { handle: string }).handle}`
      : "/home";

  const publishedAt = post.publishedAt ?? post.createdAt;
  const dateStr = publishedAt.toLocaleDateString("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const coverUrl = gallery[0] ?? null;

  return (
    <article className="pb-24">
      {/* Back nav */}
      <div className="flex items-center gap-2 px-5 py-3">
        <Link href={backHref} className="flex items-center gap-1 text-sm font-semibold text-zinc-500">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Späť
        </Link>
      </div>

      {/* Category + source */}
      <div className="flex items-center gap-3 px-5 pb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-pink">
          {postKindLabel(post.type)}
        </span>
        {post.profile && "displayName" in (post.profile as object) && (
          <>
            <span className="text-zinc-300">·</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              {(post.profile as { displayName: string }).displayName}
            </span>
          </>
        )}
      </div>

      {/* Headline */}
      <h1 className="px-5 pb-3 text-[26px] font-black leading-tight tracking-tight text-zinc-900">
        {post.title}
      </h1>

      {/* Excerpt — italic subheadline */}
      {post.excerpt && (
        <p className="border-l-4 border-brand-pink/60 px-5 pb-4 pl-5 text-[16px] italic leading-relaxed text-zinc-600">
          {post.excerpt}
        </p>
      )}

      {/* Meta: date */}
      <div className="flex items-center gap-2 px-5 pb-4">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="shrink-0 text-[11px] text-zinc-400">{dateStr}</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Cover image — full bleed, no rounding */}
      {coverUrl && !coverUrl.startsWith("linear-gradient") && (
        <div className="mb-6 aspect-[3/2] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* Body */}
      {post.body && (
        <div className="px-5">
          <MarkdownBody text={post.body} />
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex items-center gap-4 border-t border-zinc-100 px-5 pt-5">
        <LikeButton postId={post.id} liked={liked} count={post._count.likes} />
      </div>
    </article>
  );
}

/* ─── Simple markdown renderer ─── */

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

function MarkdownBody({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="text-xl font-bold leading-snug text-zinc-900 pt-2">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="text-[17px] font-bold leading-snug text-zinc-900">
              {block.slice(4)}
            </h3>
          );
        }
        const listLines = block
          .split("\n")
          .filter((l) => l.startsWith("- "));
        if (listLines.length > 0) {
          return (
            <ul key={i} className="ml-5 list-disc space-y-1.5 text-[17px] leading-relaxed text-zinc-800">
              {listLines.map((line, j) => (
                <li key={j}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[17px] leading-[1.8] text-zinc-800">
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

/* ─── Video block (unchanged) ─── */

function VideoBlock({ url, coverUrl }: { url: string; coverUrl: string | null }) {
  if (isLocalMedia(url) || url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) {
    return (
      <div className="mt-3 bg-black">
        <video src={url} controls playsInline poster={coverUrl ?? undefined} className="aspect-video w-full" />
      </div>
    );
  }
  if (isEmbeddableVideo(url)) {
    return (
      <div className="mt-3 px-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center rounded-2xl bg-brand-purple/5 text-sm font-semibold text-brand-purple"
          style={
            coverUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url(${coverUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          Prehrať video ↗
        </a>
      </div>
    );
  }
  return (
    <div className="mt-3 px-4">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-brand-pink px-4 py-3 text-center text-sm font-semibold text-white">
        Otvoriť video
      </a>
    </div>
  );
}
