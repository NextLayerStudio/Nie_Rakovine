import { NieRakovineLogo, OnkoLogo } from "@/components/OnkoLogo";
import { cn } from "@/lib/utils";

/** Brand loading screen — pink canvas, ONKO centre, NIE RAKOVINE footer, animation. */
export function LoadingScreen({
  fixed = false,
  className,
}: {
  /** Cover viewport (e.g. during login submit). */
  fixed?: boolean;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex min-h-[100dvh] w-full justify-center",
        fixed && "fixed inset-0 z-[200]",
        className,
      )}
      style={{ backgroundColor: "#CA6A8AE3" }}
      data-route-loading=""
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Načítavam"
    >
      <div
        className={cn(
          "phone-shell relative flex min-h-[100dvh] w-full flex-col sm:min-h-0",
          "!bg-transparent shadow-none",
        )}
      >
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="onko-loading-pulse">
            <OnkoLogo size="md" priority />
          </div>
          <LoadingDots />
        </div>

        <div className="flex justify-center pb-10">
          <NieRakovineLogo
            className="brightness-0 invert opacity-90"
            priority
          />
        </div>
      </div>
    </main>
  );
}

function LoadingDots() {
  return (
    <div
      className="mt-8 flex items-center justify-center gap-2"
      aria-hidden
    >
      <span className="loading-dot h-2 w-2 rounded-full bg-white/90" />
      <span className="loading-dot loading-dot-delay-1 h-2 w-2 rounded-full bg-white/90" />
      <span className="loading-dot loading-dot-delay-2 h-2 w-2 rounded-full bg-white/90" />
    </div>
  );
}
