import Link from "next/link";
import { NieRakovineMark, OnkoLogo } from "@/components/OnkoLogo";

// Splash screen (1). Full-bleed pink with the white logo. Auto-redirects
// to /welcome after 2s; tapping anywhere also moves forward.
export default function SplashScreen() {
  return (
    <main className="flex min-h-[100dvh] w-full justify-center">
      <Link
        href="/welcome"
        className="phone-shell relative flex flex-col items-center justify-center !bg-brand-pink text-white"
        aria-label="Pokračovať"
      >
        <div className="flex flex-1 items-center justify-center">
          <OnkoLogo variant="white" size="lg" />
        </div>

        <div className="pb-10">
          <NieRakovineMark variant="white" />
        </div>

        {/* meta refresh fallback for no-JS */}
        <meta httpEquiv="refresh" content="2;url=/welcome" />
      </Link>
    </main>
  );
}
