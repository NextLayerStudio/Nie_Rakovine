import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { formatCancerTypes } from "@/lib/cancer-type";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <PhoneShell>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <TopBar backHref="/home" title="Môj profil" />

        <section className="px-6 py-3">
          <div className="card flex flex-col items-center p-6 text-center">
            <div
              aria-hidden
              className="h-20 w-20 rounded-full ring-4 ring-brand-pink/30"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #CA6A8A 0%, #6F2380 100%)",
              }}
            />
            <h2 className="mt-3 text-base font-bold text-brand-purple">
              {user.fullName}
            </h2>
            <p className="text-xs text-brand-purple/60">{user.email}</p>

            <p className="mt-2 rounded-pill bg-brand-purple/10 px-3 py-1 text-[11px] font-semibold text-brand-purple">
              {planLabel(user.subscriptionPlan)}
            </p>
          </div>
        </section>

        {user.profile && (
          <section className="px-6 pb-4">
            <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-brand-purple/70">
              Profil
            </h3>
            <div className="card divide-y divide-brand-purple/10">
              <Row label="Lokalita" value={[user.profile.region, user.profile.city].filter(Boolean).join(", ") || "—"} />
              <Row
                label="Typ ochorenia"
                value={formatCancerTypes(user.profile.cancerTypes)}
              />
              <Row
                label="Diagnóza"
                value={user.profile.diagnosis || "—"}
              />
              <Row label="Fáza" value={user.profile.diagnosisPhase || "—"} />
              <Row label="Rok diagnózy" value={user.profile.diagnosisYear?.toString() || "—"} />
              <Row label="Záujmy" value={user.profile.interests.join(", ") || "—"} />
            </div>
          </section>
        )}
      </div>
      <BottomNav />
    </PhoneShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3 text-xs">
      <span className="font-semibold text-brand-purple/70">{label}</span>
      <span className="text-right text-brand-purple">{value}</span>
    </div>
  );
}

function planLabel(plan: string): string {
  switch (plan) {
    case "MONTHLY":
      return "Mesačné predplatné";
    case "YEARLY":
      return "Ročné predplatné";
    default:
      return "Bez predplatného";
  }
}
