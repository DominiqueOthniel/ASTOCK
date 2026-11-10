import type { Metadata } from "next";
import { Suspense } from "react";
import { BrowseClient } from "@/components/BrowseClient";
import { brand } from "@/lib/brand";
import { categories } from "@/lib/constants";
import { listPublishedLots } from "@/lib/lot-service";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BrowsePageProps = {
  searchParams: Promise<{ category?: string; q?: string }>;
};

export async function generateMetadata({ searchParams }: BrowsePageProps): Promise<Metadata> {
  const params = await searchParams;
  const category =
    params.category && categories.includes(params.category as (typeof categories)[number])
      ? params.category
      : null;
  const query = params.q?.trim();

  if (category) {
    const title = `${category} liquidation lots`;
    const description = `Browse ${category.toLowerCase()} liquidation pallets and cases on ${brand.name}. Fixed prices for graded overstock and retail returns at palletdealsshop.com.`;
    return buildPageMetadata({
      title,
      description,
      path: `/browse?category=${encodeURIComponent(category)}`,
    });
  }

  if (query) {
    return buildPageMetadata({
      title: `Search: ${query}`,
      description: `Search results for "${query}" on ${brand.name} liquidation marketplace.`,
      path: `/browse?q=${encodeURIComponent(query)}`,
    });
  }

  return buildPageMetadata({
    title: "Browse liquidation lots",
    description:
      "Browse fixed-price liquidation pallets on PalletDeals: toys, electronics, Christmas trees, PS5 Slim, home goods, and mixed overstock.",
    path: "/browse",
  });
}

export default async function BrowsePage() {
  const lots = await listPublishedLots();

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <h1 className="font-display text-4xl font-semibold text-ink">Browse liquidation lots</h1>
        <p className="mt-2 text-steel">
          Filter by category, grade, or type. Shop toys pallets, electronics, Christmas, and more.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-steel">Loading lots…</p>}>
            <BrowseClient lots={lots} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
