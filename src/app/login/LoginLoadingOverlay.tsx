"use client";

import { useFormStatus } from "react-dom";
import { LoadingScreen } from "@/components/LoadingScreen";

/** Full-screen loader while login form is submitting. */
export function LoginLoadingOverlay({ redirecting }: { redirecting?: boolean }) {
  const { pending } = useFormStatus();
  if (!pending && !redirecting) return null;
  return <LoadingScreen fixed />;
}
