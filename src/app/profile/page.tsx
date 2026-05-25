import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";
import { TopBar } from "@/components/TopBar";

export default function ProfilePage() {
  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col overflow-y-auto">
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
              Jana Nováková
            </h2>
            <p className="text-xs text-brand-purple/60">jana@example.sk</p>
          </div>
        </section>
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
