import Link from "next/link";

export function CartIcon({ count, onDark }: { count: number; onDark?: boolean }) {
  return (
    <Link
      href="/cart"
      className={`cart-link ${onDark ? "border-white/35" : "border-line bg-surface"}`}
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3.5 5h1.7l1.2 1.1 1.6 9.2h9.8l1.7-7.2H8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10.2" cy="18.2" r="1.2" fill="currentColor" />
        <circle cx="16.3" cy="18.2" r="1.2" fill="currentColor" />
      </svg>
      {count > 0 ? <span className="cart-badge">{count > 99 ? "99+" : count}</span> : null}
    </Link>
  );
}
