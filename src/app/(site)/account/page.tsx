import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { getMarketplaceUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
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

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 40,
    include: { lot: true },
  });

  return (
    <div className="site-grid py-14 md:py-16">
      <h1 className="font-display text-4xl font-semibold text-ink">Your orders</h1>
      <p className="mt-2 text-steel">{user.email}</p>
      {params.success ? (
        <p className="mt-4 border border-accent-soft bg-accent-soft/40 px-3 py-2 text-sm">
          Order recorded. PalletDeals will confirm next steps by email.
        </p>
      ) : null}

      <section className="mt-10">
        {orders.length === 0 ? (
          <p className="text-sm text-steel">
            No orders yet.{" "}
            <Link href="/browse" className="text-accent-deep hover:underline">
              Browse lots
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <Link
                    href={`/lots/${order.lot.slug}`}
                    className="font-medium hover:text-accent-deep"
                  >
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
