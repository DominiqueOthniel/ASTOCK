"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { CartIcon } from "@/components/CartIcon";

const links = [
  { href: "/browse", label: "Browse" },
  { href: "/sell", label: "Sell" },
  { href: "/admin/login", label: "Admin" },
];

export function SiteHeader({
  email,
  cartCount = 0,
}: {
  email?: string | null;
  cartCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onHome = pathname === "/";

  return (
    <header className={`site-header ${onHome ? "is-home" : "is-solid"}`}>
      <div className="site-grid flex h-[var(--header-h)] items-center justify-between gap-3">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight md:text-2xl"
          onClick={() => setOpen(false)}
        >
          Astock
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-opacity hover:opacity-100 ${
                pathname.startsWith(link.href) ? "opacity-100" : "opacity-70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <CartIcon count={cartCount} onDark={onHome} />
          <AccountMenu email={email ?? null} onDark={onHome} />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CartIcon count={cartCount} onDark={onHome} />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-current/30"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1.5">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={`border-t md:hidden ${
            onHome
              ? "border-white/20 bg-ink/95 text-white"
              : "border-line bg-paper/95 text-ink backdrop-blur"
          }`}
        >
          <div className="site-grid flex flex-col gap-1 py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-12 items-center text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-current/15 py-3">
              <AccountMenu email={email ?? null} onDark={onHome} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
