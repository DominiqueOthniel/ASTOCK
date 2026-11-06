"use server";

import { revalidatePath } from "next/cache";
import { addToCart, clearCart, readCart, removeFromCart } from "@/lib/cart";
import { createEmailOrdersForSlugs } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { getMarketplaceUser } from "@/lib/supabase/server";

export async function addToCartAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return { ok: false as const, error: "Missing lot." };

  const lot = await prisma.lot.findFirst({
    where: { slug, published: true, saleType: "Buy Now", status: "open" },
  });
  if (!lot) return { ok: false as const, error: "This lot cannot be added to cart." };
  if (new Date(lot.endsAt).getTime() <= Date.now()) {
    return { ok: false as const, error: "This listing has ended." };
  }

  const items = await addToCart(slug);
  revalidatePath("/cart");
  revalidatePath(`/lots/${slug}`);
  return { ok: true as const, count: items.length };
}

export async function removeFromCartAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "").trim();
  await removeFromCart(slug);
  revalidatePath("/cart");
  return { ok: true as const };
}

export async function checkoutCartAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to place your order.",
      authRequired: true as const,
    };
  }

  const termsAccepted = String(formData.get("termsAccepted") ?? "") === "true";
  if (!termsAccepted) {
    return {
      ok: false as const,
      error: "Agree to the Terms & Conditions and Privacy Policy to continue.",
    };
  }

  const cart = await readCart();
  if (cart.length === 0) {
    return { ok: false as const, error: "Your cart is empty." };
  }

  const result = await createEmailOrdersForSlugs({
    slugs: cart.map((item) => item.slug),
    userId: user.id,
    userEmail: user.email,
    termsAcceptedAt: new Date(),
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  await clearCart();
  revalidatePath("/cart");
  revalidatePath("/account");
  revalidatePath("/admin/orders");
  revalidatePath("/admin");

  return {
    ok: true as const,
    orderIds: result.orderIds,
    total: result.total,
    mailto: result.mailto,
    emailed: result.emailed,
    count: result.orderIds.length,
  };
}
