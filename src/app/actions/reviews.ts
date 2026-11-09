"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type SubmitReviewResult =
  | { ok: true; reviewId: string }
  | { ok: false; error: string };

export async function submitReviewAction(formData: FormData): Promise<SubmitReviewResult> {
  const lotId = String(formData.get("lotId") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const authorName = String(formData.get("authorName") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const ratingRaw = Number(formData.get("rating") ?? 0);

  if (!lotId) return { ok: false, error: "Missing lot." };
  if (authorName.length < 2 || authorName.length > 40) {
    return { ok: false, error: "Name must be 2 to 40 characters." };
  }
  if (!/^[A-Za-z][A-Za-z .'-]*$/.test(authorName)) {
    return { ok: false, error: "Use a regular name (letters only)." };
  }
  if (!Number.isFinite(ratingRaw) || ratingRaw < 1 || ratingRaw > 5) {
    return { ok: false, error: "Pick a rating from 1 to 5 stars." };
  }
  const rating = Math.round(ratingRaw);
  if (body.length < 12 || body.length > 600) {
    return { ok: false, error: "Review must be 12 to 600 characters." };
  }

  const lot = await prisma.lot.findFirst({
    where: { id: lotId, published: true },
    select: { id: true, slug: true },
  });
  if (!lot) return { ok: false, error: "Lot not found." };

  const review = await prisma.review.create({
    data: {
      lotId: lot.id,
      authorName,
      rating,
      body,
      verified: false,
      createdAt: new Date(),
    },
  });

  revalidatePath(`/lots/${lot.slug}`);
  if (slug && slug !== lot.slug) revalidatePath(`/lots/${slug}`);

  return { ok: true, reviewId: review.id };
}
