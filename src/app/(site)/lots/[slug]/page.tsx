import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/BuyBox";
import { LotCard } from "@/components/LotCard";
import { LotGallery } from "@/components/LotGallery";
import { formatCondition, formatCurrency } from "@/lib/format";
import { getPublishedLotBySlug, getRelatedLots } from "@/lib/lot-service";
import { lotPrice } from "@/lib/pricing";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type LotPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: LotPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lot = await getPublishedLotBySlug(slug);
  if (!lot) return { title: "Lot not found" };
  return {
    title: lot.title,
    description: `${lot.category} · ${formatCurrency(lotPrice(lot))}`,
  };
}

export default async function LotDetailPage({ params }: LotPageProps) {
  const { slug } = await params;
  const lot = await getPublishedLotBySlug(slug);
  if (!lot) notFound();

  const [related, user] = await Promise.all([
    getRelatedLots(lot, 4),
    getMarketplaceUser(),
  ]);

  return (
    <div className="pt-8 pb-16 md:pt-10 md:pb-20">
      <div className="site-grid">
        <Link
          href="/browse"
          className="text-sm font-medium text-steel transition-colors hover:text-accent-deep"
        >
          ← Browse
        </Link>

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
                <dt>Location</dt>
                <dd>{lot.location}</dd>
              </div>
              <div className="fact-item">
                <dt>Units</dt>
                <dd>{lot.unitCount.toLocaleString()}</dd>
              </div>
              <div className="fact-item">
                <dt>Est. retail</dt>
                <dd>{formatCurrency(lot.estimatedRetail)}</dd>
              </div>
              <div className="fact-item">
                <dt>Grade</dt>
                <dd>{formatCondition(lot.condition)}</dd>
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
            <BuyBox lot={lot} signedIn={Boolean(user)} />
          </div>
        </div>

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
