"use server";

import { revalidatePath } from "next/cache";
import { placeBid } from "@/lib/lot-service";
import { getMarketplaceUser } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStripe, siteUrl, stripeConfigured } from "@/lib/stripe";

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

export async function buyNowAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to buy this lot.",
      authRequired: true as const,
    };
  }

  const slug = String(formData.get("slug") ?? "");
  const lot = await prisma.lot.findFirst({
    where: { slug, published: true },
  });
  if (!lot) return { ok: false as const, error: "Lot not found." };
  if (lot.saleType !== "Buy Now") {
    return { ok: false as const, error: "This lot is not available for buy now." };
  }
  if (lot.status !== "open" || new Date(lot.endsAt).getTime() <= Date.now()) {
    return { ok: false as const, error: "This listing is no longer available." };
  }

  const amount = lot.buyNowPrice ?? lot.currentBid;

  if (!stripeConfigured()) {
    return {
      ok: false as const,
      error:
        "Payments are not configured yet. Stripe keys are required for buy now checkout.",
      paymentsDisabled: true as const,
    };
  }

  const order = await prisma.order.create({
    data: {
      lotId: lot.id,
      userId: user.id,
      userEmail: user.email,
      amount,
      status: "pending",
    },
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl()}/account/orders?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl()}/lots/${slug}?canceled=1`,
    customer_email: user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: lot.title,
            description: `Astock lot ${lot.slug.toUpperCase()}`,
          },
        },
      },
    ],
    metadata: {
      orderId: order.id,
      lotId: lot.id,
      userId: user.id,
      slug: lot.slug,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return {
    ok: true as const,
    checkoutUrl: session.url ?? undefined,
  };
}
