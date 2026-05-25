import Link from "next/link";

export function StepFooter({
  href,
  label = "Ďalej",
  disabled,
}: {
  href: string;
  label?: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="flex items-center justify-center px-6 py-6">
        <button className="btn-soft w-40 justify-between opacity-60" disabled>
          {label}
          <ChevronRight />
        </button>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center px-6 py-6">
      <Link href={href} className="btn-soft w-40 justify-between">
        {label}
        <ChevronRight />
      </Link>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
