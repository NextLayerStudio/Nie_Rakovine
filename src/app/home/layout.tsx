import { BottomNav } from "@/components/BottomNav";
import { PhoneShell } from "@/components/PhoneShell";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneShell>
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      <BottomNav />
    </PhoneShell>
  );
}
