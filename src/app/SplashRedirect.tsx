"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function SplashRedirect({
  href,
  delayMs = 2200,
}: {
  href: string;
  delayMs?: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.replace(href), delayMs);
    return () => clearTimeout(t);
  }, [href, delayMs, router]);

  return null;
}
