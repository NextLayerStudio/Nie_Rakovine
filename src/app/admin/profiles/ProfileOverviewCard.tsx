import Link from "next/link";
import type { CancerType, ClubProfile } from "@prisma/client";
import { profileAvatarStyle } from "@/lib/avatar-style";
import { cancerTypeLabel } from "@/lib/cancer-type";

export function ProfileOverviewCard({
  profile,
}: {
  profile: Pick<
    ClubProfile,
    "id" | "displayName" | "handle" | "bio" | "avatarUrl" | "published" | "cancerTypes"
  >;
}) {
  return (
    <section className="admin-card overflow-hidden">
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center sm:flex-row sm:items-start sm:text-left">
        <div
          className="h-28 w-28 shrink-0 rounded-full bg-cover bg-center ring-4 ring-brand-purple/10"
          style={profileAvatarStyle(profile.avatarUrl)}
          role="img"
          aria-label={`Profilová fotka — ${profile.displayName}`}
        />

        <div className="mt-5 min-w-0 flex-1 sm:mt-0 sm:pl-6">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-medium text-brand-purple/55">
                @{profile.handle}
              </p>
              <span
                className={`admin-badge mt-2 ${
                  profile.published
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {profile.published ? "Publikovaný" : "Skrytý"}
              </span>
            </div>
            <Link
              href={`/admin/profiles/${profile.id}/edit`}
              className="admin-btn-primary shrink-0"
            >
              Upraviť profil
            </Link>
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-purple/50">
              Bio
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-purple/85">
              {profile.bio?.trim() || "Bio zatiaľ nie je vyplnené."}
            </p>
          </div>

          <div className="mt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-brand-purple/50">
              Pre typ rakoviny
            </h3>
            {profile.cancerTypes.length === 0 ? (
              <p className="mt-1.5 text-sm text-brand-purple/70">
                Pre všetkých (bez špecifického typu)
              </p>
            ) : (
              <ul className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.cancerTypes.map((type) => (
                  <li key={type}>
                    <CancerTypeBadge type={type} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CancerTypeBadge({ type }: { type: CancerType }) {
  return (
    <span className="admin-badge bg-brand-purple/8 text-brand-purple">
      {cancerTypeLabel(type)}
    </span>
  );
}
