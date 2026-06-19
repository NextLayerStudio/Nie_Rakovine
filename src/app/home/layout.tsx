import { BottomNav } from "@/components/BottomNav";
import { MenuDrawer } from "@/components/MenuDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { requireUser } from "@/lib/auth";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <PhoneShell>
      <div
        data-app-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        {children}
      </div>
      <BottomNav />
      <MenuDrawer userName={user.fullName} isAdmin={user.role === "ADMIN"} />
    </PhoneShell>
  );
}
