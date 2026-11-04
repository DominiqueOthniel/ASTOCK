import Link from "next/link";
import { notFound } from "next/navigation";
import { LotForm } from "@/components/admin/LotForm";
import { getLotByIdAdmin } from "@/lib/lot-service";

type EditLotPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditLotPage({ params }: EditLotPageProps) {
  const { id } = await params;
  const lot = await getLotByIdAdmin(id);
  if (!lot) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/lots" className="text-sm font-medium text-steel hover:text-accent-deep">
          ← Back to lots
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Edit lot</h1>
        <p className="mt-1 text-sm text-steel">{lot.slug}</p>
      </div>
      <LotForm mode="edit" lot={lot} />
    </div>
  );
}
