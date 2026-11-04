import { prisma } from "./prisma";
import { mapDbLot } from "./lot-mapper";
import { notifyBidPlaced, notifyOutbid, notifySold } from "./email";
import type { DashboardCounts, Lot } from "./types";

export type BidRecord = {
  id: string;
  amount: number;
  userEmail: string;
  userId: string;
  createdAt: string;
};

export async function listPublishedLots(): Promise<Lot[]> {
  const lots = await prisma.lot.findMany({
    where: { published: true, status: { in: ["open", "sold"] } },
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
    where: { published: true, featured: true, status: "open" },
    orderBy: { endsAt: "asc" },
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
    orderBy: { endsAt: "asc" },
    take: limit,
  });
  return lots.map(mapDbLot);
}

export async function listBidsForLot(lotId: string): Promise<BidRecord[]> {
  const bids = await prisma.bid.findMany({
    where: { lotId },
    orderBy: { createdAt: "desc" },
    take: 40,
  });
  return bids.map((bid) => ({
    id: bid.id,
    amount: bid.amount,
    userEmail: maskEmail(bid.userEmail),
    userId: bid.userId,
    createdAt: bid.createdAt.toISOString(),
  }));
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "bidder";
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
}

export async function placeBid(opts: {
  slug: string;
  amount: number;
  userId: string;
  userEmail: string;
}): Promise<{ ok: true; lot: Lot } | { ok: false; error: string }> {
  const { slug, amount, userId, userEmail } = opts;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.lot.findFirst({
        where: { slug, published: true },
      });
      if (!existing) return { ok: false as const, error: "Lot not found." };
      if (existing.status !== "open") {
        return { ok: false as const, error: "This lot is no longer open." };
      }
      if (existing.saleType !== "Auction") {
        return { ok: false as const, error: "This lot is not an auction." };
      }
      if (new Date(existing.endsAt).getTime() <= Date.now()) {
        return { ok: false as const, error: "This auction has ended." };
      }
      const minBid = existing.currentBid + 25;
      if (!Number.isFinite(amount) || amount < minBid) {
        return {
          ok: false as const,
          error: `Bid must be at least $${minBid.toLocaleString()}.`,
        };
      }

      const previous = await tx.bid.findFirst({
        where: { lotId: existing.id },
        orderBy: { amount: "desc" },
      });

      const updatedCount = await tx.lot.updateMany({
        where: {
          id: existing.id,
          status: "open",
          published: true,
          currentBid: { lt: amount },
          endsAt: { gt: new Date() },
        },
        data: {
          currentBid: amount,
          bidCount: { increment: 1 },
          reserveMet:
            amount >= existing.startingBid ? true : existing.reserveMet,
        },
      });

      if (updatedCount.count !== 1) {
        return {
          ok: false as const,
          error: "Another bid just landed. Refresh and try a higher amount.",
        };
      }

      await tx.bid.create({
        data: {
          lotId: existing.id,
          userId,
          userEmail,
          amount,
        },
      });

      const updated = await tx.lot.findUniqueOrThrow({
        where: { id: existing.id },
      });

      return {
        ok: true as const,
        lot: mapDbLot(updated),
        previousEmail:
          previous && previous.userId !== userId ? previous.userEmail : null,
      };
    });

    if (!result.ok) return result;

    void notifyBidPlaced({
      email: userEmail,
      lotTitle: result.lot.title,
      amount,
      slug,
    });
    if (result.previousEmail) {
      void notifyOutbid({
        email: result.previousEmail,
        lotTitle: result.lot.title,
        amount,
        slug,
      });
    }

    return { ok: true, lot: result.lot };
  } catch (error) {
    console.error("placeBid failed", error);
    return { ok: false, error: "Could not place bid. Try again." };
  }
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
