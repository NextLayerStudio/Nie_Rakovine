import Link from "next/link";
import type { PostType } from "@prisma/client";
import { FeedPostItem } from "@/components/FeedPostItem";

export type ProfileSavedPost = {
  id: string;
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  videoUrl: string | null;
  audioUrl: string | null;
  liked: boolean;
  likeCount: number;
  commentCount: number;
};

export function ProfileSavedTab({ posts }: { posts: ProfileSavedPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="px-4 pb-6 pt-6 text-center">
        <p className="text-xs text-brand-purple/55">
          Zatiaľ nemáte uložené žiadne príspevky.
        </p>
        <Link
          href="/home"
          className="mt-3 inline-flex rounded-pill bg-brand-pink px-4 py-2 text-xs font-bold text-white"
        >
          Prejsť na domov
        </Link>
      </div>
    );
  }

  return (
    <section className="pb-4 pt-1">
      {posts.map((post) => (
        <FeedPostItem
          key={post.id}
          postId={post.id}
          href={post.href}
          type={post.type}
          title={post.title}
          excerpt={post.excerpt}
          imageUrls={post.imageUrls}
          videoUrl={post.videoUrl}
          audioUrl={post.audioUrl}
          liked={post.liked}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          saved
        />
      ))}
    </section>
  );
}
