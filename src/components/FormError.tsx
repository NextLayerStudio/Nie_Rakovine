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
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={cn(className, isDisabled && "opacity-70")}
      aria-busy={pending}
    >
      {pending ? pendingLabel ?? "Ukladám…" : children}
    </button>
  );
}
