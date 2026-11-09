import type { Lot as DbLot } from "@prisma/client";
import { normalizeBulkTiers, type BulkTier } from "./bulk-pricing";
import type { Category, ConditionGrade, Lot, LotType, SaleType } from "./types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseBulkTiers(raw: string | null | undefined): BulkTier[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return undefined;
    const tiers = normalizeBulkTiers(
      parsed.filter(
        (item): item is BulkTier =>
          Boolean(item) &&
          typeof item === "object" &&
          Number.isFinite((item as BulkTier).minQuantity) &&
          Number.isFinite((item as BulkTier).unitPrice),
      ),
    );
    return tiers.length > 0 ? tiers : undefined;
  } catch {
    return undefined;
  }
}

export function mapDbLot(lot: DbLot): Lot {
  let images: string[] = [];
  try {
    const parsed = JSON.parse(lot.imagesJson) as unknown;
    if (Array.isArray(parsed)) {
      images = parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    images = [];
  }

  return {
    id: lot.id,
    slug: lot.slug,
    title: lot.title,
    category: lot.category as Category,
    condition: lot.condition as ConditionGrade,
    lotType: lot.lotType as LotType,
    saleType: "Buy Now" as SaleType,
    currentBid: lot.currentBid,
    buyNowPrice: lot.buyNowPrice ?? undefined,
    compareAtPrice: lot.compareAtPrice ?? undefined,
    bulkTiers: parseBulkTiers(lot.bulkTiersJson),
    startingBid: lot.startingBid,
    reserveMet: lot.reserveMet,
    bidCount: lot.bidCount,
    unitCount: lot.unitCount,
    quantitySold: lot.quantitySold ?? 0,
    minQuantity: lot.minQuantity ?? 1,
    sellByUnit: Boolean(lot.sellByUnit),
    estimatedRetail: lot.estimatedRetail,
    location: lot.location,
    endsAt: lot.endsAt.toISOString(),
    images,
    manifestSummary: lot.manifestSummary,
    conditionNotes: lot.conditionNotes,
    sellerNotes: lot.sellerNotes,
    shipping: lot.shipping,
    pickup: lot.pickup,
    featured: lot.featured,
    published: lot.published,
    status: (lot.status as Lot["status"]) ?? "open",
    soldAt: lot.soldAt ? lot.soldAt.toISOString() : undefined,
  };
}
