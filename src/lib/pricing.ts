import type { Lot } from "@/lib/types";

/** Asking price for a lot. Prefer buyNowPrice; fall back to currentBid for legacy rows. */
export function lotPrice(lot: Pick<Lot, "buyNowPrice" | "currentBid">): number {
  if (typeof lot.buyNowPrice === "number" && Number.isFinite(lot.buyNowPrice) && lot.buyNowPrice > 0) {
    return lot.buyNowPrice;
  }
  return lot.currentBid;
}

export function compareAtPrice(
  lot: Pick<Lot, "compareAtPrice" | "buyNowPrice" | "currentBid" | "estimatedRetail">,
): number | null {
  const price = lotPrice(lot);
  const compare =
    typeof lot.compareAtPrice === "number" && Number.isFinite(lot.compareAtPrice)
      ? lot.compareAtPrice
      : null;
  if (compare != null && compare > price) return compare;
  return null;
}

export function savingsAmount(lot: Parameters<typeof compareAtPrice>[0]): number | null {
  const compare = compareAtPrice(lot);
  if (compare == null) return null;
  const save = Math.round(compare - lotPrice(lot));
  return save > 0 ? save : null;
}

export function savingsPercent(lot: Parameters<typeof compareAtPrice>[0]): number | null {
  const compare = compareAtPrice(lot);
  if (compare == null || compare <= 0) return null;
  const pct = Math.round(((compare - lotPrice(lot)) / compare) * 100);
  return pct > 0 ? pct : null;
}

export function quantityLeft(lot: Pick<Lot, "unitCount">): number {
  return Math.max(0, lot.unitCount);
}

export function quantitySold(lot: Pick<Lot, "quantitySold">): number {
  return Math.max(0, lot.quantitySold ?? 0);
}

export function isLowStock(lot: Pick<Lot, "unitCount" | "sellByUnit">): boolean {
  const left = quantityLeft(lot);
  if (lot.sellByUnit) return left > 0 && left <= 8;
  return left > 0 && left <= 2;
}
