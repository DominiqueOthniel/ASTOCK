import { formatCurrency } from "@/lib/format";
import {
  compareAtPrice,
  lotPrice,
  savingsAmount,
  savingsPercent,
} from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export function LotPrice({
  lot,
  size = "md",
  showSave = true,
}: {
  lot: Pick<Lot, "buyNowPrice" | "currentBid" | "compareAtPrice" | "estimatedRetail" | "sellByUnit">;
  size?: "sm" | "md" | "lg";
  showSave?: boolean;
}) {
  const price = lotPrice(lot);
  const compare = compareAtPrice(lot);
  const save = savingsAmount(lot);
  const pct = savingsPercent(lot);
  const priceClass =
    size === "lg"
      ? "font-display text-4xl font-bold text-ink"
      : size === "sm"
        ? "font-display text-base font-semibold text-ink"
        : "font-display text-lg font-semibold text-ink";

  return (
    <div data-testid="lot-price">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        {compare != null ? (
          <span className="text-sm text-steel line-through decoration-ink/40">
            {formatCurrency(compare)}
          </span>
        ) : null}
        <span className={priceClass}>{formatCurrency(price)}</span>
        {lot.sellByUnit ? (
          <span className="text-xs font-medium text-steel">each</span>
        ) : null}
      </div>
      {showSave && save != null && pct != null ? (
        <p className="mt-1 text-xs font-semibold text-accent-deep">
          Save {formatCurrency(save)} · {pct}% off
        </p>
      ) : null}
    </div>
  );
}
