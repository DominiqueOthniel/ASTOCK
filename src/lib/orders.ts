import {
  clampOrderQuantity,
  lineTotal,
  meetsMinOrder,
  minOrderMessage,
} from "@/lib/commerce";
import { notifyOrderRequest } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { siteUrl } from "@/lib/site";

function askingPrice(lot: { buyNowPrice: number | null; currentBid: number }) {
  if (typeof lot.buyNowPrice === "number" && lot.buyNowPrice > 0) return lot.buyNowPrice;
  return lot.currentBid;
}

export async function ordersInboxEmail() {
  const settings = await getSiteSettings();
  return (
    settings.contactEmail ||
    process.env.ORDERS_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "uncledrewlegacy@gmail.com"
  );
}

export async function buildOrderMailto(opts: {
  lotTitle: string;
  slug: string;
  amount: number;
  quantity: number;
  userEmail: string;
  orderId: string;
}) {
  const to = await ordersInboxEmail();
  const subject = encodeURIComponent(
    `PalletDeals order request: ${opts.lotTitle} (${opts.slug})`,
  );
  const body = encodeURIComponent(
    [
      `Order ID: ${opts.orderId}`,
      `Lot: ${opts.lotTitle}`,
      `Slug: ${opts.slug}`,
      `Quantity: ${opts.quantity}`,
      `Amount: $${opts.amount.toLocaleString()}`,
      `Buyer: ${opts.userEmail}`,
      `Link: ${siteUrl()}/lots/${opts.slug}`,
      "",
      "Please confirm availability and next steps with the buyer by email.",
    ].join("\n"),
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export async function buildCartMailto(opts: {
  userEmail: string;
  lines: { orderId: string; title: string; slug: string; amount: number; quantity: number }[];
  total: number;
}) {
  const to = await ordersInboxEmail();
  const subject = encodeURIComponent(
    `PalletDeals cart order (${opts.lines.length} lot${opts.lines.length === 1 ? "" : "s"})`,
  );
  const body = encodeURIComponent(
    [
      `Buyer: ${opts.userEmail}`,
      `Total: $${opts.total.toLocaleString()}`,
      "",
      ...opts.lines.flatMap((line) => [
        `Order ID: ${line.orderId}`,
        `Lot: ${line.title} (${line.slug})`,
        `Quantity: ${line.quantity}`,
        `Amount: $${line.amount.toLocaleString()}`,
        `Link: ${siteUrl()}/lots/${line.slug}`,
        "",
      ]),
      "Please confirm availability and next steps with the buyer by email.",
    ].join("\n"),
  );
  return `mailto:${to}?subject=${subject}&body=${body}`;
}

export type OrderLineInput = {
  slug: string;
  quantity?: number;
};

export async function createEmailOrder(opts: {
  slug: string;
  quantity?: number;
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
  const multi = await createEmailOrdersForSlugs({
    lines: [{ slug: opts.slug, quantity: opts.quantity ?? 1 }],
    userId: opts.userId,
    userEmail: opts.userEmail,
    termsAcceptedAt: opts.termsAcceptedAt,
  });
  if (!multi.ok) return multi;
  return {
    ok: true,
    orderId: multi.orderIds[0],
    amount: multi.total,
    mailto: multi.mailto,
    emailed: multi.emailed,
  };
}

export async function createEmailOrdersForSlugs(opts: {
  lines: OrderLineInput[];
  /** @deprecated prefer lines */
  slugs?: string[];
  userId: string;
  userEmail: string;
  termsAcceptedAt: Date;
}): Promise<
  | {
      ok: true;
      orderIds: string[];
      total: number;
      mailto: string;
      emailed: boolean;
    }
  | { ok: false; error: string }
> {
  const rawLines: OrderLineInput[] =
    opts.lines?.length > 0
      ? opts.lines
      : (opts.slugs ?? []).map((slug) => ({ slug, quantity: 1 }));

  const merged = new Map<string, number>();
  for (const line of rawLines) {
    const slug = line.slug.trim();
    if (!slug) continue;
    merged.set(slug, (merged.get(slug) ?? 0) + Math.max(1, Math.floor(line.quantity ?? 1)));
  }
  const uniqueSlugs = [...merged.keys()];
  if (uniqueSlugs.length === 0) {
    return { ok: false, error: "No lots selected." };
  }

  const lots = await prisma.lot.findMany({
    where: { slug: { in: uniqueSlugs }, published: true },
  });
  const bySlug = new Map(lots.map((lot) => [lot.slug, lot]));
  const settings = await getSiteSettings();

  const prepared: {
    lot: (typeof lots)[number];
    quantity: number;
    amount: number;
  }[] = [];

  for (const slug of uniqueSlugs) {
    const lot = bySlug.get(slug);
    if (!lot) return { ok: false, error: `Lot not found: ${slug}` };
    if (lot.status !== "open" || new Date(lot.endsAt).getTime() <= Date.now()) {
      return { ok: false, error: `"${lot.title}" is no longer available.` };
    }

    const orderable = {
      buyNowPrice: lot.buyNowPrice,
      currentBid: lot.currentBid,
      unitCount: lot.unitCount,
      minQuantity: lot.minQuantity ?? 1,
      sellByUnit: Boolean(lot.sellByUnit),
      title: lot.title,
    };
    const quantity = clampOrderQuantity(orderable, merged.get(slug) ?? 1);
    if (quantity < orderable.minQuantity) {
      return {
        ok: false,
        error: `"${lot.title}" requires at least ${orderable.minQuantity} unit${orderable.minQuantity === 1 ? "" : "s"}.`,
      };
    }
    const amount = lineTotal(orderable, quantity);
    if (!(askingPrice(lot) > 0) || amount <= 0) {
      return { ok: false, error: `"${lot.title}" has no valid price.` };
    }
    prepared.push({ lot, quantity, amount });
  }

  const total = prepared.reduce((sum, line) => sum + line.amount, 0);
  if (!meetsMinOrder(total, settings.minOrderTotalCents)) {
    return { ok: false, error: minOrderMessage(total, settings.minOrderTotalCents) };
  }

  const lines: {
    orderId: string;
    title: string;
    slug: string;
    amount: number;
    quantity: number;
  }[] = [];

  for (const item of prepared) {
    const order = await prisma.order.create({
      data: {
        lotId: item.lot.id,
        userId: opts.userId,
        userEmail: opts.userEmail,
        amount: item.amount,
        quantity: item.quantity,
        status: "email_pending",
        termsAcceptedAt: opts.termsAcceptedAt,
      },
    });
    lines.push({
      orderId: order.id,
      title: item.lot.title,
      slug: item.lot.slug,
      amount: item.amount,
      quantity: item.quantity,
    });
  }

  const opsEmail = await ordersInboxEmail();
  const mailto =
    lines.length === 1
      ? await buildOrderMailto({
          lotTitle: lines[0].title,
          slug: lines[0].slug,
          amount: lines[0].amount,
          quantity: lines[0].quantity,
          userEmail: opts.userEmail,
          orderId: lines[0].orderId,
        })
      : await buildCartMailto({
          userEmail: opts.userEmail,
          lines,
          total,
        });

  let emailed = false;
  for (const line of lines) {
    const result = await notifyOrderRequest({
      opsEmail,
      buyerEmail: opts.userEmail,
      lotTitle: line.title,
      slug: line.slug,
      amount: line.amount,
      orderId: line.orderId,
    });
    if (result.ok && !result.queued) emailed = true;
  }

  return {
    ok: true,
    orderIds: lines.map((line) => line.orderId),
    total,
    mailto,
    emailed,
  };
}
