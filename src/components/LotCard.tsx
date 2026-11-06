import Image from "next/image";
import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { formatCondition, formatCurrency } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function LotCard({ lot }: { lot: Lot }) {
  const price =
    lot.saleType === "Buy Now" ? lot.buyNowPrice ?? lot.currentBid : lot.currentBid;

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
          <span>{lot.lotType}</span>
          <span aria-hidden="true">·</span>
          <span>{formatCondition(lot.condition)}</span>
        </div>
        <h3 className="lot-card-title">{lot.title}</h3>
        <p className="mt-0.5 text-[11px] leading-snug text-steel">
          {lot.unitCount.toLocaleString()} units · {lot.location}
        </p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.1em] text-steel">
              {lot.saleType === "Buy Now" ? "Buy now" : "Current bid"}
            </p>
            <p className="font-display text-base font-semibold leading-tight text-ink">
              {formatCurrency(price)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] uppercase tracking-[0.1em] text-steel">Ends</p>
            <Countdown endsAt={lot.endsAt} className="block text-xs font-semibold text-warn" />
          </div>
        </div>
      </div>
    </Link>
  );
}
