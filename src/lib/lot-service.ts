import { prisma } from "./prisma";
import { mapDbLot } from "./lot-mapper";
import type { DashboardCounts, Lot } from "./types";

export async function listPublishedLots(): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: { published: true },
    orderBy: { endsAt: "asc" },
  });
  return lots.map(mapDbLot);
}

export async function getPublishedLotBySlug(slug: string): Promise<Lot | null> {
  const lot = await prisma.lot.findFirst({
    where: { slug, published: true },
  });
  return lot ? mapDbLot(lot) : null;
}

export async function getFeaturedPublishedLots(): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: { published: true, featured: true },
    orderBy: { endsAt: "asc" },
  });
  return lots.map(mapDbLot);
}

export async function getRelatedLots(lot: Lot, limit = 3): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: {
      published: true,
      category: lot.category,
      NOT: { id: lot.id },
    },
    orderBy: { endsAt: "asc" },
    take: limit,
  });
  return lots.map(mapDbLot);
}

export async function placeBid(
  slug: string,
  amount: number,
): Promise<{ ok: true; lot: Lot } | { ok: false; error: string }> {
  const existing = await prisma.lot.findFirst({
    where: { slug, published: true },
  });
  if (!existing) return { ok: false, error: "Lot not found." };
  if (existing.saleType !== "Auction") {
    return { ok: false, error: "This lot is not an auction." };
  }
  if (new Date(existing.endsAt).getTime() <= Date.now()) {
    return { ok: false, error: "This auction has ended." };
  }
  const minBid = existing.currentBid + 25;
  if (!Number.isFinite(amount) || amount < minBid) {
    return { ok: false, error: `Bid must be at least ${minBid}.` };
  }

  const updated = await prisma.lot.update({
    where: { id: existing.id },
    data: {
      currentBid: amount,
      bidCount: { increment: 1 },
      reserveMet: amount >= existing.startingBid ? true : existing.reserveMet,
    },
  });

  return { ok: true, lot: mapDbLot(updated) };
}

export async function buyNow(
  slug: string,
): Promise<{ ok: true; lot: Lot } | { ok: false; error: string }> {
  const existing = await prisma.lot.findFirst({
    where: { slug, published: true },
  });
  if (!existing) return { ok: false, error: "Lot not found." };
  if (existing.saleType !== "Buy Now") {
    return { ok: false, error: "This lot is not available for buy now." };
  }
  if (new Date(existing.endsAt).getTime() <= Date.now()) {
    return { ok: false, error: "This listing has ended." };
  }

  const price = existing.buyNowPrice ?? existing.currentBid;
  const updated = await prisma.lot.update({
    where: { id: existing.id },
    data: {
      currentBid: price,
      bidCount: { increment: 1 },
      reserveMet: true,
      endsAt: new Date(),
    },
  });

  return { ok: true, lot: mapDbLot(updated) };
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const [publishedLots, draftLots, openInquiries, totalLots] = await Promise.all([
    prisma.lot.count({ where: { published: true } }),
    prisma.lot.count({ where: { published: false } }),
    prisma.sellInquiry.count({ where: { handled: false } }),
    prisma.lot.count(),
  ]);

  return { publishedLots, draftLots, openInquiries, totalLots };
}

export async function listAllLotsAdmin() {
  const lots = await prisma.lot.findMany({ orderBy: { updatedAt: "desc" } });
  return lots.map(mapDbLot);
}

export async function getLotByIdAdmin(id: string): Promise<Lot | null> {
  const lot = await prisma.lot.findUnique({ where: { id } });
  return lot ? mapDbLot(lot) : null;
}
