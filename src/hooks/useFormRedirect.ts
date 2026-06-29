"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Navigate after a server action returns `{ ok: true, redirectTo }`. */
export function useFormRedirect(state: {
  ok?: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  return Boolean(state.ok && state.redirectTo);
}
