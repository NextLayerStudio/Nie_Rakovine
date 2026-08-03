"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ABOUT_LINKS = [
  { label: "Čo získate",           href: "/co-ziskas" },
  { label: "Prednášky & Podcasty", href: "/prednasky-podcasty" },
  { label: "Kalendár aktivít",     href: "/akcie" },
  { label: "Sponzori & Zľavy",     href: "/sponzori" },
  { label: "Cenník",               href: "/cennik" },
];

export function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aboutOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [aboutOpen]);

  // Logged-in users browsing the landing arrived via /?preview=1 — Domov/logo
  // must keep that flag, otherwise middleware bounces them back to /home.
  const homeHref = isLoggedIn ? "/?preview=1" : "/";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF3F9]/90 backdrop-blur-md border-b border-[#FDA4C7]/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between py-3.5">
          {/* Vyváži šírku hamburgeru vpravo, aby logo bolo na mobile presne v strede */}
          <span aria-hidden className="w-11 md:hidden" />

          <Link href={homeHref} className="flex shrink-0 items-center gap-2.5">
            <Image src="/images/logo-horizontal.png" alt="OnkoKlub" width={140} height={48} className="h-9 w-auto" priority />
            <span aria-hidden className="h-6 w-px bg-[#6F2380]/15" />
            <Image src="/images/logo-nie-rakovine.png" alt="NIE RAKOVINE, o. z." width={120} height={63} className="h-6 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href={homeHref}
              className="text-[#6F2380]/70 text-sm font-semibold px-3 py-2 rounded-xl hover:text-[#6F2380] hover:bg-[#FDA4C7]/10 transition-colors"
            >
              Domov
            </Link>

            <div className="relative" ref={aboutRef}>
              <button
                type="button"
                onClick={() => setAboutOpen((v) => !v)}
                aria-expanded={aboutOpen}
                className="flex items-center gap-1 text-[#6F2380]/70 text-sm font-semibold px-3 py-2 rounded-xl hover:text-[#6F2380] hover:bg-[#FDA4C7]/10 transition-colors"
              >
                O ONKO KLUBE
                <ChevronDown size={14} className={`transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
              </button>

              {aboutOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-white py-2 shadow-lg ring-1 ring-[#FDA4C7]/15">
                  {ABOUT_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setAboutOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-[#6F2380]/70 hover:text-[#6F2380] hover:bg-[#FDA4C7]/10 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/podujatia"
              className="text-[#6F2380]/70 text-sm font-semibold px-3 py-2 rounded-xl hover:text-[#6F2380] hover:bg-[#FDA4C7]/10 transition-colors"
            >
              Podujatia
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Tlačidlo Prihlásiť sa / Do aplikácie — len na desktope, na mobile je len hamburger */}
            <span className="hidden md:inline-flex">
              {isLoggedIn ? (
                <Link
                  href="/home"
                  className="rounded-full bg-[#FDA4C7] text-white text-sm font-black px-6 py-3 leading-none"
                >
                  Do aplikácie
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-[#FDA4C7] text-white text-sm font-black px-6 py-3 leading-none"
                >
                  Prihlásiť sa
                </Link>
              )}
            </span>
            {/* Hamburger — len na mobile */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Otvoriť menu"
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-full bg-[#FDA4C7] text-white"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
        aria-hidden
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-xs flex-col bg-[#FDA4C7] text-white
          transform transition-transform duration-300 ease-in-out overflow-y-auto md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between px-5 pt-8 pb-6">
          <Image src="/images/logo-horizontal.png" alt="OnkoKlub" width={120} height={40} className="h-8 w-auto brightness-0 invert" />
          <button
            onClick={close}
            aria-label="Zatvoriť menu"
            className="w-9 h-9 grid place-items-center rounded-full bg-white/20"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-0.5">
            <li>
              <Link
                href={homeHref}
                onClick={close}
                className="flex items-center px-4 py-4 rounded-2xl text-lg font-black text-white hover:bg-white/15 transition-colors"
              >
                Domov
              </Link>
            </li>

            <li>
              <button
                type="button"
                onClick={() => setMobileAboutOpen((v) => !v)}
                aria-expanded={mobileAboutOpen}
                className="flex w-full items-center justify-between px-4 py-4 rounded-2xl text-lg font-black text-white hover:bg-white/15 transition-colors"
              >
                O ONKO KLUBE
                <ChevronDown size={18} className={`transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileAboutOpen && (
                <ul className="flex flex-col gap-0.5 pl-4">
                  {ABOUT_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="flex items-center px-4 py-3 rounded-2xl text-base font-bold text-white/90 hover:bg-white/15 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/podujatia"
                onClick={close}
                className="flex items-center px-4 py-4 rounded-2xl text-lg font-black text-white hover:bg-white/15 transition-colors"
              >
                Podujatia
              </Link>
            </li>
          </ul>
        </nav>

        <div className="shrink-0 px-5 pt-4 flex flex-col gap-3">
          {isLoggedIn ? (
            <Link href="/home" onClick={close} className="block text-center rounded-full bg-white text-[#FDA4C7] text-sm font-black py-3.5">
              Do aplikácie
            </Link>
          ) : (
            <>
              <Link href="/pripravujeme" onClick={close} className="block text-center rounded-full bg-white text-[#FDA4C7] text-sm font-black py-3.5">
                Chcem sa zapojiť
              </Link>
              <Link href="/login" onClick={close} className="block text-center rounded-full bg-white/15 text-white text-sm font-semibold py-3">
                Prihlásiť sa
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
