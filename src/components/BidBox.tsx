"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { placeBidAction, requestPurchaseAction } from "@/app/actions/bidding";
import { Countdown } from "@/components/Countdown";
import { TermsAgree } from "@/components/TermsAgree";
import { formatCurrency } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function BidBox({
  lot,
  signedIn,
}: {
  lot: Lot;
  signedIn: boolean;
}) {
  const router = useRouter();
  const closed = lot.status === "sold" || new Date(lot.endsAt).getTime() <= Date.now();
  const minBid = lot.currentBid + 25;
  const [amount, setAmount] = useState(String(minBid));
  const [message, setMessage] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
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

  function onAddToCart() {
    const formData = new FormData();
    formData.set("slug", lot.slug);
    startTransition(async () => {
      const result = await addToCartAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage("Added to cart.");
      router.refresh();
    });
  }

  function onRequestPurchase() {
    if (!signedIn) {
      setMessage("Sign in to request this purchase.");
      return;
    }
    if (!termsAccepted) {
      setMessage("Please agree to the terms to continue.");
      return;
    }
    const formData = new FormData();
    formData.set("slug", lot.slug);
    formData.set("termsAccepted", "true");
    startTransition(async () => {
      const result = await requestPurchaseAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        setMailto(null);
        return;
      }
      setMailto(result.mailto);
      setMessage(
        result.emailed
          ? `Order sent for ${formatCurrency(result.amount)}. We emailed ops and will follow up.`
          : `Order recorded for ${formatCurrency(result.amount)}. Open email to ops if needed.`,
      );
    });
  }

  return (
    <aside className="w-full min-w-0 border border-line bg-white p-4 shadow-[var(--shadow)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-steel">
            {lot.status === "sold"
              ? "Sold"
              : lot.saleType === "Buy Now"
                ? "Fixed price"
                : "Live auction"}
          </p>
          <p className="mt-2 break-words font-display text-3xl font-bold text-ink">
            {formatCurrency(
              lot.saleType === "Buy Now" ? lot.buyNowPrice ?? lot.currentBid : lot.currentBid,
            )}
          </p>
        </div>
        <div className="text-left sm:text-right">
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
      ) : (
        <div className="mt-5 space-y-3">
          <button
            type="button"
            className="btn btn-secondary w-full"
            onClick={onAddToCart}
            disabled={pending}
          >
            {pending ? "Adding…" : "Add to cart"}
          </button>
          <Link href="/cart" className="btn btn-secondary w-full">
            View cart
          </Link>
          {signedIn ? (
            <>
              <TermsAgree
                checked={termsAccepted}
                onChange={setTermsAccepted}
                id={`purchase-terms-${lot.id}`}
              />
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={onRequestPurchase}
                disabled={pending || !termsAccepted}
              >
                {pending ? "Sending request…" : "Order this lot now"}
              </button>
            </>
          ) : (
            <Link href={loginHref} className="btn btn-primary w-full">
              Sign in to order
            </Link>
          )}
        </div>
      )}

      {message ? (
        <div className="mt-4 space-y-2 border border-accent-soft bg-accent-soft/50 px-3 py-2 text-sm text-ink-soft">
          <p>{message}</p>
          {mailto ? (
            <a href={mailto} className="font-semibold text-accent-deep hover:underline">
              Open email to ops
            </a>
          ) : null}
          {message.includes("cart") ? (
            <Link href="/cart" className="block font-semibold text-accent-deep hover:underline">
              Go to cart
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-steel">
          Bids are binding. Buy Now lots can go in your cart or order by email.
        </p>
      )}
    </aside>
  );
}
