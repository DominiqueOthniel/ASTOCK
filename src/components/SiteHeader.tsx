"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";

const links = [
  { href: "/browse", label: "Browse lots" },
  { href: "/cart", label: "Cart" },
  { href: "/sell", label: "Sell" },
  { href: "/admin/login", label: "Admin" },
];

export function SiteHeader({ email }: { email?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onDark = pathname === "/";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-40 ${
        onDark ? "text-white" : "text-ink"
      }`}
    >
      <div className="site-grid flex items-center justify-between gap-3 py-4 sm:py-5">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight md:text-2xl"
          onClick={() => setOpen(false)}
        >
          Astock
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-opacity hover:opacity-100 ${
                pathname.startsWith(link.href) ? "opacity-100" : "opacity-75"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <AccountMenu email={email ?? null} onDark={onDark} />
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center border border-current/30 md:hidden"
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

      {open ? (
        <div
          className={`border-t md:hidden ${
            onDark
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
              <AccountMenu email={email ?? null} onDark={onDark} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
