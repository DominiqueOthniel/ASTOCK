"use client";

import { useMemo, useState } from "react";
import { Countdown } from "@/components/Countdown";
import { formatCurrency } from "@/lib/lots";
import type { Lot } from "@/lib/types";

export function BidBox({ lot }: { lot: Lot }) {
  const minBid = lot.currentBid + 25;
  const [amount, setAmount] = useState(String(minBid));
  const [message, setMessage] = useState<string | null>(null);

  const parsed = useMemo(() => Number(amount.replace(/[^0-9.]/g, "")), [amount]);

  function placeBid(event: React.FormEvent) {
    event.preventDefault();
    if (Number.isNaN(parsed) || parsed < minBid) {
      setMessage(`Enter at least ${formatCurrency(minBid)}.`);
      return;
    }
    setMessage(`Mock bid of ${formatCurrency(parsed)} recorded. No payment processed.`);
  }

  function buyNow() {
    setMessage(
      `Mock purchase started at ${formatCurrency(lot.buyNowPrice ?? lot.currentBid)}. No payment processed.`,
    );
  }

  return (
    <aside className="border border-line bg-white p-5 shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-steel">
            {lot.saleType === "Buy Now" ? "Fixed price" : "Live auction"}
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">
            {formatCurrency(
              lot.saleType === "Buy Now" ? lot.buyNowPrice ?? lot.currentBid : lot.currentBid,
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.14em] text-steel">Ends in</p>
          <Countdown endsAt={lot.endsAt} className="mt-2 block text-lg font-semibold text-warn" />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4 text-sm">
        <div>
          <dt className="text-steel">Bids</dt>
          <dd className="mt-1 font-semibold">{lot.bidCount}</dd>
        </div>
        <div>
          <dt className="text-steel">Reserve</dt>
          <dd className="mt-1 font-semibold">{lot.reserveMet ? "Met" : "Not met"}</dd>
        </div>
        <div>
          <dt className="text-steel">Est. retail</dt>
          <dd className="mt-1 font-semibold">{formatCurrency(lot.estimatedRetail)}</dd>
        </div>
        <div>
          <dt className="text-steel">Units</dt>
          <dd className="mt-1 font-semibold">{lot.unitCount.toLocaleString()}</dd>
        </div>
      </dl>

      {lot.saleType === "Auction" ? (
        <form className="mt-5 space-y-3" onSubmit={placeBid}>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="bid-amount">
            Your bid (USD)
          </label>
          <input
            id="bid-amount"
            className="field"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
          <button type="submit" className="btn btn-primary w-full">
            Place bid
          </button>
        </form>
      ) : (
        <button type="button" className="btn btn-primary mt-5 w-full" onClick={buyNow}>
          Buy now
        </button>
      )}

      {message ? (
        <p className="mt-4 border border-accent-soft bg-accent-soft/50 px-3 py-2 text-sm text-ink-soft">
          {message}
        </p>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-steel">
          Demo bidding only. Astock does not process payments in this preview.
        </p>
      )}
    </aside>
  );
}
