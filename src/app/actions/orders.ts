"use server";

import { revalidatePath } from "next/cache";
import { createEmailOrder } from "@/lib/orders";
import { getMarketplaceUser } from "@/lib/supabase/server";

export async function requestPurchaseAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to place this order.",
      authRequired: true as const,
    };
  }

  const termsAccepted = String(formData.get("termsAccepted") ?? "") === "true";
  if (!termsAccepted) {
    return {
      ok: false as const,
      error: "Please agree to the terms to continue.",
    };
  }

  const slug = String(formData.get("slug") ?? "");
  const result = await createEmailOrder({
    slug,
    userId: user.id,
    userEmail: user.email,
    termsAcceptedAt: new Date(),
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
