import type { Metadata } from "next";
import Link from "next/link";
import { SellForm } from "@/components/SellForm";
import { buildPageMetadata } from "@/lib/seo";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Sell liquidation lots",
  description:
    "List retail returns, overstock, and liquidation pallets on PalletDeals at palletdealsshop.com.",
  path: "/sell",
});

export default async function SellPage() {
  const user = await getMarketplaceUser();

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <h1 className="font-display text-4xl font-semibold text-ink md:text-5xl">
          Sell with PalletDeals
        </h1>
        <p className="mt-3 max-w-xl text-steel">
          List graded surplus with a clear asking price.{" "}
          <Link href="/browse" className="font-medium text-accent-deep hover:underline">
            Browse lots
          </Link>
        </p>
        <div className="mt-10 max-w-3xl">
          <SellForm signedIn={Boolean(user)} defaultEmail={user?.email} />
        </div>
      </div>
    </div>
  );
}
