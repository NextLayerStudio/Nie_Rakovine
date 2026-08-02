import Link from "next/link";

export function MembershipRequired({
  message,
  backHref = "/home",
}: {
  message: string;
  backHref?: string;
}) {
  return (
    <div className="mx-4 mt-6 rounded-3xl bg-white p-6 text-center shadow-card">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-pink/15 text-brand-pink">
        <LockIcon />
      </div>
      <h1 className="text-lg font-bold text-brand-purple">
        Len pre platiacich členov
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-brand-purple/70">
        {message}
      </p>
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href="/cennik"
          className="rounded-pill bg-brand-pink px-6 py-3 text-sm font-semibold text-white"
        >
          Zobraziť členstvo
        </Link>
        <Link
          href={backHref}
          className="py-1 text-sm font-semibold text-brand-purple/60"
        >
          Späť domov
        </Link>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11V8a4 4 0 018 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
