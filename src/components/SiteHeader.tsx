"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/browse", label: "Browse lots" },
  { href: "/sell", label: "Sell with us" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const onDark = pathname === "/";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-40 ${
        onDark ? "text-white" : "text-ink"
      }`}
    >
      <div className="site-grid flex items-center justify-between py-5">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight md:text-2xl"
          onClick={() => setOpen(false)}
        >
          Astock
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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
          <Link
            href="/browse"
            className={`btn ${onDark ? "btn-ghost" : "btn-primary"} !min-h-10 !px-4 text-sm`}
          >
            Browse marketplace
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-current/30 md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-1">
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
              : "border-line bg-paper text-ink"
          }`}
        >
          <div className="site-grid flex flex-col gap-4 py-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/browse"
              className={`btn ${onDark ? "btn-ghost" : "btn-primary"}`}
              onClick={() => setOpen(false)}
            >
              Browse marketplace
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
