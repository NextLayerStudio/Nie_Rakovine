import { OnkoLogo } from "@/components/OnkoLogo";
import { GateForm } from "./GateForm";

export const dynamic = "force-dynamic";

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: nextRaw } = await searchParams;
  const next = nextRaw && nextRaw.startsWith("/") ? nextRaw : "/";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF3F9] px-6 py-16 text-center font-sans">
      <OnkoLogo size="lg" priority className="mb-8" />

      <h1 className="mb-3 text-[1.9rem] font-black leading-tight text-[#6F2380]">
        Pripravujeme pre vás niečo dôležité
      </h1>
      <p className="mb-10 max-w-sm text-[15px] leading-relaxed text-[#6F2380]/65">
        Ešte pracujeme na vývoji ONKO KLUBU. Naostro budeme online od{" "}
        <span className="font-bold text-[#6F2380]">1. 9. 2026</span>.
      </p>

      <GateForm next={next} />
    </main>
  );
}
