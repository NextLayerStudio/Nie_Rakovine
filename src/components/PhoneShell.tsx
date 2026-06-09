import { cn } from "@/lib/utils";

/**
 * Phone-sized shell. On mobile it's full bleed; on tablet/desktop we
 * centre a 460px-wide canvas with rounded corners so the design always
 * looks like a phone preview.
 */
export function PhoneShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] w-full justify-center">
      <div className={cn("phone-shell", className)}>
        {children}
      </div>
    </main>
  );
}
