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
    "admin@astock.market"
  );
}

export async function buildOrderMailto(opts: {
  lotTitle: string;
  slug: string;
  amount: number;
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
  lines: { orderId: string; title: string; slug: string; amount: number }[];
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
        `Amount: $${line.amount.toLocaleString()}`,
        `Link: ${siteUrl()}/lots/${line.slug}`,
        "",
      ]),
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
  const multi = await createEmailOrdersForSlugs({
    slugs: [opts.slug],
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
  slugs: string[];
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
  const uniqueSlugs = [...new Set(opts.slugs.map((slug) => slug.trim()).filter(Boolean))];
  if (uniqueSlugs.length === 0) {
    return { ok: false, error: "No lots selected." };
  }

  const lots = await prisma.lot.findMany({
    where: { slug: { in: uniqueSlugs }, published: true },
  });
  const bySlug = new Map(lots.map((lot) => [lot.slug, lot]));

  const lines: {
    orderId: string;
    title: string;
    slug: string;
    amount: number;
  }[] = [];

  for (const slug of uniqueSlugs) {
    const lot = bySlug.get(slug);
    if (!lot) return { ok: false, error: `Lot not found: ${slug}` };
    if (lot.status !== "open" || new Date(lot.endsAt).getTime() <= Date.now()) {
      return { ok: false, error: `"${lot.title}" is no longer available.` };
    }

    const amount = askingPrice(lot);
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
    lines.push({
      orderId: order.id,
      title: lot.title,
      slug: lot.slug,
      amount,
    });
  }

  const total = lines.reduce((sum, line) => sum + line.amount, 0);
  const opsEmail = await ordersInboxEmail();
  const mailto =
    lines.length === 1
      ? await buildOrderMailto({
          lotTitle: lines[0].title,
          slug: lines[0].slug,
          amount: lines[0].amount,
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
