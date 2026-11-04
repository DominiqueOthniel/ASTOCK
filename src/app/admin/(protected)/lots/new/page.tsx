import Link from "next/link";
import { LotForm } from "@/components/admin/LotForm";

export default function AdminNewLotPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/lots" className="text-sm font-medium text-steel hover:text-accent-deep">
          ← Back to lots
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">New lot</h1>
      </div>
      <LotForm mode="create" />
    </div>
  );
}
