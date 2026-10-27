import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";

export const metadata: Metadata = {
  title: "Browse lots",
  description: "Search Astock bulk lots by category, condition grade, lot type, and ending time.",
};

export default function BrowsePage() {
  return (
    <div className="pt-24 pb-20">
      <div className="site-grid">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Marketplace</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">Browse lots</h1>
        <p className="mt-3 max-w-2xl text-steel">
          Filter liquidation inventory by category, grade, pallet or truckload, and auctions ending soon.
        </p>
        <div className="mt-10">
          <Suspense fallback={<p className="text-steel">Loading lots…</p>}>
            <BrowseClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
