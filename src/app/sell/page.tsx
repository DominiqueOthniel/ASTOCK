import type { Metadata } from "next";
import Link from "next/link";
import { SellForm } from "@/components/SellForm";

export const metadata: Metadata = {
  title: "Sell with us",
  description: "List retail returns, overstock, and liquidation lots on Astock.",
};

const valueProps = [
  {
    title: "Buyer network that bids in bulk",
    copy: "Reach liquidation buyers who already buy pallets and truckloads, not one-off pieces.",
  },
  {
    title: "Grades buyers understand",
    copy: "A through C, customer returns, and shelf pulls with manifests that reduce bid hesitation.",
  },
  {
    title: "Warehouse-friendly logistics",
    copy: "Pickup windows, dock notes, and freight handoffs planned with your ops team.",
  },
  {
    title: "Simple seller onboarding",
    copy: "Share volume and cities. We help package lots and get them in front of active bidders.",
  },
];

export default function SellPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="site-grid">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Sellers</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            Sell surplus with Astock
          </h1>
          <p className="mt-4 max-w-xl text-steel leading-relaxed">
            Turn returns, overstock, and shelf pulls into graded lots that liquidation buyers can bid on with confidence.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 border-y border-line py-10 md:grid-cols-2">
          {valueProps.map((item) => (
            <li key={item.title}>
              <p className="font-display text-lg font-semibold text-ink">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-steel">{item.copy}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Request a seller intro</h2>
            <p className="mt-3 text-sm leading-relaxed text-steel">
              Tell us what you move each month. This is a demo form, so nothing is emailed, but the flow mirrors a real Astock intake.
            </p>
            <p className="mt-6 text-sm text-steel">
              Already buying?{" "}
              <Link href="/browse" className="font-semibold text-accent hover:text-accent-deep">
                Browse live lots
              </Link>
            </p>
          </div>
          <SellForm />
        </div>
      </div>
    </div>
  );
}
