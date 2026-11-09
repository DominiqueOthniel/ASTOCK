import { prisma } from "@/lib/prisma";

export type LotReview = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  verified: boolean;
  createdAt: string;
};

export async function listReviewsForLot(lotId: string): Promise<LotReview[]> {
  const rows = await prisma.review.findMany({
    where: { lotId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: row.id,
    authorName: row.authorName,
    rating: row.rating,
    body: row.body,
    verified: row.verified,
    createdAt: row.createdAt.toISOString(),
  }));
}

export function averageRating(reviews: Pick<LotReview, "rating">[]): number | null {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
