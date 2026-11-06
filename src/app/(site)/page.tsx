import Image from "next/image";
import Link from "next/link";
import { LotCard } from "@/components/LotCard";
import { Reveal } from "@/components/Reveal";
import { categories } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import {
  getFeaturedPublishedLots,
  listPublishedLots,
} from "@/lib/lot-service";

export const dynamic = "force-dynamic";

const heroImage =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80";

export default async function HomePage() {
  const [lots, featured] = await Promise.all([
    listPublishedLots(),
    getFeaturedPublishedLots(),
  ]);
  const sampleLots = (featured.length > 0 ? featured : [...lots])
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
    .slice(0, 8);
  const liveCount = lots.length;

  return (
    <>
      <section className="hero-plane">
        <Image
          src={heroImage}
          alt="Rows of palletized inventory inside a large warehouse"
          fill
          priority
          className="object-cover animate-fade"
          sizes="100vw"
        />
        <div className="hero-content site-grid">
          <p className="brand-mark font-display text-5xl font-extrabold sm:text-6xl md:text-7xl animate-rise">
            Astock
          </p>
          <h1 className="mt-5 max-w-xl font-display text-2xl font-semibold leading-tight text-white/95 sm:text-3xl animate-rise-delay-1">
            Bulk lots for serious liquidation buyers
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg animate-rise-delay-1">
            Graded pallets and truckloads with manifests. Browse, add to cart, request purchase.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 animate-rise-delay-2">
            <Link href="/browse" className="btn btn-primary">
              Browse lots
            </Link>
            <Link href="/sell" className="btn btn-ghost">
              Sell with us
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/70 pattern-rail">
        <div className="site-grid py-14 md:py-16">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                  Categories
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
                  Shop by category
                </h2>
                <p className="mt-2 text-steel">{liveCount} live lots</p>
              </div>
              <Link href="/browse" className="btn btn-secondary">
                Browse all
              </Link>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <div className="category-strip scroll-x" aria-label="Browse by category">
              {categories.map((category) => {
                const count = lots.filter((lot) => lot.category === category).length;
                return (
                  <Link
                    key={category}
                    href={`/browse?category=${encodeURIComponent(category)}`}
                    className="category-chip"
                  >
                    {category}
                    {count > 0 ? ` (${count})` : ""}
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="site-grid py-14 md:py-16">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
                Marketplace
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">
                Featured lots
              </h2>
            </div>
            <Link href="/browse" className="btn btn-secondary">
              View all lots
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <div className="lot-grid">
            {sampleLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line bg-ink text-white">
        <div className="site-grid py-14 md:py-16">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-semibold md:text-4xl">
                  Ready to buy or list surplus?
                </h2>
                <p className="mt-3 text-white/70">
                  Browse open lots, or request a seller intro.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/browse" className="btn btn-primary">
                  Browse lots
                </Link>
                <Link href="/sell" className="btn btn-ghost">
                  Sell with us
                </Link>
                <Link href="/admin/login" className="btn btn-ghost">
                  Admin
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
