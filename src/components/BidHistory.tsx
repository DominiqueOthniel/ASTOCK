import { formatCurrency } from "@/lib/format";
import type { BidRecord } from "@/lib/lot-service";

export function BidHistory({ bids }: { bids: BidRecord[] }) {
  if (bids.length === 0) {
    return (
      <p className="mt-3 text-sm text-steel">No bids yet. Be the first to set the pace.</p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-line border-y border-line">
      {bids.map((bid) => (
        <li key={bid.id} className="flex items-center justify-between gap-4 py-3 text-sm">
          <div>
            <p className="font-medium text-ink">{bid.userEmail}</p>
            <p className="text-xs text-steel">
              {new Date(bid.createdAt).toLocaleString()}
            </p>
          </div>
          <p className="font-display text-base font-semibold">{formatCurrency(bid.amount)}</p>
        </li>
      ))}
    </ul>
  );
}
