"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  step,
  backHref,
  className,
}: {
  title?: string;
  step?: { current: number; total: number };
  backHref?: string;
  className?: string;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-3 px-5 pt-6 pb-3",
        className,
      )}
    >
      {backHref ? (
        <Link
          href={backHref}
          aria-label="Späť"
          className="grid h-12 w-12 place-items-center rounded-full text-brand-purple hover:bg-brand-purple/10"
        >
          <ChevronLeft />
        </Link>
      ) : (
        <button
          type="button"
          aria-label="Späť"
          onClick={() => router.back()}
          className="grid h-12 w-12 place-items-center rounded-full text-brand-purple hover:bg-brand-purple/10"
        >
          <ChevronLeft />
        </button>
      )}

      <div className="flex flex-1 items-center justify-center">
        {title && (
          <h1 className="text-base font-semibold text-brand-purple">{title}</h1>
        )}
      </div>

      <div className="w-9 text-right text-xs font-semibold text-brand-purple/70">
        {step ? `${step.current}/${step.total}` : ""}
      </div>
    </header>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
