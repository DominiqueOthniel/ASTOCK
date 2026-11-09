import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { lot: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Inbox</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Purchase requests</h1>
        <p className="mt-2 max-w-2xl text-sm text-steel">
          Email-based buy requests from authenticated buyers. Follow up by email or phone to confirm
          the sale.
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="border border-line bg-white p-6 text-sm text-steel shadow-[var(--shadow)]">
          No purchase requests yet.
        </p>
      ) : (
        <ul className="divide-y divide-line border border-line bg-white shadow-[var(--shadow)]">
          {orders.map((order) => {
            const address =
              order.shipStreet && order.shipCity && order.shipState && order.shipPostal
                ? `${order.shipStreet}, ${order.shipCity}, ${order.shipState} ${order.shipPostal}${
                    order.shipCountry ? `, ${order.shipCountry}` : ""
                  }`
                : null;

            return (
              <li
                key={order.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-ink">{order.lot.title}</p>
                  <p className="text-sm text-steel">
                    {order.userEmail} · {order.status} ·{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  {order.buyerFullName ? (
                    <p className="text-sm text-ink-soft">
                      {order.buyerFullName}
                      {order.buyerPhone ? ` · ${order.buyerPhone}` : ""}
                      {typeof order.buyerAge === "number" ? ` · Age ${order.buyerAge}` : ""}
                    </p>
                  ) : null}
                  {address ? <p className="text-sm text-ink-soft">{address}</p> : null}
                  <p className="text-xs text-steel">Order {order.id}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <p className="font-display text-lg font-semibold">
                    {formatCurrency(order.amount)}
                  </p>
                  <Link
                    href={`/lots/${order.lot.slug}`}
                    className="text-sm font-semibold text-accent hover:text-accent-deep"
                  >
                    View lot
                  </Link>
                  <a
                    href={`mailto:${order.userEmail}?subject=${encodeURIComponent(`PalletDeals order ${order.id}`)}`}
                    className="text-sm font-semibold text-accent hover:text-accent-deep"
                  >
                    Email buyer
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
