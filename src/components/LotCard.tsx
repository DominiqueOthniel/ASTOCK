import Image from "next/image";
import Link from "next/link";
import { LotPrice } from "@/components/LotPrice";
import { StockPressure } from "@/components/StockPressure";
import { formatCondition } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function LotCard({ lot }: { lot: Lot }) {
  return (
    <Link href={`/lots/${lot.slug}`} className="lot-card group">
      <div className="lot-card-media">
        <Image
          src={
            lot.images[0] ??
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
          }
          alt={`Photo of ${lot.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="lot-card-body">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] uppercase tracking-[0.08em] text-steel">
          <span>{lot.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCondition(lot.condition)}</span>
        </div>
        <h3 className="lot-card-title">{lot.title}</h3>
        <div className="mt-2">
          <LotPrice lot={lot} size="sm" />
        </div>
        <div className="mt-1.5">
          <StockPressure lot={lot} compact />
        </div>
      </div>
    </Link>
  );
}
