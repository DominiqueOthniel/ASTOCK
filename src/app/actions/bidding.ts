"use server";

import { revalidatePath } from "next/cache";
import { placeBid } from "@/lib/lot-service";
import { createEmailOrder } from "@/lib/orders";
import { getMarketplaceUser } from "@/lib/supabase/server";

export async function placeBidAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to place a bid.",
      authRequired: true as const,
    };
  }

  const slug = String(formData.get("slug") ?? "");
  const amountRaw = String(formData.get("amount") ?? "");
  const amount = Number(amountRaw.replace(/[^0-9.]/g, ""));

  const result = await placeBid({
    slug,
    amount,
    userId: user.id,
    userEmail: user.email,
  });
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  revalidatePath(`/lots/${slug}`);
  revalidatePath("/browse");
  revalidatePath("/");
  return { ok: true as const, lot: result.lot };
}

export async function requestPurchaseAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to request this purchase.",
      authRequired: true as const,
    };
  }

  const slug = String(formData.get("slug") ?? "");
  const result = await createEmailOrder({
    slug,
    userId: user.id,
    userEmail: user.email,
  });
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  revalidatePath(`/lots/${slug}`);
  revalidatePath("/account");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return {
    ok: true as const,
    orderId: result.orderId,
    amount: result.amount,
    mailto: result.mailto,
    emailed: result.emailed,
  };
}
