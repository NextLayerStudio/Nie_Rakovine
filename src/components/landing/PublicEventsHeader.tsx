import Image from "next/image";
import type { ReactNode } from "react";

// Minimal header for the public events flow (/podujatia). No nav links and
// no "Do aplikácie" / "Prihlásiť sa" CTA — the rest of the app isn't
// launched yet, so nothing here should invite people to click into it.
// `right` is an optional slot (e.g. the mobile filter toggle on /podujatia).
export function PublicEventsHeader({ right }: { right?: ReactNode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF3F9]/90 backdrop-blur-md border-b border-[#FDA4C7]/10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between py-3.5">
        <Image
          src="/images/logo-horizontal.png"
          alt="OnkoKlub"
          width={140}
          height={48}
          className="h-9 w-auto"
          priority
        />
        {right}
      </div>
    </header>
  );
}
