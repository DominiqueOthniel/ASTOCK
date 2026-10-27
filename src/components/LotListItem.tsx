import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { formatCondition, formatCurrency } from "@/lib/lots";
import type { Lot } from "@/lib/types";

export function LotListItem({ lot }: { lot: Lot }) {
  return (
    <Link href={`/lots/${lot.id}`} className="lot-row group">
      <div className="relative aspect-[4/3] overflow-hidden bg-mist md:aspect-square md:h-[72px] md:w-[96px]">
        <Image
          src={lot.images[0]}
          alt={`Photo of ${lot.title}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="96px"
        />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] uppercase tracking-[0.08em] text-steel">
          <span>{lot.category}</span>
          <span aria-hidden="true">·</span>
          <span>{lot.lotType}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCondition(lot.condition)}</span>
        </div>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-ink transition-colors group-hover:text-accent-deep md:text-lg">
          {lot.title}
        </h3>
        <p className="mt-0.5 text-sm text-steel">
          {lot.unitCount.toLocaleString()} units · {lot.location}
          {lot.saleType === "Buy Now" ? " · Buy now" : ` · ${lot.bidCount} bids`}
        </p>
      </div>
      <div className="flex items-end justify-between gap-6 md:flex-col md:items-end md:text-right">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-steel">
            {lot.saleType === "Buy Now" ? "Buy now" : "Current bid"}
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold text-ink md:text-xl">
            {formatCurrency(lot.saleType === "Buy Now" ? lot.buyNowPrice ?? lot.currentBid : lot.currentBid)}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-steel">Ends in</p>
          <Countdown endsAt={lot.endsAt} className="mt-0.5 block text-sm font-semibold text-warn" />
        </div>
      </div>
    </Link>
  );
}
