import type { Lot as DbLot } from "@prisma/client";
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
    saleType: lot.saleType as SaleType,
    currentBid: lot.currentBid,
    buyNowPrice: lot.buyNowPrice ?? undefined,
    startingBid: lot.startingBid,
    reserveMet: lot.reserveMet,
    bidCount: lot.bidCount,
    unitCount: lot.unitCount,
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
  };
}
