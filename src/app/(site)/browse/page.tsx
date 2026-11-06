import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { listPublishedLots } from "@/lib/lot-service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse lots",
  description: "Browse fixed-price liquidation lots on Astock.",
};

export default async function BrowsePage() {
  const lots = await listPublishedLots();

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <h1 className="font-display text-4xl font-semibold text-ink">Browse lots</h1>
        <p className="mt-2 text-steel">Filter by category, grade, or type.</p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-steel">Loading lots…</p>}>
            <BrowseClient lots={lots} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
