import Image from "next/image";
import Link from "next/link";
import { LotCard } from "@/components/LotCard";
import { Reveal } from "@/components/Reveal";
import { categories } from "@/lib/constants";
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
  const christmasTrees = lots
    .filter(
      (lot) =>
        lot.category === "Christmas" &&
        /tree|pine|spruce|fir|flocked|pre-lit|led/i.test(lot.title),
    )
    .slice(0, 4);
  const sampleLots = (featured.length > 0 ? featured : [...lots])
    .filter((lot) => !christmasTrees.some((tree) => tree.id === lot.id))
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
          <h1 className="mt-5 max-w-lg font-display text-2xl font-semibold leading-tight text-white/95 sm:text-3xl animate-rise-delay-1">
            Bulk lots, clear prices
          </h1>
          <p className="mt-3 max-w-md text-base text-white/75 animate-rise-delay-1">
            Graded pallets and truckloads ready to order.
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

      <section className="site-grid py-12 md:py-14">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-ink">Shop by category</h2>
              <p className="mt-1 text-sm text-steel">{liveCount} live lots</p>
            </div>
            <Link href="/browse" className="btn btn-secondary">
              View all
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-6">
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
      </section>

      {christmasTrees.length > 0 ? (
        <section className="border-y border-line bg-surface/70">
          <div className="site-grid py-12 md:py-14">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-semibold text-ink">Christmas trees</h2>
                  <p className="mt-1 text-sm text-steel">Fixed-price holiday SKUs ready to order</p>
                </div>
                <Link
                  href="/browse?category=Christmas"
                  className="btn btn-secondary"
                >
                  Shop Christmas
                </Link>
              </div>
            </Reveal>
            <Reveal className="mt-7">
              <div className="lot-grid">
                {christmasTrees.map((lot) => (
                  <LotCard key={lot.id} lot={lot} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="site-grid py-12 md:py-14">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-ink">Featured lots</h2>
            <Link href="/browse" className="btn btn-secondary">
              Browse
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-7">
          <div className="lot-grid">
            {sampleLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </Reveal>
      </section>

      <section className="site-grid py-12 md:py-16">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="max-w-md font-display text-3xl font-semibold text-ink">
              Buy surplus. Move inventory.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/browse" className="btn btn-primary">
                Browse lots
              </Link>
              <Link href="/sell" className="btn btn-secondary">
                Sell with us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
