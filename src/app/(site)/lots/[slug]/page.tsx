import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { JsonLd } from "@/components/JsonLd";
import { LotCard } from "@/components/LotCard";
import { LotGallery } from "@/components/LotGallery";
import { LotReviews } from "@/components/LotReviews";
import { formatCondition, formatCurrency } from "@/lib/format";
import { getPublishedLotBySlug, getRelatedLots } from "@/lib/lot-service";
import { buildPageMetadata, lotDescription, productJsonLd } from "@/lib/seo";
import { listReviewsForLot } from "@/lib/reviews";
import { getSiteSettings } from "@/lib/site-settings";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LotPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lot = await getPublishedLotBySlug(slug);
  if (!lot) return { title: "Lot not found", robots: { index: false, follow: false } };
  return buildPageMetadata({
    title: lot.title,
    description: lotDescription(lot),
    path: `/lots/${lot.slug}`,
    images: lot.images.slice(0, 3),
  });
}

export default async function LotDetailPage({ params }: LotPageProps) {
  const { slug } = await params;
  const lot = await getPublishedLotBySlug(slug);
  if (!lot) notFound();

  const [related, user, settings, reviews] = await Promise.all([
    getRelatedLots(lot, 4),
    getMarketplaceUser(),
    getSiteSettings(),
    listReviewsForLot(lot.id),
  ]);

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <JsonLd data={productJsonLd(lot)} />
      <div className="site-grid">
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel">
          <Link href="/browse" className="font-medium transition-colors hover:text-accent-deep">
            Browse lots
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/browse?category=${encodeURIComponent(lot.category)}`}
            className="font-medium transition-colors hover:text-accent-deep"
          >
            {lot.category}
          </Link>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] lg:gap-10">
          <div className="min-w-0">
            <p className="text-sm text-steel">
              {lot.category} · {formatCondition(lot.condition)} · {lot.lotType}
            </p>
            <h1 className="mt-2 max-w-3xl break-words font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
              {lot.title}
            </h1>

            <div className="mt-6 min-w-0">
              <LotGallery images={lot.images} title={lot.title} />
            </div>

            <dl className="fact-grid mt-8 border-y border-line py-5">
              <div className="fact-item">
                <dt>Left</dt>
                <dd>{lot.unitCount.toLocaleString()}</dd>
              </div>
              <div className="fact-item">
                <dt>Sold</dt>
                <dd>{lot.quantitySold.toLocaleString()}</dd>
              </div>
              {lot.sellByUnit ? (
                <div className="fact-item">
                  <dt>Min order</dt>
                  <dd>{lot.minQuantity.toLocaleString()} unit{lot.minQuantity === 1 ? "" : "s"}</dd>
                </div>
              ) : null}
              <div className="fact-item">
                <dt>Est. retail</dt>
                <dd>{formatCurrency(lot.estimatedRetail)}</dd>
              </div>
              <div className="fact-item">
                <dt>Grade</dt>
                <dd>{formatCondition(lot.condition)}</dd>
              </div>
              <div className="fact-item">
                <dt>Shipping</dt>
                <dd>{/free/i.test(lot.shipping) ? "Free" : "Quoted"}</dd>
              </div>
            </dl>

            <details className="details-panel mt-2">
              <summary>Details</summary>
              <div className="space-y-5 pb-5 pt-2 text-sm leading-relaxed text-ink-soft">
                <div>
                  <p className="font-semibold text-ink">Manifest</p>
                  <p className="mt-1">{lot.manifestSummary}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">Condition</p>
                  <p className="mt-1">{lot.conditionNotes}</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">Seller notes</p>
                  <p className="mt-1">{lot.sellerNotes}</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-ink">Shipping</p>
                    <p className="mt-1">{lot.shipping}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-ink">Pickup</p>
                    <p className="mt-1">{lot.pickup}</p>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
            <BuyBox
              lot={lot}
              signedIn={Boolean(user)}
              accountEmail={user?.email ?? ""}
              minOrderTotalCents={settings.minOrderTotalCents}
            />
          </div>
        </div>

        <LotReviews reviews={reviews} lotId={lot.id} slug={lot.slug} />

        {related.length > 0 ? (
          <section className="mt-14 border-t border-line pt-10">
            <h2 className="font-display text-2xl font-semibold">More in {lot.category}</h2>
            <div className="mt-5 lot-grid">
              {related.map((item) => (
                <LotCard key={item.id} lot={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
