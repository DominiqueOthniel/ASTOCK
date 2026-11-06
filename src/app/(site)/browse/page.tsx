import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { listPublishedLots } from "@/lib/lot-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse lots",
  description: "Search Astock bulk lots by category, condition grade, lot type, and ending time.",
};

export default async function BrowsePage() {
  const lots = await listPublishedLots();

  return (
    <div className="pt-24 pb-20">
      <div className="site-grid">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Marketplace</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">Browse lots</h1>
        <p className="mt-3 max-w-2xl text-steel">
          Fixed-price liquidation lots. Filter by category, grade, or lot type.
        </p>
        <div className="mt-10">
          <Suspense fallback={<p className="text-steel">Loading lots…</p>}>
            <BrowseClient lots={lots} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
