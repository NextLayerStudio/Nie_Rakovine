"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Čo získaš",            href: "/co-ziskas" },
  { label: "Prednášky & Podcasty", href: "/prednasky-podcasty" },
  { label: "Eventy",               href: "/akcie" },
  { label: "Sponzori & Zľavy",     href: "/sponzori" },
  { label: "Cenník",               href: "/cennik" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF3F9]/90 backdrop-blur-md border-b border-[#FDA4C7]/10">
        <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between py-3.5">
          <Link href="/" className="shrink-0">
            <Image src="/images/logo-horizontal.png" alt="OnkoKlub" width={140} height={48} className="h-9 w-auto" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#6F2380]/70 text-sm font-semibold px-3 py-2 rounded-xl hover:text-[#6F2380] hover:bg-[#FDA4C7]/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full bg-[#FDA4C7] text-white text-sm font-black px-5 py-2.5 leading-none md:px-6 md:py-3"
            >
              Prihlásiť sa
            </Link>
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
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={close}
                  className="flex items-center px-4 py-4 rounded-2xl text-lg font-black text-white hover:bg-white/15 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 px-5 pt-4 flex flex-col gap-3">
          <Link href="/register" onClick={close} className="block text-center rounded-full bg-white text-[#FDA4C7] text-sm font-black py-3.5">
            Chcem sa zapojiť
          </Link>
          <Link href="/login" onClick={close} className="block text-center rounded-full bg-white/15 text-white text-sm font-semibold py-3">
            Prihlásiť sa
          </Link>
        </div>
      </div>
    </>
  );
}
