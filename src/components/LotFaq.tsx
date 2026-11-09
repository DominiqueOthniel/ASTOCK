import Link from "next/link";
import { activeBulkTiers, hasBulkPricing } from "@/lib/bulk-pricing";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

const PS5_SLUGS = new Set(["playstation-5-slim", "playstation-5-slim-digital"]);

export function isPs5ConsoleLot(lot: Pick<Lot, "slug">) {
  return PS5_SLUGS.has(lot.slug);
}

export function LotFaq({ lot }: { lot: Lot }) {
  if (!isPs5ConsoleLot(lot)) return null;

  const base = lotPrice(lot);
  const tiers = activeBulkTiers(lot);
  const freeShip = /free/i.test(lot.shipping);
  const isDigital = lot.slug.includes("digital");

  return (
    <section
      className="mt-10 border border-line bg-surface p-5 shadow-[var(--shadow)] sm:p-6"
      data-testid="lot-faq"
      aria-labelledby="lot-faq-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Buyer questions</p>
      <h2 id="lot-faq-heading" className="mt-2 font-display text-2xl font-semibold text-ink">
        Common questions
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-ink-soft">
        Straight answers for {isDigital ? "PS5 Slim Digital" : "PS5 Slim Disc"} buyers. Still unsure?
        Reach us on{" "}
        <Link href="/support" className="font-semibold text-accent-deep hover:underline">
          Support
        </Link>{" "}
        or WhatsApp +1 (240) 400-9904.
      </p>

      <dl className="mt-6 space-y-5 text-sm leading-relaxed">
        <div>
          <dt className="font-semibold text-ink">Is the PS5 price negotiable?</dt>
          <dd className="mt-1.5 text-ink-soft">
            The online list price is fixed at {formatCurrency(base)} per unit. Volume discounts apply
            automatically when you raise quantity
            {hasBulkPricing(lot)
              ? ` (for example ${tiers
                  .filter((t) => t.minQuantity > 1)
                  .map(
                    (t) =>
                      `${t.minQuantity}+ at ${formatCurrency(t.unitPrice)}`,
                  )
                  .join(", ")})`
              : ""}
            . For unusual wholesale cases, message us on WhatsApp and we will review.
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-ink">Do you offer bundle deals with games?</dt>
          <dd className="mt-1.5 text-ink-soft">
            This listing is console only
            {isDigital
              ? " (Slim Digital Edition, no disc drive)."
              : " (Slim Disc Edition with the Blu-ray drive installed)."}{" "}
            We do not invent game SKUs on the product page. If a game bundle is available from current
            stock, ask via{" "}
            <Link href="/support" className="font-semibold text-accent-deep hover:underline">
              Support
            </Link>{" "}
            or WhatsApp and we will confirm what we can include before you order.
          </dd>
        </div>

        <div>
          <dt className="font-semibold text-ink">How long does shipping take for bulk orders?</dt>
          <dd className="mt-1.5 text-ink-soft">
            {freeShip ? "Shipping is free on this SKU. " : ""}
            Single units typically ship US ground in 3 to 7 business days after confirmation. Bulk
            multi-unit orders usually land in 5 to 10 business days depending on carton count and
            destination. Exact timing varies by size and location; we email tracking once the
            carrier scans the package.
          </dd>
        </div>
      </dl>
    </section>
  );
}
