"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { addToCartAction } from "@/app/actions/cart";
import { requestPurchaseAction } from "@/app/actions/orders";
import { BulkPriceTiers } from "@/components/BulkPriceTiers";
import { BuyerDetailsFields } from "@/components/BuyerDetailsFields";
import { LotPrice } from "@/components/LotPrice";
import { StockPressure } from "@/components/StockPressure";
import { TermsAgree } from "@/components/TermsAgree";
import { parseBuyerDetails } from "@/lib/buyer-details";
import { hasBulkPricing, unitPriceForQuantity } from "@/lib/bulk-pricing";
import {
  clampOrderQuantity,
  lineTotal,
  maxOrderQuantity,
  meetsMinOrder,
  minOrderMessage,
  minOrderTotalDollars,
  unitLabel,
} from "@/lib/commerce";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

export function BuyBox({
  lot,
  signedIn,
  minOrderTotalCents,
  accountEmail = "",
}: {
  lot: Lot;
  signedIn: boolean;
  minOrderTotalCents: number;
  accountEmail?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const closed = lot.status === "sold" || new Date(lot.endsAt).getTime() <= Date.now();
  const maxQty = maxOrderQuantity(lot);
  const [quantity, setQuantity] = useState(lot.minQuantity || 1);
  const [message, setMessage] = useState<string | null>(null);
  const [orderDone, setOrderDone] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, startTransition] = useTransition();
  const loginHref = `/login?next=${encodeURIComponent(`/lots/${lot.slug}`)}`;
  const freeShipping = /free/i.test(lot.shipping);
  const qty = clampOrderQuantity(lot, quantity);
  const unitNow = unitPriceForQuantity(lot, qty);
  const baseUnit = lotPrice(lot);
  const total = lineTotal(lot, qty);
  const canBuyNow = meetsMinOrder(total, minOrderTotalCents);
  const minDollars = minOrderTotalDollars(minOrderTotalCents);
  const bulkActive = hasBulkPricing(lot) && unitNow < baseUnit;

  function onAddToCart() {
    const formData = new FormData();
    formData.set("slug", lot.slug);
    formData.set("quantity", String(qty));
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

  function onRequestPurchase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signedIn) {
      setMessage("Sign in to place this order.");
      return;
    }
    if (!canBuyNow) {
      setMessage(minOrderMessage(total, minOrderTotalCents));
      return;
    }
    if (!termsAccepted) {
      setMessage("Please agree to the terms to continue.");
      return;
    }

    const form = formRef.current ?? event.currentTarget;
    const formData = new FormData(form);
    formData.set("slug", lot.slug);
    formData.set("quantity", String(qty));
    formData.set("termsAccepted", "true");

    const buyer = parseBuyerDetails(formData);
    if (!buyer.ok) {
      setMessage(buyer.error);
      return;
    }

    startTransition(async () => {
      const result = await requestPurchaseAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        setOrderDone(false);
        return;
      }
      setMessage(null);
      setOrderTotal(result.amount);
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
          We received your request for {lot.title} at {formatCurrency(orderTotal || total)}. Our
          team will email next steps. No card charge until confirmed.
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
      <div className="mt-2">
        <LotPrice lot={lot} size="lg" />
      </div>
      <p className="mt-2 text-sm text-steel">
        {lot.sellByUnit ? "Per unit list" : unitLabel(lot)}
        {freeShipping ? " · Shipping free" : ""}
      </p>
      {bulkActive ? (
        <p className="mt-2 text-sm font-semibold text-accent-deep" data-testid="bulk-unit-price">
          Bulk price {formatCurrency(unitNow)} each
        </p>
      ) : null}
      <div className="mt-2">
        <StockPressure lot={lot} />
      </div>
      {lot.sellByUnit ? (
        <p className="mt-1 text-xs text-steel">Min order {lot.minQuantity}</p>
      ) : null}

      {closed ? (
        <p className="mt-6 text-sm text-steel">
          {lot.status === "sold" ? "This lot has been sold." : "This listing is unavailable."}
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {hasBulkPricing(lot) ? <BulkPriceTiers lot={lot} quantity={qty} /> : null}
          {lot.sellByUnit && maxQty > 1 ? (
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">Quantity</span>
              <input
                type="number"
                className="field"
                min={lot.minQuantity}
                max={maxQty}
                value={qty}
                onChange={(event) => setQuantity(Number(event.target.value))}
              />
            </label>
          ) : null}
          {qty > 1 ? (
            <p className="text-sm text-ink-soft">
              Line total {formatCurrency(total)}
              {bulkActive ? ` (${formatCurrency(unitNow)} × ${qty})` : ""}
            </p>
          ) : null}
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={onAddToCart}
            disabled={pending}
          >
            {pending ? "Adding…" : "Add to cart"}
          </button>
          {signedIn ? (
            <form ref={formRef} className="space-y-3" onSubmit={onRequestPurchase} noValidate>
              <BuyerDetailsFields
                idPrefix={`buy-${lot.id}`}
                disabled={pending}
                compact
                defaultEmail={accountEmail}
              />
              <TermsAgree
                checked={termsAccepted}
                onChange={setTermsAccepted}
                id={`purchase-terms-${lot.id}`}
              />
              <button
                type="submit"
                className="btn btn-secondary w-full"
                disabled={pending || !termsAccepted || !canBuyNow}
                data-testid="buy-now"
              >
                {pending
                  ? "Sending…"
                  : canBuyNow
                    ? "Request purchase"
                    : `Minimum ${formatCurrency(minDollars)}`}
              </button>
              {!canBuyNow ? (
                <p className="text-xs text-steel" data-testid="buy-now-min-hint">
                  {minOrderMessage(total, minOrderTotalCents)} Mix items in your cart to reach the
                  minimum.
                </p>
              ) : null}
            </form>
          ) : (
            <Link href={loginHref} className="btn btn-secondary w-full">
              Sign in to order
            </Link>
          )}
        </div>
      )}

      {message ? (
        <div
          className={`mt-4 space-y-2 border px-3 py-2 text-sm text-ink-soft ${
            message.toLowerCase().includes("added")
              ? "border-accent-soft bg-accent-soft/50"
              : "border-warn/30 bg-warn/10"
          }`}
          role="alert"
        >
          <p>{message}</p>
          {message.toLowerCase().includes("cart") || message.toLowerCase().includes("minimum") ? (
            <Link href="/cart" className="block font-semibold text-accent-deep hover:underline">
              View cart
            </Link>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
