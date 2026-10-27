import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BidBox } from "@/components/BidBox";
import { LotGallery } from "@/components/LotGallery";
import { LotListItem } from "@/components/LotListItem";
import { formatCondition, formatCurrency, getLotById, lots } from "@/lib/lots";

type LotPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return lots.map((lot) => ({ id: lot.id }));
}

export async function generateMetadata({ params }: LotPageProps): Promise<Metadata> {
  const { id } = await params;
  const lot = getLotById(id);
  if (!lot) return { title: "Lot not found" };
  return {
    title: lot.title,
    description: lot.manifestSummary,
  };
}

export default async function LotDetailPage({ params }: LotPageProps) {
  const { id } = await params;
  const lot = getLotById(id);
  if (!lot) notFound();

  const related = lots
    .filter((item) => item.id !== lot.id && item.category === lot.category)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-20">
      <div className="site-grid">
        <Link href="/browse" className="text-sm font-medium text-steel transition-colors hover:text-accent-deep">
          ← Back to browse
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-steel">
              <span>{lot.category}</span>
              <span aria-hidden="true">·</span>
              <span>{lot.lotType}</span>
              <span aria-hidden="true">·</span>
              <span>{formatCondition(lot.condition)}</span>
              <span aria-hidden="true">·</span>
              <span>{lot.id.toUpperCase()}</span>
            </div>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink md:text-5xl">
              {lot.title}
            </h1>
            <p className="mt-3 text-steel">
              {lot.location} · {lot.unitCount.toLocaleString()} units · Est. retail{" "}
              {formatCurrency(lot.estimatedRetail)}
            </p>

            <div className="mt-8">
              <LotGallery images={lot.images} title={lot.title} />
            </div>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Manifest summary</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{lot.manifestSummary}</p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Condition</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{lot.conditionNotes}</p>
            </section>

            <section className="mt-10">
              <h2 className="font-display text-2xl font-semibold">Seller notes</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{lot.sellerNotes}</p>
            </section>

            <section className="mt-10 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-xl font-semibold">Shipping</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{lot.shipping}</p>
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold">Pickup</h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{lot.pickup}</p>
              </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BidBox lot={lot} />
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-line pt-12">
            <h2 className="font-display text-2xl font-semibold">More in {lot.category}</h2>
            <div className="mt-4 border-t border-line">
              {related.map((item) => (
                <LotListItem key={item.id} lot={item} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
