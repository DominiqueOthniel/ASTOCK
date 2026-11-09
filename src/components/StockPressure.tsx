import { isLowStock, quantityLeft, quantitySold } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export function StockPressure({
  lot,
  compact = false,
}: {
  lot: Pick<Lot, "unitCount" | "quantitySold" | "sellByUnit">;
  compact?: boolean;
}) {
  const sold = quantitySold(lot);
  const left = quantityLeft(lot);
  const low = isLowStock(lot);

  return (
    <div data-testid="stock-pressure">
      <p className={`text-steel ${compact ? "text-[11px]" : "text-sm"}`}>
        <span className="font-medium text-ink-soft">{sold.toLocaleString()} sold</span>
        <span aria-hidden="true"> · </span>
        <span className={low ? "font-semibold text-warn" : "font-medium text-ink-soft"}>
          {left.toLocaleString()} left
        </span>
      </p>
      {low && !compact ? (
        <p className="mt-1 text-xs font-semibold text-warn">Low stock. Going fast.</p>
      ) : null}
    </div>
  );
}
