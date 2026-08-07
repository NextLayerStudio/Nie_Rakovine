import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { OnkoLogo } from "@/components/OnkoLogo";

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/nierakovine/?locale=sk_SK",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/nie_rakovine/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function PripravujemePage() {
  return (
    <main className="min-h-screen bg-[#FFF3F9] font-sans">
      <Navbar />

      <section className="flex flex-col items-center justify-center px-5 pt-32 pb-24 text-center">
        <Link href="/co-ziskas" target="_blank" rel="noopener noreferrer" className="mb-8">
          <OnkoLogo size="lg" priority />
        </Link>

        <h1 className="mb-4 max-w-lg text-[2rem] md:text-[2.6rem] font-black leading-[1.15] text-[#6F2380]">
          ONKO KLUB už čoskoro
        </h1>
        <p className="mb-4 max-w-md text-base leading-relaxed text-[#6F2380]/70">
          Pripravujeme pre vás bezpečný priestor, kde nájdete overené informácie,
          odbornú podporu aj komunitu ľudí, ktorí rozumejú tomu, čím prechádzate.
        </p>
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-[#6F2380]/50">
          Ďakujeme za vašu trpezlivosť. Pre viac informácií sledujte naše sociálne siete.
        </p>

        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6F2380] border border-[#FDA4C7]/20 transition-colors hover:bg-[#FDA4C7] hover:text-white"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
