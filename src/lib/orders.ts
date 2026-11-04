import { notifyOrderRequest } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

export function ordersInboxEmail() {
  return (
    process.env.ORDERS_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "admin@astock.market"
  );
}

export function buildOrderMailto(opts: {
  lotTitle: string;
  slug: string;
  amount: number;
  userEmail: string;
  orderId: string;
}) {
  const to = ordersInboxEmail();
  const subject = encodeURIComponent(
    `Astock order request: ${opts.lotTitle} (${opts.slug})`,
  );
  const body = encodeURIComponent(
    [
      `Order ID: ${opts.orderId}`,
      `Lot: ${opts.lotTitle}`,
      `Slug: ${opts.slug}`,
      `Amount: $${opts.amount.toLocaleString()}`,
      `Buyer: ${opts.userEmail}`,
      `Link: ${siteUrl()}/lots/${opts.slug}`,
      "",
      "Please confirm availability and next steps with the buyer by email.",
    ].join("\n"),
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export async function createEmailOrder(opts: {
  slug: string;
  userId: string;
  userEmail: string;
  termsAcceptedAt: Date;
}): Promise<
  | {
      ok: true;
      orderId: string;
      amount: number;
      mailto: string;
      emailed: boolean;
    }
  | { ok: false; error: string }
> {
  const lot = await prisma.lot.findFirst({
    where: { slug: opts.slug, published: true },
  });
  if (!lot) return { ok: false, error: "Lot not found." };
  if (lot.saleType !== "Buy Now") {
    return { ok: false, error: "This lot is not available for purchase request." };
  }
  if (lot.status !== "open" || new Date(lot.endsAt).getTime() <= Date.now()) {
    return { ok: false, error: "This listing is no longer available." };
  }

  const amount = lot.buyNowPrice ?? lot.currentBid;
  const order = await prisma.order.create({
    data: {
      lotId: lot.id,
      userId: opts.userId,
      userEmail: opts.userEmail,
      amount,
      status: "email_pending",
      termsAcceptedAt: opts.termsAcceptedAt,
    },
  });

  const mailto = buildOrderMailto({
    lotTitle: lot.title,
    slug: lot.slug,
    amount,
    userEmail: opts.userEmail,
    orderId: order.id,
  });

  const emailed = await notifyOrderRequest({
    opsEmail: ordersInboxEmail(),
    buyerEmail: opts.userEmail,
    lotTitle: lot.title,
    slug: lot.slug,
    amount,
    orderId: order.id,
  });

  return {
    ok: true,
    orderId: order.id,
    amount,
    mailto,
    emailed: emailed.ok && !emailed.queued,
  };
}
