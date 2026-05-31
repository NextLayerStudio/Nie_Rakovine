import Image from "next/image";
import { cn } from "@/lib/utils";

/** @deprecated variant is kept for API compatibility; same asset is used everywhere. */
type Variant = "color" | "white";

const ONKO_SRC = "/logo/Onko_klub_logo.webp";
const NIE_SRC = "/logo/Nie_Rakovine_logo.webp";

const onkoSizeClass = {
  sm: "w-[72px] max-w-[88px]",
  md: "w-[min(72vw,260px)] max-w-[300px]",
  lg: "w-[min(82vw,300px)] max-w-[360px]",
  xl: "w-[min(88vw,340px)] max-w-[380px]",
} as const;

const nieSizeClass = {
  sm: "w-[100px] sm:w-[115px]",
  md: "w-[120px] sm:w-[140px]",
} as const;

export function OnkoLogo({
  className,
  variant: _variant = "color",
  size = "md",
  showWordmark: _showWordmark = true,
  priority = false,
}: {
  className?: string;
  variant?: Variant;
  size?: keyof typeof onkoSizeClass;
  /** @deprecated Full logo asset always includes wordmark. */
  showWordmark?: boolean;
  priority?: boolean;
}) {
  const dim =
    size === "xl"
      ? { w: 380, h: 435 }
      : size === "lg"
        ? { w: 360, h: 410 }
        : size === "md"
          ? { w: 300, h: 345 }
          : { w: 88, h: 100 };

  return (
    <Image
      src={ONKO_SRC}
      alt="ONKO KLUB"
      width={dim.w}
      height={dim.h}
      priority={priority}
      className={cn("h-auto object-contain", onkoSizeClass[size], className)}
    />
  );
}

export function NieRakovineMark({
  className,
  variant: _variant = "color",
  size = "sm",
  priority = false,
}: {
  className?: string;
  variant?: Variant;
  size?: keyof typeof nieSizeClass;
  priority?: boolean;
}) {
  const dim = size === "md" ? { w: 140, h: 48 } : { w: 115, h: 40 };

  return (
    <Image
      src={NIE_SRC}
      alt="NIE RAKOVINE"
      width={dim.w}
      height={dim.h}
      priority={priority}
      className={cn("h-auto object-contain", nieSizeClass[size], className)}
    />
  );
}
