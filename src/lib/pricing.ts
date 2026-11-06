import type { Lot } from "@/lib/types";

/** Asking price for a lot. Prefer buyNowPrice; fall back to currentBid for legacy rows. */
export function lotPrice(lot: Pick<Lot, "buyNowPrice" | "currentBid">): number {
  if (typeof lot.buyNowPrice === "number" && Number.isFinite(lot.buyNowPrice) && lot.buyNowPrice > 0) {
    return lot.buyNowPrice;
  }
  return lot.currentBid;
}
