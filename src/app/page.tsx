import Image from "next/image";
import Link from "next/link";
import { LotListItem } from "@/components/LotListItem";
import { Reveal } from "@/components/Reveal";
import { categories, formatCurrency, getFeaturedLots, lots } from "@/lib/lots";

const heroImage =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2400&q=80";

const buyerSteps = [
  {
    title: "Browse graded lots",
    copy: "Filter by category, condition, pallet or truckload, and time left.",
  },
  {
    title: "Review the manifest",
    copy: "See unit counts, estimated retail, location, and seller notes before you bid.",
  },
  {
    title: "Win and take delivery",
    copy: "Settle the award, then ship freight or schedule warehouse pickup.",
  },
];

const sellerSteps = [
  {
    title: "Share your surplus",
    copy: "Tell us categories, volume, and warehouse cities for returns or overstock.",
  },
  {
    title: "List with clear grades",
    copy: "We help package lots with condition grades and manifests buyers trust.",
  },
  {
    title: "Move inventory faster",
    copy: "Reach liquidation buyers who bid on pallets and full truckloads.",
  },
];

export default function HomePage() {
  const featured = getFeaturedLots();
  const sampleLots = [...lots]
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
    .slice(0, 8);
  const liveCount = lots.length;
  const totalRetail = lots.reduce((sum, lot) => sum + lot.estimatedRetail, 0);

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
            Retail returns, overstock, pallets, and truckloads from brands and retailers, listed with grades and manifests.
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

      <section className="site-grid py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink md:text-4xl">
            Built for buyers and sellers of surplus inventory
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <Reveal>
            <h3 className="font-display text-xl font-semibold">For buyers</h3>
            <ol className="mt-6 space-y-5">
              {buyerSteps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-display text-lg font-bold text-accent">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-steel">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal>
            <h3 className="font-display text-xl font-semibold">For sellers</h3>
            <ol className="mt-6 space-y-5">
              {sellerSteps.map((step, index) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-display text-lg font-bold text-accent">{index + 1}</span>
                  <div>
                    <p className="font-semibold text-ink">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-steel">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line bg-white/70 pattern-rail">
        <div className="site-grid py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Categories</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              Featured lot categories
            </h2>
            <p className="mt-3 max-w-xl text-steel">
              {liveCount} live lots across electronics, apparel, home, grocery, sporting, office, toys, and mixed pallets.
            </p>
          </Reveal>
          <Reveal className="mt-10">
            <ul className="divide-y divide-line border-y border-line">
              {categories.map((category) => {
                const count = lots.filter((lot) => lot.category === category).length;
                const ending = [...lots]
                  .filter((lot) => lot.category === category)
                  .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())[0];
                return (
                  <li key={category}>
                    <Link
                      href={`/browse?category=${encodeURIComponent(category)}`}
                      className="flex flex-col gap-1 py-4 transition-colors hover:text-accent-deep sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                    >
                      <span className="font-display text-xl font-semibold">{category}</span>
                      <span className="text-sm text-steel">
                        {count} live
                        {ending ? ` · from ${formatCurrency(ending.currentBid)}` : ""} · Browse
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="site-grid py-20">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Marketplace</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                Live and upcoming lots
              </h2>
              <p className="mt-2 text-sm text-steel">
                Ending soon across {formatCurrency(totalRetail)} in estimated retail value.
              </p>
            </div>
            <Link href="/browse" className="btn btn-secondary">
              View all lots
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-8">
          <div className="border-t border-line">
            {sampleLots.map((lot) => (
              <LotListItem key={lot.id} lot={lot} />
            ))}
          </div>
        </Reveal>
        {featured.length > 0 ? (
          <p className="mt-6 text-sm text-steel">
            Featured right now: {featured.map((lot) => lot.title).slice(0, 3).join("; ")}.
          </p>
        ) : null}
      </section>

      <section className="border-t border-line bg-ink text-white">
        <div className="site-grid py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Trust</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
              Clear grades. Honest manifests. Warehouse logistics that buyers can plan around.
            </h2>
            <ul className="mt-8 grid gap-6 text-sm text-white/75 md:grid-cols-3">
              <li>
                <p className="font-semibold text-white">Condition grades</p>
                <p className="mt-2 leading-relaxed">
                  A through C, plus customer returns and shelf pulls, labeled up front.
                </p>
              </li>
              <li>
                <p className="font-semibold text-white">Manifest summaries</p>
                <p className="mt-2 leading-relaxed">
                  Unit counts, retail estimates, and category mix before you commit.
                </p>
              </li>
              <li>
                <p className="font-semibold text-white">Pickup or freight</p>
                <p className="mt-2 leading-relaxed">
                  Dock appointments and LTL notes so your ops team is not guessing.
                </p>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="site-grid py-20">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">
                Ready to bid or clear space?
              </h2>
              <p className="mt-3 text-steel">
                Browse open lots now, or talk with Astock about listing your next wave of surplus.
              </p>
            </div>
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
