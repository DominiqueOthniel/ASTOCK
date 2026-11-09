"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { requestPurchaseAction } from "@/app/actions/orders";
import { TermsAgree } from "@/components/TermsAgree";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export function BuyBox({
  lot,
  signedIn,
}: {
  lot: Lot;
  signedIn: boolean;
}) {
  const router = useRouter();
  const closed = lot.status === "sold" || new Date(lot.endsAt).getTime() <= Date.now();
  const price = lotPrice(lot);
  const [message, setMessage] = useState<string | null>(null);
  const [orderDone, setOrderDone] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, startTransition] = useTransition();
  const loginHref = `/login?next=${encodeURIComponent(`/lots/${lot.slug}`)}`;
  const freeShipping = /free/i.test(lot.shipping);

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
      setMessage("Sign in to place this order.");
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
        setOrderDone(false);
        return;
      }
      setMessage(null);
      setOrderDone(true);
    });
  }

  if (orderDone) {
    return (
      <aside
        className="w-full min-w-0 border border-accent-soft bg-surface p-5 shadow-[var(--shadow)]"
        role="status"
        aria-live="polite"
        data-testid="lot-order-success"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-deep">
          Order received
        </p>
        <p className="mt-2 font-display text-2xl font-semibold text-ink">Thank you</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          We received your request for {lot.title} at {formatCurrency(price)}. Our team will email
          next steps. No card charge until confirmed.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link href="/account" className="btn btn-primary w-full">
            View orders
          </Link>
          <Link href="/browse" className="btn btn-secondary w-full">
            Keep browsing
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full min-w-0 border border-line bg-surface p-5 shadow-[var(--shadow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">
        {lot.status === "sold" ? "Sold" : closed ? "Unavailable" : "Price"}
      </p>
      <p className="mt-2 font-display text-4xl font-bold text-ink">{formatCurrency(price)}</p>
      <p className="mt-2 text-sm text-steel">
        {lot.unitCount.toLocaleString()} unit{lot.unitCount === 1 ? "" : "s"}
        {freeShipping ? " · Shipping free" : ""}
      </p>

      {closed ? (
        <p className="mt-6 text-sm text-steel">
          {lot.status === "sold" ? "This lot has been sold." : "This listing is unavailable."}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={onAddToCart}
            disabled={pending}
          >
            {pending ? "Adding…" : "Add to cart"}
          </button>
          {signedIn ? (
            <>
              <TermsAgree
                checked={termsAccepted}
                onChange={setTermsAccepted}
                id={`purchase-terms-${lot.id}`}
              />
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={onRequestPurchase}
                disabled={pending || !termsAccepted}
              >
                {pending ? "Sending…" : "Request purchase"}
              </button>
            </>
          ) : (
            <Link href={loginHref} className="btn btn-secondary w-full">
              Sign in to order
            </Link>
          )}
        </div>
      )}

      {message ? (
        <div className="mt-4 space-y-2 border border-accent-soft bg-accent-soft/50 px-3 py-2 text-sm text-ink-soft">
          <p>{message}</p>
          {message.toLowerCase().includes("cart") ? (
            <Link href="/cart" className="block font-semibold text-accent-deep hover:underline">
              View cart
            </Link>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
