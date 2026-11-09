import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export type BulkTier = {
  /** Inclusive minimum quantity for this unit price. */
  minQuantity: number;
  unitPrice: number;
};

export type BulkPricedLot = Pick<
  Lot,
  "buyNowPrice" | "currentBid" | "bulkTiers" | "sellByUnit" | "minQuantity" | "unitCount" | "title"
>;

export function normalizeBulkTiers(tiers: BulkTier[] | undefined | null): BulkTier[] {
  if (!Array.isArray(tiers) || tiers.length === 0) return [];
  return [...tiers]
    .filter(
      (tier) =>
        Number.isFinite(tier.minQuantity) &&
        tier.minQuantity >= 1 &&
        Number.isFinite(tier.unitPrice) &&
        tier.unitPrice > 0,
    )
    .map((tier) => ({
      minQuantity: Math.floor(tier.minQuantity),
      unitPrice: Math.round(tier.unitPrice * 100) / 100,
    }))
    .sort((a, b) => a.minQuantity - b.minQuantity);
}

/** Unit price for a quantity after applying the best qualifying bulk tier. */
export function unitPriceForQuantity(lot: BulkPricedLot, quantity: number): number {
  const base = lotPrice(lot);
  const tiers = normalizeBulkTiers(lot.bulkTiers);
  if (!lot.sellByUnit || tiers.length === 0) return base;

  const qty = Math.max(1, Math.floor(quantity));
  let price = base;
  for (const tier of tiers) {
    if (qty >= tier.minQuantity) price = tier.unitPrice;
  }
  return price;
}

export function activeBulkTiers(lot: BulkPricedLot): BulkTier[] {
  const base = lotPrice(lot);
  const tiers = normalizeBulkTiers(lot.bulkTiers);
  if (!lot.sellByUnit || tiers.length === 0) return [];
  // Always show base as 1+ for clarity when tiers exist
  const withBase: BulkTier[] = [{ minQuantity: 1, unitPrice: base }, ...tiers];
  const seen = new Set<number>();
  return withBase.filter((tier) => {
    if (seen.has(tier.minQuantity)) return false;
    seen.add(tier.minQuantity);
    return true;
  });
}

export function bulkSavingsPercent(base: number, unitPrice: number): number | null {
  if (!(base > 0) || !(unitPrice < base)) return null;
  return Math.round(((base - unitPrice) / base) * 100);
}

export function hasBulkPricing(lot: BulkPricedLot): boolean {
  return normalizeBulkTiers(lot.bulkTiers).length > 0 && Boolean(lot.sellByUnit);
}

/** Default PS5 Slim Disc bulk ladder from a $400 list. */
export function defaultPs5DiscBulkTiers(base = 400): BulkTier[] {
  return [
    { minQuantity: 3, unitPrice: Math.round(base * 0.94) }, // 6%
    { minQuantity: 5, unitPrice: Math.round(base * 0.89) }, // 11%
    { minQuantity: 10, unitPrice: Math.round(base * 0.85) }, // 15%
  ];
}

/** Default PS5 Slim Digital bulk ladder from list price. */
export function defaultPs5DigitalBulkTiers(base = 360): BulkTier[] {
  return [
    { minQuantity: 3, unitPrice: Math.round(base * 0.94) },
    { minQuantity: 5, unitPrice: Math.round(base * 0.89) },
    { minQuantity: 10, unitPrice: Math.round(base * 0.85) },
  ];
}
