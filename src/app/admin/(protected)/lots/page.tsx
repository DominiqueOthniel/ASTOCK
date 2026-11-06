import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { listAllLotsAdmin } from "@/lib/lot-service";
import { lotPrice } from "@/lib/pricing";

export default async function AdminLotsPage() {
  const lots = await listAllLotsAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">Catalog</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Lots</h1>
        </div>
        <Link href="/admin/lots/new" className="btn btn-primary">
          New lot
        </Link>
      </div>

      <div className="table-scroll border border-line bg-white shadow-[var(--shadow)]">
        <table className="min-w-[40rem] w-full text-left text-sm">
          <thead className="border-b border-line bg-mist/60 text-xs uppercase tracking-[0.12em] text-steel">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Available until</th>
              <th className="px-4 py-3 font-semibold"> </th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{lot.title}</p>
                  <p className="text-xs text-steel">{lot.slug}</p>
                </td>
                <td className="px-4 py-3 text-steel">
                  {lot.published ? "Published" : "Draft"}
                  {lot.featured ? " · Featured" : ""}
                </td>
                <td className="px-4 py-3">{formatCurrency(lotPrice(lot))}</td>
                <td className="px-4 py-3 text-steel">
                  {new Date(lot.endsAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/lots/${lot.id}/edit`}
                    className="font-semibold text-accent hover:text-accent-deep"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
