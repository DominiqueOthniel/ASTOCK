import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  onClick?: () => void;
};

/** Geometric PD monogram — blunt stems so it never reads as Rc. */
export function BrandMark({
  onDark = false,
  size = "md",
}: {
  onDark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;
  const bg = onDark ? "rgb(255 255 255 / 12%)" : "#124c3b";
  const pFill = "#fffdfb";
  const dFill = onDark ? "#d6ebe2" : "#d6ebe2";

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
      <path
        d="M9 11h8.2c3.05 0 5.05 1.7 5.05 4.35 0 2.55-1.9 4.25-5.05 4.25H12.4V29H9V11Zm3.4 3.05v3.5h4.55c1.45 0 2.2-.75 2.2-1.75s-.75-1.75-2.2-1.75H12.4Z"
        fill={pFill}
      />
      <path
        d="M23.2 11H28c4.55 0 7.55 3.05 7.55 9s-3 9-7.55 9h-4.8V11Zm3.4 3.05V25.9H28c2.7 0 4.35-2.05 4.35-5.9s-1.65-5.95-4.35-5.95h-1.4Z"
        fill={dFill}
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
