import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
};

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const user = await getMarketplaceUser();
  if (!user?.email) redirect("/login?next=/account");
  const params = await searchParams;

  const [bids, orders] = await Promise.all([
    prisma.bid.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { lot: true },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { lot: true },
    }),
  ]);

  return (
    <div className="site-grid pt-28 pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Your Astock activity</h1>
      <p className="mt-2 text-steel">{user.email}</p>
      {params.success ? (
        <p className="mt-4 border border-accent-soft bg-accent-soft/40 px-3 py-2 text-sm">
          Payment received. Your order will show as paid once Stripe confirms the webhook.
        </p>
      ) : null}

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Recent bids</h2>
        {bids.length === 0 ? (
          <p className="mt-3 text-sm text-steel">
            No bids yet.{" "}
            <Link href="/browse" className="text-accent-deep hover:underline">
              Browse lots
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {bids.map((bid) => (
              <li key={bid.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <Link href={`/lots/${bid.lot.slug}`} className="font-medium hover:text-accent-deep">
                  {bid.lot.title}
                </Link>
                <span className="font-display font-semibold">{formatCurrency(bid.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Orders</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-steel">No purchases yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <Link href={`/lots/${order.lot.slug}`} className="font-medium hover:text-accent-deep">
                    {order.lot.title}
                  </Link>
                  <p className="text-xs uppercase tracking-[0.08em] text-steel">{order.status}</p>
                </div>
                <span className="font-display font-semibold">{formatCurrency(order.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
