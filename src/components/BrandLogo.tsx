import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
};

/**
 * PD mark using SVG text so the letters stay readable at small sizes
 * (path monograms were misread as "Rc" on some screens).
 */
export function BrandMark({
  onDark = false,
  size = "md",
}: {
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;
  const bg = onDark ? "rgb(255 255 255 / 12%)" : "#124c3b";
  const fg = "#fffdfb";

  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
      data-testid="brand-mark"
    >
      <rect width="40" height="40" rx="7" fill={bg} />
      {onDark ? (
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="6"
          stroke="rgb(255 255 255 / 35%)"
          strokeWidth="1"
          fill="none"
        />
      ) : null}
      <text
        x="20"
        y="26.5"
        textAnchor="middle"
        fill={fg}
        style={{
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif",
          fontSize: "15px",
          fontWeight: 800,
          letterSpacing: "0.5px",
        }}
      >
        PD
      </text>
    </svg>
  );
}

export function BrandLogo({
  href = "/",
  onDark = false,
  size = "md",
  showWordmark = true,
  className = "",
  onClick,
}: BrandLogoProps) {
  const text =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 font-display font-bold tracking-tight ${text} ${className}`}
      aria-label="PalletDeals home"
    >
      <BrandMark onDark={onDark} size={size} />
      {showWordmark ? <span>PalletDeals</span> : null}
    </Link>
  );
}
