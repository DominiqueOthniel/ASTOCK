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
 * Bold pallet-stack mark with a deal slash. Geometry stays clear at 28px.
 */
export function BrandMark({
  onDark = false,
  size = "md",
}: {
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 30 : size === "lg" ? 44 : 34;
  const forest = onDark ? "#0d3328" : "#124c3b";
  const board = onDark ? "#f6efdf" : "#f0e2c4";
  const boardDeep = onDark ? "#e2d0a8" : "#d9c18a";
  const slash = "#e07a2f";
  const spark = "#f0c14a";

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
      <rect width="40" height="40" rx="9" fill={forest} />
      {onDark ? (
        <rect
          x="1.25"
          y="1.25"
          width="37.5"
          height="37.5"
          rx="7.75"
          stroke="rgb(255 255 255 / 40%)"
          strokeWidth="1.5"
          fill="none"
        />
      ) : null}

      {/* Stacked pallet boards */}
      <g>
        <rect x="7" y="9" width="26" height="5.2" rx="1.2" fill={board} />
        <rect x="7" y="17.2" width="26" height="5.2" rx="1.2" fill={boardDeep} />
        <rect x="7" y="25.4" width="26" height="5.2" rx="1.2" fill={board} />
        {/* Stringers */}
        <rect x="11" y="9" width="3" height="21.6" fill={forest} opacity="0.45" />
        <rect x="26" y="9" width="3" height="21.6" fill={forest} opacity="0.45" />
      </g>

      {/* Deal slash + spark */}
      <path
        d="M8.5 31.5 L31.5 8.5"
        stroke={slash}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="32.2" cy="8.2" r="3.1" fill={spark} />
      <path
        d="M32.2 5.8 L32.7 7.4 L34.4 7.6 L33 8.7 L33.4 10.4 L32.2 9.5 L31 10.4 L31.4 8.7 L30 7.6 L31.7 7.4 Z"
        fill={forest}
        opacity="0.35"
      />
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
  const markTone = onDark ? "text-white" : "text-ink";
  const dealTone = onDark ? "text-[#f0c14a]" : "text-accent-deep";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 font-display font-bold tracking-tight ${text} ${className}`}
      aria-label="PalletDeals home"
    >
      <BrandMark onDark={onDark} size={size} />
      {showWordmark ? (
        <span className={`leading-none ${markTone}`}>
          Pallet<span className={dealTone}>Deals</span>
        </span>
      ) : null}
    </Link>
  );
}
