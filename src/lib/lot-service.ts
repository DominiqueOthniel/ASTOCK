import { prisma } from "./prisma";
import { mapDbLot } from "./lot-mapper";
import { notifySold } from "./email";
import type { DashboardCounts, Lot } from "./types";

export async function listPublishedLots(): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: { published: true, status: { in: ["open", "sold"] } },
    orderBy: { updatedAt: "desc" },
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
    where: { published: true, featured: true, status: "open" },
    orderBy: { updatedAt: "desc" },
  });
  return lots.map(mapDbLot);
}

export async function getRelatedLots(lot: Lot, limit = 3): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: {
      published: true,
      status: "open",
      category: lot.category,
      NOT: { id: lot.id },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return lots.map(mapDbLot);
}

export async function markLotSold(opts: {
  lotId: string;
  userId: string;
  userEmail: string;
  amount: number;
}) {
  const lot = await prisma.$transaction(async (tx) => {
    const updated = await tx.lot.updateMany({
      where: { id: opts.lotId, status: "open" },
      data: {
        status: "sold",
        soldAt: new Date(),
        winnerUserId: opts.userId,
        winnerEmail: opts.userEmail,
        currentBid: opts.amount,
        buyNowPrice: opts.amount,
        reserveMet: true,
        endsAt: new Date(),
      },
    });
    if (updated.count !== 1) return null;
    return tx.lot.findUniqueOrThrow({ where: { id: opts.lotId } });
  });

  if (lot) {
    void notifySold({
      email: opts.userEmail,
      lotTitle: lot.title,
      amount: opts.amount,
      slug: lot.slug,
    });
  }

  return lot ? mapDbLot(lot) : null;
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
