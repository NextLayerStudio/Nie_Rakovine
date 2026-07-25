import Image from "next/image";
import type { ReactNode } from "react";

// Minimal header for the public events flow (/podujatia). No nav links and
// no "Do aplikácie" / "Prihlásiť sa" CTA — the rest of the app isn't
// launched yet, so nothing here should invite people to click into it.
// `right` is an optional slot (e.g. the mobile filter toggle on /podujatia).
// `left` is an optional slot rendered before the logo (e.g. the back link
// on the event detail page).
export function PublicEventsHeader({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF3F9]/90 backdrop-blur-md border-b border-[#FDA4C7]/10">
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between py-3.5">
        <div className="flex items-center gap-4">
          {left}
          <div className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/logo-horizontal.png"
              alt="OnkoKlub"
              width={140}
              height={48}
              className="h-9 w-auto"
              priority
            />
            <span aria-hidden className="h-6 w-px bg-[#6F2380]/15" />
            <Image
              src="/images/logo-nie-rakovine.png"
              alt="NIE RAKOVINE, o. z."
              width={120}
              height={63}
              className="h-6 w-auto"
            />
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}
