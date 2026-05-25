import { cn } from "@/lib/utils";

type Variant = "color" | "white";

/**
 * ONKO KLUB logo — pink map-pin shape with a heart cut-out, dark-purple
 * wordmark underneath. Inline SVG so it scales perfectly on every device.
 *
 * NOTE: When the user provides the official logo asset (SVG / PNG) drop it
 * into /public/logo/ and swap this component for an <Image/>.
 */
export function OnkoLogo({
  className,
  variant = "color",
  size = "md",
  showWordmark = true,
}: {
  className?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const wordmarkColor = variant === "white" ? "#FFFFFF" : "#6F2380";
  const pinColor = variant === "white" ? "#FFFFFF" : "#CA6A8A";
  const heartColor = variant === "white" ? "#CA6A8A" : "#CA6A8A";

  const sizes = {
    sm: { mark: "h-14 w-14", wordmark1: "text-xl", wordmark2: "text-lg" },
    md: { mark: "h-28 w-28", wordmark1: "text-4xl", wordmark2: "text-3xl" },
    lg: { mark: "h-36 w-36", wordmark1: "text-5xl", wordmark2: "text-4xl" },
  } as const;
  const s = sizes[size];

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 120 140"
        className={s.mark}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Map-pin shape (rounded top, pointed bottom) */}
        <path
          d="M60 6 C30 6 10 28 10 56 C10 78 30 102 60 134 C90 102 110 78 110 56 C110 28 90 6 60 6 Z"
          fill={pinColor}
        />

        {/* Heart cut-out, drawn in white so it punches a hole visually */}
        <path
          d="M60 82
             C 58 76, 48 68, 38 58
             C 28 48, 30 32, 44 32
             C 52 32, 58 38, 60 44
             C 62 38, 68 32, 76 32
             C 90 32, 92 48, 82 58
             C 72 68, 62 76, 60 82 Z"
          fill="#FFFFFF"
        />

        {/* Inner heart accent so the logo reads even when white-on-pink fails */}
        <path
          d="M60 76
             C 58 72, 52 66, 46 60
             C 40 54, 42 42, 50 42
             C 55 42, 58 46, 60 50
             C 62 46, 65 42, 70 42
             C 78 42, 80 54, 74 60
             C 68 66, 62 72, 60 76 Z"
          fill={heartColor}
          opacity="0.0"
        />
      </svg>

      {showWordmark && (
        <div
          className="mt-3 text-center font-extrabold leading-[0.95] tracking-tight"
          style={{ color: wordmarkColor }}
        >
          <div className={s.wordmark1}>ONKO</div>
          <div className={s.wordmark2}>KLUB</div>
        </div>
      )}
    </div>
  );
}

/**
 * NIE RAKOVINE — pink awareness-ribbon mark + purple wordmark.
 */
export function NieRakovineMark({
  className,
  variant = "color",
  size = "sm",
}: {
  className?: string;
  variant?: Variant;
  size?: "sm" | "md";
}) {
  const text = variant === "white" ? "#FFFFFF" : "#6F2380";
  const ribbon = variant === "white" ? "#FFFFFF" : "#CA6A8A";
  const dims = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const textSize = size === "sm" ? "text-[11px]" : "text-sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 40 48"
        className={dims}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {/* Awareness ribbon - twisted loop */}
        <path
          d="M20 4
             C 12 4, 6 12, 10 20
             L 18 38
             L 22 38
             L 30 20
             C 34 12, 28 4, 20 4 Z"
          fill={ribbon}
        />
        {/* Inner overlap / shadow to give the ribbon depth */}
        <path
          d="M20 14
             C 16 14, 13 18, 15 22
             L 20 32
             L 25 22
             C 27 18, 24 14, 20 14 Z"
          fill="#FFFFFF"
          opacity="0.35"
        />
      </svg>
      <div
        className={cn("font-extrabold leading-[0.95]", textSize)}
        style={{ color: text }}
      >
        <div>NIE</div>
        <div className="tracking-wide">RAKOVINE</div>
      </div>
    </div>
  );
}
