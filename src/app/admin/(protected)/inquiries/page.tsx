import { prisma } from "@/lib/prisma";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.sellInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Sellers</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Inquiries</h1>
      </div>

      <div className="space-y-4">
        {inquiries.length === 0 ? (
          <p className="border border-line bg-white p-6 text-sm text-steel shadow-[var(--shadow)]">
            No seller inquiries yet.
          </p>
        ) : (
          inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="border border-line bg-white p-5 shadow-[var(--shadow)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {inquiry.company}
                  </h2>
                  <p className="mt-1 text-sm text-steel">
                    {inquiry.contactName} · {inquiry.email}
                    {inquiry.phone ? ` · ${inquiry.phone}` : ""}
                  </p>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">
                  {inquiry.handled ? "Handled" : "Open"}
                </p>
              </div>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <dt className="text-steel">Inventory</dt>
                  <dd className="mt-1 font-medium">{inquiry.inventoryType}</dd>
                </div>
                <div>
                  <dt className="text-steel">Categories</dt>
                  <dd className="mt-1 font-medium">{inquiry.categories ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-steel">Cities</dt>
                  <dd className="mt-1 font-medium">{inquiry.cities ?? "—"}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{inquiry.volume}</p>
              <p className="mt-3 text-xs text-steel">
                Received {new Date(inquiry.createdAt).toLocaleString()}
              </p>
              {!inquiry.handled ? (
                <form
                  method="post"
                  action={`/api/admin/inquiries/${inquiry.id}`}
                  className="mt-4"
                >
                  <input type="hidden" name="intent" value="handled" />
                  <button type="submit" className="btn btn-secondary !min-h-10">
                    Mark handled
                  </button>
                </form>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
