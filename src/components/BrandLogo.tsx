import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
};

export function BrandMark({
  onDark = false,
  size = "md",
}: {
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        rx="8"
        className={onDark ? "stroke-white/40" : "stroke-[var(--line)]"}
        strokeWidth="1.5"
        fill={onDark ? "rgb(255 255 255 / 8%)" : "var(--surface)"}
      />
      <path
        d="M10 27V13h6.4c3.3 0 5.3 1.7 5.3 4.2 0 1.7-.9 3-2.4 3.6L24.2 27h-3.4l-4.3-5.7H13.2V27H10Zm3.2-8.3h3c1.6 0 2.5-.8 2.5-2.1s-.9-2-2.5-2H13.2v4.1Z"
        fill={onDark ? "white" : "var(--accent-deep)"}
      />
      <path
        d="M26.2 27c-3.2 0-5.3-2.2-5.3-5.4 0-3.2 2.1-5.4 5.3-5.4 1.7 0 3.1.6 4 1.8l-2.1 1.3c-.5-.6-1.2-1-2-1-1.5 0-2.5 1.1-2.5 3.2s1 3.3 2.6 3.3c.9 0 1.6-.3 2.1-.9l2.1 1.4c-.9 1.2-2.4 1.7-4.2 1.7Z"
        fill={onDark ? "white" : "var(--accent)"}
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
