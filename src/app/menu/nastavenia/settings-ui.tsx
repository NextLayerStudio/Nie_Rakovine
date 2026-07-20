import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "./icons";

/** Plain menu row - icon, title + subtitle, chevron. No card/box around it. */
export function MenuRow({
  href,
  icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-brand-purple/8 px-5 py-4 transition hover:bg-brand-purple/[0.03]"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-pink/15 text-brand-pink">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-brand-purple">{title}</span>
        {subtitle && (
          <span className="block text-xs text-brand-purple/55">{subtitle}</span>
        )}
      </span>
      <ChevronRight />
    </Link>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold text-brand-purple/80">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Feedback({
  state,
}: {
  state: { ok: boolean; message?: string };
}) {
  if (!state.message) return null;
  return (
    <p
      className={cn(
        "text-center text-xs font-medium",
        state.ok ? "text-emerald-700" : "text-red-600",
      )}
    >
      {state.message}
    </p>
  );
}

export function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn(
        "h-5 w-5 shrink-0 text-brand-purple/40 transition-transform",
        open && "rotate-180",
      )}
      fill="none"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
