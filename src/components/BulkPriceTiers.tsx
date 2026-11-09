import {
  activeBulkTiers,
  bulkSavingsPercent,
  hasBulkPricing,
  unitPriceForQuantity,
} from "@/lib/bulk-pricing";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export function BulkPriceTiers({
  lot,
  quantity,
  compact = false,
}: {
  lot: Lot;
  quantity?: number;
  compact?: boolean;
}) {
  if (!hasBulkPricing(lot)) return null;

  const base = lotPrice(lot);
  const tiers = activeBulkTiers(lot);
  const qty = typeof quantity === "number" ? quantity : undefined;
  const activeUnit =
    qty != null ? unitPriceForQuantity(lot, qty) : null;
  const activePct =
    activeUnit != null ? bulkSavingsPercent(base, activeUnit) : null;

  return (
    <div
      className={compact ? "space-y-2" : "space-y-3 border border-accent-soft bg-accent-soft/35 px-3 py-3"}
      data-testid="bulk-tiers"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">Bulk price</p>
        {activeUnit != null && activeUnit < base && activePct != null ? (
          <p className="text-sm font-semibold text-accent-deep" data-testid="bulk-active">
            {formatCurrency(activeUnit)} each · {activePct}% off
          </p>
        ) : (
          <p className="text-xs text-steel">Add qty to unlock tiers</p>
        )}
      </div>
      <ul className="space-y-1.5 text-sm text-ink-soft">
        {tiers.map((tier) => {
          const pct = bulkSavingsPercent(base, tier.unitPrice);
          const isActive =
            qty != null && unitPriceForQuantity(lot, qty) === tier.unitPrice && qty >= tier.minQuantity;
          const label =
            tier.minQuantity === 1
              ? "1 unit"
              : `${tier.minQuantity}+ units`;
          return (
            <li
              key={tier.minQuantity}
              className={`flex items-center justify-between gap-3 ${
                isActive ? "font-semibold text-ink" : ""
              }`}
            >
              <span>{label}</span>
              <span className="tabular-nums">
                {formatCurrency(tier.unitPrice)}
                {pct != null ? (
                  <span className="ml-2 text-xs font-semibold text-accent-deep">
                    {pct}% off
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
