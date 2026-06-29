import type { DiscountCategoryIconKind } from "@/lib/discount-category";
import { cn } from "@/lib/utils";

export function DiscountCategoryIcon({
  kind,
  className,
}: {
  kind: DiscountCategoryIconKind;
  className?: string;
}) {
  const iconClass = cn("h-5 w-5 shrink-0 text-brand-pink", className);

  switch (kind) {
    case "ALL":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "MODA":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <path
            d="M8.5 7.5 10 5h4l1.5 2.5M7 9.5l-2 2.5v9h14v-9l-2-2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M7 9.5h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "KOZMETIKA":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <rect x="9" y="9" width="6" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M10 9V7a2 2 0 0 1 4 0v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <rect x="9" y="5" width="6" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 5V3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "JEDLO":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <path
            d="M7 4v8a2.5 2.5 0 0 0 5 0V4M9.5 4v16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M16 4v7.5c0 1.4 1.1 2.5 2.5 2.5M18.5 14v6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "ZAZITKY":
      return (
        <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
          <path
            d="M6 9h12a2 2 0 0 1 2 2v1.2a1.2 1.2 0 0 0 0 2.4V15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.4a1.2 1.2 0 0 0 0-2.4V11a2 2 0 0 1 2-2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M12 11v4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="1.5 2"
          />
          <circle cx="12" cy="7" r="1.2" fill="currentColor" />
        </svg>
      );
  }
}
