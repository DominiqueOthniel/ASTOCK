import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-ink text-white">
      <div className="site-grid grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">Astock</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Bulk liquidation marketplace for pallets, truckloads, and mixed lots from retailers and brands.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Marketplace
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link href="/browse" className="hover:text-white">
                Browse lots
              </Link>
            </li>
            <li>
              <Link href="/sell" className="hover:text-white">
                Sell with us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
            Contact
          </p>
          <p className="mt-4 text-sm text-white/80">sellers@astock.market</p>
          <p className="mt-1 text-sm text-white/80">buyers@astock.market</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-grid flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© 2026 Astock. Demo marketplace for product exploration.</p>
          <p>No live payments in this preview.</p>
        </div>
      </div>
    </footer>
  );
}
