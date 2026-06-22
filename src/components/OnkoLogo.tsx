import Image from "next/image";
import { cn } from "@/lib/utils";

// vertical.png — 142×161 — hlavné logo (loading, welcome, register done)
const VERTICAL_SRC = "/logo/onkoklub-vertical.png";
// horizontal2.png — 232×110 — stredné logo (login footer, loading footer)
const HORIZONTAL2_SRC = "/logo/onkoklub-horizontal2.png";
// horizontal.png — 277×91 — najširšie logo (karta, wide header)
const HORIZONTAL_SRC = "/logo/onkoklub-horizontal.png";

const verticalSizeClass = {
  sm: "w-[64px]",
  md: "w-[min(60vw,180px)]",
  lg: "w-[min(72vw,240px)]",
  xl: "w-[min(82vw,280px)]",
} as const;

const horizontal2SizeClass = {
  sm: "w-[110px]",
  md: "w-[150px]",
} as const;

const horizontalSizeClass = {
  sm: "w-[120px]",
  md: "w-[180px]",
  lg: "w-[min(70vw,220px)]",
} as const;

/** Hlavné logo — vertikálne (srdce + onkoklub pod sebou). Vhodné pre splash, welcome, veľké centrálne použitie. */
export function OnkoLogo({
  className,
  size = "md",
  priority = false,
  // deprecated props kept for API compat
  variant: _variant,
  showWordmark: _showWordmark,
}: {
  className?: string;
  size?: keyof typeof verticalSizeClass;
  priority?: boolean;
  /** @deprecated */
  variant?: string;
  /** @deprecated */
  showWordmark?: boolean;
}) {
  return (
    <Image
      src={VERTICAL_SRC}
      alt="ONKO KLUB"
      width={142}
      height={161}
      priority={priority}
      className={cn("h-auto object-contain", verticalSizeClass[size], className)}
    />
  );
}

/** Stredné horizontálne logo — srdce + text vedľa seba. Vhodné pre footer, login, loading bar. */
export function NieRakovineMark({
  className,
  size = "sm",
  priority = false,
  // deprecated
  variant: _variant,
}: {
  className?: string;
  size?: keyof typeof horizontal2SizeClass;
  priority?: boolean;
  /** @deprecated */
  variant?: string;
}) {
  return (
    <Image
      src={HORIZONTAL2_SRC}
      alt="ONKO KLUB"
      width={232}
      height={110}
      priority={priority}
      className={cn("h-auto object-contain", horizontal2SizeClass[size], className)}
    />
  );
}

/** Najširšie horizontálne logo — celý nápis "onkOKlub". Vhodné pre kartu a wide header. */
export function OnkoLogoWide({
  className,
  size = "md",
  priority = false,
}: {
  className?: string;
  size?: keyof typeof horizontalSizeClass;
  priority?: boolean;
}) {
  return (
    <Image
      src={HORIZONTAL_SRC}
      alt="ONKO KLUB"
      width={277}
      height={91}
      priority={priority}
      className={cn("h-auto object-contain", horizontalSizeClass[size], className)}
    />
  );
}
