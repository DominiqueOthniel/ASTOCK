import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { getDashboardCounts, listAllLotsAdmin } from "@/lib/lot-service";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [counts, lots, recentInquiries, recentOrders] = await Promise.all([
    getDashboardCounts(),
    listAllLotsAdmin(),
    prisma.sellInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { lot: true },
    }),
  ]);

  const retailLive = lots
    .filter((lot) => lot.published)
    .reduce((sum, lot) => sum + lot.estimatedRetail, 0);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Overview</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Dashboard</h1>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published lots", value: String(counts.publishedLots) },
          { label: "Draft lots", value: String(counts.draftLots) },
          { label: "Open inquiries", value: String(counts.openInquiries) },
          { label: "Live est. retail", value: formatCurrency(retailLive) },
        ].map((item) => (
          <div key={item.label} className="border border-line bg-white p-5 shadow-[var(--shadow)]">
            <dt className="text-xs uppercase tracking-[0.14em] text-steel">{item.label}</dt>
            <dd className="mt-2 font-display text-3xl font-semibold text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="border border-line bg-white p-5 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Recent lots</h2>
            <Link href="/admin/lots" className="text-sm font-semibold text-accent hover:text-accent-deep">
              Manage
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {lots.slice(0, 6).map((lot) => (
              <li key={lot.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{lot.title}</p>
                  <p className="text-steel">
                    {lot.published ? "Published" : "Draft"} · {lot.slug}
                  </p>
                </div>
                <Link
                  href={`/admin/lots/${lot.id}/edit`}
                  className="shrink-0 font-semibold text-accent hover:text-accent-deep"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="border border-line bg-white p-5 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold">Seller inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="text-sm font-semibold text-accent hover:text-accent-deep"
            >
              Inbox
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {recentInquiries.length === 0 ? (
              <li className="py-6 text-sm text-steel">No inquiries yet.</li>
            ) : (
              recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="py-3 text-sm">
                  <p className="font-medium text-ink">
                    {inquiry.company} · {inquiry.contactName}
                  </p>
                  <p className="text-steel">
                    {inquiry.handled ? "Handled" : "Open"} · {inquiry.inventoryType}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="border border-line bg-white p-5 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">Purchase requests</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-accent hover:text-accent-deep">
            Orders
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {recentOrders.length === 0 ? (
            <li className="py-6 text-sm text-steel">No purchase requests yet.</li>
          ) : (
            recentOrders.map((order) => (
              <li key={order.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{order.lot.title}</p>
                  <p className="text-steel">
                    {order.userEmail} · {order.status}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(order.amount)}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
