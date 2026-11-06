import type { Metadata } from "next";
import Link from "next/link";
import { SellForm } from "@/components/SellForm";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sell with us",
  description: "List retail returns, overstock, and liquidation lots on Astock.",
};

const valueProps = [
  {
    title: "Buyers who purchase in bulk",
    copy: "Reach liquidation buyers who already buy pallets and truckloads, not one-off pieces.",
  },
  {
    title: "Grades buyers understand",
    copy: "A through C, customer returns, and shelf pulls with manifests that clear questions early.",
  },
  {
    title: "Warehouse-friendly logistics",
    copy: "Pickup windows, dock notes, and freight handoffs planned with your ops team.",
  },
  {
    title: "Simple seller onboarding",
    copy: "Share volume and cities. We help package lots and get them in front of active buyers.",
  },
];

export default async function SellPage() {
  const user = await getMarketplaceUser();

  return (
    <div className="pt-24 pb-20">
      <div className="site-grid">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Sellers</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            Sell surplus with Astock
          </h1>
          <p className="mt-4 max-w-xl text-steel leading-relaxed">
            Turn returns, overstock, and shelf pulls into graded lots with clear asking prices.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 border-y border-line py-10 md:grid-cols-2">
          {valueProps.map((item) => (
            <li key={item.title}>
              <h2 className="font-display text-xl font-semibold text-ink">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-steel">{item.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink">Request a seller intro</h2>
          <p className="mt-2 text-steel">
            Already buying on Astock?{" "}
            <Link href="/browse" className="font-medium text-accent-deep hover:underline">
              Browse lots
            </Link>
            .
          </p>
          <div className="mt-8">
            <SellForm signedIn={Boolean(user)} defaultEmail={user?.email} />
          </div>
        </div>
      </div>
    </div>
  );
}
