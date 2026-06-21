import Link from "next/link";
import { profileAvatarStyle } from "@/lib/avatar-style";

export function DiscountBrandCircle({
  href,
  name,
  avatarUrl,
}: {
  href: string;
  name: string;
  avatarUrl: string | null;
}) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 text-center">
      <div
        className="h-[72px] w-[72px] shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/10"
        style={profileAvatarStyle(avatarUrl)}
        aria-hidden
      />
      <span className="line-clamp-2 max-w-[88px] text-[11px] font-semibold leading-tight text-brand-purple">
        {name}
      </span>
    </Link>
  );
}

export function DiscountBrandRow({
  href,
  name,
  avatarUrl,
}: {
  href: string;
  name: string;
  avatarUrl: string | null;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 border-b border-brand-purple/10 py-4 last:border-b-0"
    >
      <div
        className="h-14 w-14 shrink-0 rounded-full bg-cover bg-center ring-2 ring-brand-purple/10"
        style={profileAvatarStyle(avatarUrl)}
        aria-hidden
      />
      <span className="text-[15px] font-semibold text-brand-purple">{name}</span>
    </Link>
  );
}
