import Link from "next/link";
import type { PostType } from "@prisma/client";
import { FeedPostMedia } from "@/components/FeedPostMedia";

export function FeedPostItem({
  href,
  type,
  title,
  excerpt,
  imageUrls,
  likeSlot,
}: {
  href: string;
  type: PostType;
  title: string;
  excerpt: string | null;
  imageUrls: string[];
  likeSlot?: React.ReactNode;
}) {
  return (
    <article className="border-b border-brand-purple/10">
      <FeedPostMedia
        href={href}
        type={type}
        imageUrls={imageUrls}
        likeSlot={likeSlot}
      />

      <div className="px-4 pb-4">
        <Link href={href}>
          <h3 className="text-sm font-semibold text-brand-purple">{title}</h3>
          {excerpt && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-brand-purple/70">
              {excerpt}
            </p>
          )}
        </Link>
      </div>
    </article>
  );
}
