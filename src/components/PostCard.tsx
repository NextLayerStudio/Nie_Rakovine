import Link from "next/link";

export type PostKind = "video" | "article" | "recipe";

export function PostCard({
  href = "#",
  kind,
  title,
  meta,
  ctaLabel,
  bg,
}: {
  href?: string;
  kind: PostKind;
  title: string;
  meta?: string;
  ctaLabel?: string;
  bg?: string; // gradient or color for the cover placeholder
}) {
  return (
    <article className="card mx-4 mb-4 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="rounded-pill bg-brand-purple/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">
          {kindLabel(kind)}
        </span>
        {meta && (
          <span className="text-[10px] font-medium text-brand-purple/60">
            {meta}
          </span>
        )}
      </div>

      <div
        className="mt-3 aspect-[5/4] w-full"
        style={{
          background:
            bg ?? "linear-gradient(135deg, #CA6A8ACC 0%, #6F238066 100%)",
        }}
      />

      <div className="px-4 py-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-brand-purple">
          {title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Páči sa mi"
            className="grid h-8 w-8 place-items-center rounded-full bg-brand-pink-soft/50 text-brand-pink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.65-9.5 9-9.5 9z" />
            </svg>
          </button>
          <Link
            href={href}
            className="rounded-pill bg-brand-pink px-4 py-1.5 text-xs font-semibold text-white"
          >
            {ctaLabel ?? "Pozrieť"}
          </Link>
        </div>
      </div>
    </article>
  );
}

function kindLabel(kind: PostKind) {
  switch (kind) {
    case "video":
      return "Video";
    case "article":
      return "Článok";
    case "recipe":
      return "Recept";
  }
}
