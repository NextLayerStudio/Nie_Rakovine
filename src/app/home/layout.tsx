import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneShell>
      <div
        data-app-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        {children}
      </div>
      <BottomNav />
    </PhoneShell>
  );
}
