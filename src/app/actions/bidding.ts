"use server";

import { revalidatePath } from "next/cache";
import { buyNow, placeBid } from "@/lib/lot-service";

export async function placeBidAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const amount = Number(amountRaw.replace(/[^0-9.]/g, ""));

  const result = await placeBid(slug, amount);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  revalidatePath(`/lots/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/");
  return { ok: true as const, lot: result.lot };
}

export async function buyNowAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const result = await buyNow(slug);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  revalidatePath(`/lots/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/");
  return { ok: true as const, lot: result.lot };
}
