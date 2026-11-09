import Image from "next/image";
import Link from "next/link";
import { LotPrice } from "@/components/LotPrice";
import { StockPressure } from "@/components/StockPressure";
import { formatCondition } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function LotListItem({ lot }: { lot: Lot }) {
  return (
    <Link href={`/lots/${lot.slug}`} className="lot-row group">
      <div className="lot-media relative aspect-[4/3] sm:aspect-[4/3] md:aspect-square md:h-[72px] md:w-[96px]">
        <Image
          src={
            lot.images[0] ??
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
          }
          alt={`Photo of ${lot.title}`}
          fill
          className="lot-media-img"
          sizes="(max-width: 768px) 100vw, 96px"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] uppercase tracking-[0.08em] text-steel">
          <span>{lot.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCondition(lot.condition)}</span>
        </div>
        <h3 className="mt-1 break-words font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-accent-deep md:text-lg">
          {lot.title}
        </h3>
        <div className="mt-1">
          <StockPressure lot={lot} compact />
        </div>
      </div>
      <div className="md:text-right">
        <LotPrice lot={lot} size="sm" />
      </div>
    </Link>
  );
}
