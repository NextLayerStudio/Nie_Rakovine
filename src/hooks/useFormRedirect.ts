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
      // External redirects (e.g. the Nexi Hosted Payment Page) need a full
      // navigation — the Next.js router only handles routes within the app.
      if (/^https?:\/\//.test(state.redirectTo)) {
        window.location.assign(state.redirectTo);
      } else {
        router.replace(state.redirectTo);
      }
    }
  }, [state, router]);

  return Boolean(state.ok && state.redirectTo);
}
