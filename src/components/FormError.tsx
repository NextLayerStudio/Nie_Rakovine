"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-center text-[11px] font-medium text-red-600">
      {message}
    </p>
  );
}

export function SubmitButton({
  children,
  className,
  pendingLabel,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(className, pending && "opacity-70")}
      aria-busy={pending}
    >
      {pending ? pendingLabel ?? "Ukladám…" : children}
    </button>
  );
}
