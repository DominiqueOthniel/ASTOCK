"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { buyNowAction, placeBidAction } from "@/app/actions/bidding";
import { Countdown } from "@/components/Countdown";
import { formatCurrency } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function BidBox({
  lot,
  signedIn,
}: {
  lot: Lot;
  signedIn: boolean;
}) {
  const closed = lot.status === "sold" || new Date(lot.endsAt).getTime() <= Date.now();
  const minBid = lot.currentBid + 25;
  const [amount, setAmount] = useState(String(minBid));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const parsed = useMemo(() => Number(amount.replace(/[^0-9.]/g, "")), [amount]);
  const loginHref = `/login?next=${encodeURIComponent(`/lots/${lot.slug}`)}`;

  function onPlaceBid(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signedIn) {
      setMessage("Sign in to place a bid.");
      return;
    }
    if (Number.isNaN(parsed) || parsed < minBid) {
      setMessage(`Enter at least ${formatCurrency(minBid)}.`);
      return;
    }

    const formData = new FormData();
    formData.set("slug", lot.slug);
    formData.set("amount", String(parsed));

    startTransition(async () => {
      const result = await placeBidAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage(`Bid of ${formatCurrency(parsed)} recorded.`);
      setAmount(String(result.lot.currentBid + 25));
    });
  }

  function onBuyNow() {
    if (!signedIn) {
      setMessage("Sign in to buy this lot.");
      return;
    }
    const formData = new FormData();
    formData.set("slug", lot.slug);
    startTransition(async () => {
      const result = await buyNowAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      setMessage("Checkout could not start. Try again.");
    });
  }

  return (
    <aside className="border border-line bg-white p-5 shadow-[var(--shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-steel">
            {lot.status === "sold"
              ? "Sold"
              : lot.saleType === "Buy Now"
                ? "Fixed price"
                : "Live auction"}
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

      {closed ? (
        <p className="mt-5 text-sm text-steel">
          {lot.status === "sold" ? "This lot has been sold." : "This listing has ended."}
        </p>
      ) : lot.saleType === "Auction" ? (
        <form className="mt-5 space-y-3" onSubmit={onPlaceBid}>
          <label className="block text-sm font-medium text-ink-soft" htmlFor="bid-amount">
            Your bid (USD)
          </label>
          <input
            id="bid-amount"
            className="field"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={pending || !signedIn}
          />
          {signedIn ? (
            <button type="submit" className="btn btn-primary w-full" disabled={pending}>
              {pending ? "Placing bid…" : "Place bid"}
            </button>
          ) : (
            <Link href={loginHref} className="btn btn-primary w-full">
              Sign in to bid
            </Link>
          )}
        </form>
      ) : signedIn ? (
        <button
          type="button"
          className="btn btn-primary mt-5 w-full"
          onClick={onBuyNow}
          disabled={pending}
        >
          {pending ? "Starting checkout…" : "Buy now"}
        </button>
      ) : (
        <Link href={loginHref} className="btn btn-primary mt-5 w-full">
          Sign in to buy
        </Link>
      )}

      {message ? (
        <p className="mt-4 border border-accent-soft bg-accent-soft/50 px-3 py-2 text-sm text-ink-soft">
          {message}
        </p>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-steel">
          Bids are binding once placed. Buy now opens Stripe Checkout when payments are enabled.
        </p>
      )}
    </aside>
  );
}
