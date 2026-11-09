import { unitPriceForQuantity, type BulkTier } from "@/lib/bulk-pricing";
import { formatCurrency } from "@/lib/format";
import type { Lot } from "@/lib/types";

/** Default minimum cart / buy-now order total ($150). */
export const DEFAULT_MIN_ORDER_TOTAL_CENTS = 15000;

export type OrderableLot = {
  buyNowPrice?: number | null;
  currentBid: number;
  unitCount: number;
  minQuantity: number;
  sellByUnit: boolean;
  title: string;
  bulkTiers?: BulkTier[];
};

export function minOrderTotalCents(override?: number | null): number {
  if (typeof override === "number" && Number.isFinite(override) && override > 0) {
    return Math.floor(override);
  }
  return DEFAULT_MIN_ORDER_TOTAL_CENTS;
}

export function minOrderTotalDollars(override?: number | null): number {
  return minOrderTotalCents(override) / 100;
}

/** Max quantity a buyer can put on one line. */
export function maxOrderQuantity(lot: OrderableLot): number {
  if (lot.sellByUnit) {
    return Math.max(lot.minQuantity, lot.unitCount);
  }
  return 1;
}

export function clampOrderQuantity(lot: OrderableLot, quantity: number): number {
  const min = Math.max(1, lot.minQuantity || 1);
  const max = maxOrderQuantity(lot);
  const raw = Number.isFinite(quantity) ? Math.floor(quantity) : min;
  return Math.min(max, Math.max(min, raw));
}

export function lineTotal(lot: OrderableLot, quantity: number): number {
  const qty = clampOrderQuantity(lot, quantity);
  const unit = unitPriceForQuantity(
    {
      buyNowPrice: lot.buyNowPrice ?? undefined,
      currentBid: lot.currentBid,
      bulkTiers: lot.bulkTiers,
      sellByUnit: lot.sellByUnit,
      minQuantity: lot.minQuantity,
      unitCount: lot.unitCount,
      title: lot.title,
    },
    qty,
  );
  return Math.round(unit * qty * 100) / 100;
}

export function remainingToMinOrder(totalDollars: number, minCents?: number | null): number {
  const min = minOrderTotalDollars(minCents);
  return Math.max(0, Math.round((min - totalDollars) * 100) / 100);
}

export function meetsMinOrder(totalDollars: number, minCents?: number | null): boolean {
  return remainingToMinOrder(totalDollars, minCents) <= 0;
}

export function minOrderMessage(totalDollars: number, minCents?: number | null): string {
  const min = minOrderTotalDollars(minCents);
  const remaining = remainingToMinOrder(totalDollars, minCents);
  if (remaining <= 0) {
    return `Orders must total at least ${formatCurrency(min)}.`;
  }
  return `Add ${formatCurrency(remaining)} more to reach the ${formatCurrency(min)} order minimum.`;
}

export function unitLabel(lot: OrderableLot, quantity = 1): string {
  if (lot.sellByUnit) {
    return `${quantity.toLocaleString()} unit${quantity === 1 ? "" : "s"}`;
  }
  return `${lot.unitCount.toLocaleString()} unit${lot.unitCount === 1 ? "" : "s"}`;
}
