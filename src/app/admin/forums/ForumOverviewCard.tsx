import Link from "next/link";
import type { Forum } from "@prisma/client";
import { forumAvatarStyle } from "@/lib/avatar-style";
import { cancerTypeLabel } from "@/lib/cancer-type";

export function ForumOverviewCard({
  forum,
  memberCount,
  threadCount,
}: {
  forum: Pick<
    Forum,
    | "id"
    | "title"
    | "description"
    | "imageUrl"
    | "accentColor"
    | "published"
    | "cancerTypes"
  >;
  memberCount: number;
  threadCount: number;
}) {
  const accent = forum.accentColor ?? "#6F2380";

  return (
    <section
      className="admin-card overflow-hidden"
      style={{
        background: `linear-gradient(145deg, ${accent}18 0%, white 55%)`,
      }}
    >
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center sm:flex-row sm:items-start sm:text-left">
        <div
          className="h-28 w-28 shrink-0 rounded-lg bg-cover bg-center ring-4 ring-white shadow-md"
          style={forumAvatarStyle(forum)}
          role="img"
          aria-label={`Profilová fotka fóra — ${forum.title}`}
        />

        <div className="mt-5 min-w-0 flex-1 sm:mt-0 sm:pl-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span
                  className={`admin-badge ${
                    forum.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {forum.published ? "Publikované" : "Skryté"}
                </span>
                <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                  {memberCount} členov
                </span>
                <span className="admin-badge bg-brand-purple/8 text-brand-purple/80">
                  {threadCount} príspevkov
                </span>
              </div>
            </div>
            <Link
              href={`/admin/forums/${forum.id}/edit`}
              className="admin-btn-primary shrink-0"
            >
              Upraviť fórum
            </Link>
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-purple/50">
              Popis
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-purple/85">
              {forum.description?.trim() || "Popis zatiaľ nie je vyplnený."}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-purple/50">
              Pre typ rakoviny
            </h3>
            {forum.cancerTypes.length === 0 ? (
              <p className="mt-1.5 text-sm text-brand-purple/70">
                Pre všetkých (bez špecifického typu)
              </p>
            ) : (
              <ul className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {forum.cancerTypes.map((type) => (
                  <li key={type}>
                    <span className="admin-badge bg-brand-purple/8 text-brand-purple">
                      {cancerTypeLabel(type)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-purple/50">
              Farba zálohy
            </h3>
            <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
              <span
                className="h-6 w-6 rounded-full ring-1 ring-brand-purple/15"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              <span className="text-xs font-mono text-brand-purple/70">
                {accent}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
