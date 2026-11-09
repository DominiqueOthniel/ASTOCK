"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { BrandLogo } from "@/components/BrandLogo";
import { CartIcon } from "@/components/CartIcon";
import { useSupportChat } from "@/components/SupportChat";

const pageLinks = [
  { href: "/browse", label: "Browse" },
  { href: "/sell", label: "Sell" },
  { href: "/support", label: "Support" },
] as const;

export function SiteHeader({
  email,
  cartCount = 0,
}: {
  email?: string | null;
  cartCount?: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { openChat } = useSupportChat();
  const onHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function linkClass(href: string, mobile = false) {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    if (mobile) {
      return `flex min-h-12 items-center text-base font-medium ${
        active ? "text-accent-deep" : ""
      }`;
    }
    return `text-sm font-medium transition-opacity hover:opacity-100 ${
      active ? "opacity-100" : "opacity-70"
    }`;
  }

  return (
    <header className={`site-header ${onHome ? "is-home" : "is-solid"}`}>
      <div className="site-grid flex h-[var(--header-h)] items-center justify-between gap-3">
        <BrandLogo onDark={onHome} onClick={() => setOpen(false)} />

        <nav className="hidden items-center gap-5 md:flex lg:gap-7" aria-label="Primary">
          {pageLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:uncledrewlegacy@gmail.com"
            className="text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
          >
            Email
          </a>
          <button
            type="button"
            className="text-sm font-medium opacity-70 transition-opacity hover:opacity-100"
            onClick={openChat}
            data-testid="header-chat"
          >
            Chat
          </button>
          <CartIcon count={cartCount} onDark={onHome} />
          <AccountMenu email={email ?? null} onDark={onHome} />
        </nav>

        <div className="relative z-[1] flex items-center gap-2 md:hidden">
          <CartIcon count={cartCount} onDark={onHome} />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-current/30"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            data-testid="mobile-menu-toggle"
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1.5">
              <span className={`block h-px bg-current transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-px bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-px bg-current transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden" id="mobile-nav">
          <button
            type="button"
            className="fixed inset-0 top-[var(--header-h)] z-[70] bg-ink/40"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <div
            className={`relative z-[75] border-t ${
              onHome
                ? "border-white/20 bg-ink text-white"
                : "border-line bg-paper text-ink"
            }`}
            data-testid="mobile-menu"
          >
            <nav className="site-grid flex flex-col py-2" aria-label="Mobile">
              {pageLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(link.href, true)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="mailto:uncledrewlegacy@gmail.com"
                className="flex min-h-12 items-center text-base font-medium"
                onClick={() => setOpen(false)}
              >
                Email
              </a>
              <button
                type="button"
                className="flex min-h-12 items-center text-left text-base font-medium"
                onClick={() => {
                  setOpen(false);
                  openChat();
                }}
                data-testid="mobile-menu-chat"
              >
                Chat
              </button>
              <Link
                href="/cart"
                className="flex min-h-12 items-center text-base font-medium"
                onClick={() => setOpen(false)}
                data-testid="mobile-menu-cart"
              >
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
              <div className="border-t border-current/15 py-3">
                <AccountMenu email={email ?? null} onDark={onHome} />
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
