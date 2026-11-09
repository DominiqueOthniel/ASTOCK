"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  checkoutCartAction,
  removeFromCartAction,
  updateCartQuantityAction,
} from "@/app/actions/cart";
import { TermsAgree } from "@/components/TermsAgree";
import {
  lineTotal,
  maxOrderQuantity,
  meetsMinOrder,
  minOrderMessage,
  minOrderTotalDollars,
  remainingToMinOrder,
  unitLabel,
} from "@/lib/commerce";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

type CartLine = {
  lot: Lot;
  quantity: number;
};

type OrderSuccess = {
  count: number;
  total: number;
  emailed: boolean;
};

export function CartCheckout({
  lines,
  signedIn,
  minOrderTotalCents,
}: {
  lines: CartLine[];
  signedIn: boolean;
  minOrderTotalCents: number;
}) {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<OrderSuccess | null>(null);
  const [pending, startTransition] = useTransition();
  const total = lines.reduce((sum, line) => sum + lineTotal(line.lot, line.quantity), 0);
  const remaining = remainingToMinOrder(total, minOrderTotalCents);
  const canCheckout = meetsMinOrder(total, minOrderTotalCents);
  const minDollars = minOrderTotalDollars(minOrderTotalCents);

  function onRemove(slug: string) {
    const formData = new FormData();
    formData.set("slug", slug);
    startTransition(async () => {
      await removeFromCartAction(formData);
      router.refresh();
    });
  }

  function onQuantity(slug: string, quantity: number) {
    const formData = new FormData();
    formData.set("slug", slug);
    formData.set("quantity", String(quantity));
    startTransition(async () => {
      await updateCartQuantityAction(formData);
      router.refresh();
    });
  }

  function onCheckout() {
    if (!signedIn) {
      setError("Sign in to request your order.");
      return;
    }
    if (!canCheckout) {
      setError(minOrderMessage(total, minOrderTotalCents));
      return;
    }
    if (!termsAccepted) {
      setError("Please agree to the terms to continue.");
      return;
    }
    const formData = new FormData();
    formData.set("termsAccepted", "true");
    startTransition(async () => {
      const result = await checkoutCartAction(formData);
      if (!result.ok) {
        setError(result.error);
        setSuccess(null);
        return;
      }
      setError(null);
      setSuccess({
        count: result.count,
        total: result.total,
        emailed: result.emailed,
      });
      router.refresh();
    });
  }

  if (success) {
    return (
      <div
        className="border border-accent-soft bg-surface px-6 py-12 text-center shadow-[var(--shadow)] sm:px-10"
        role="status"
        aria-live="polite"
        data-testid="order-success"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
          Order received
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Thank you</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          We received your request for {success.count} lot
          {success.count === 1 ? "" : "s"} totaling {formatCurrency(success.total)}.
          {success.emailed
            ? " A confirmation email is on the way."
            : " Your order is saved in your account."}
        </p>
        <div className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-ink-soft">
          <p className="font-semibold text-ink">What happens next</p>
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Our team reviews availability and shipping.</li>
            <li>You get a follow-up email with next steps.</li>
            <li>No card charge until the order is confirmed.</li>
          </ol>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="btn btn-primary">
            View orders
          </Link>
          <Link href="/browse" className="btn btn-secondary">
            Keep browsing
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-line bg-surface px-6 py-14 text-center shadow-[var(--shadow)]">
        <p className="font-display text-2xl font-semibold text-ink">Cart is empty</p>
        <p className="mt-2 text-sm text-steel">Find a lot and add it.</p>
        <Link href="/browse" className="btn btn-primary mt-6">
          Browse lots
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-3">
        {lines.map(({ lot, quantity }) => {
          const maxQty = maxOrderQuantity(lot);
          return (
            <div
              key={lot.id}
              className="grid gap-4 border border-line bg-surface p-3 shadow-[var(--shadow)] sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center"
            >
              <Link
                href={`/lots/${lot.slug}`}
                className="relative aspect-[4/3] overflow-hidden bg-mist sm:aspect-square sm:h-[88px] sm:w-[88px]"
              >
                <Image
                  src={
                    lot.images[0] ??
                    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                  }
                  alt=""
                  fill
                  className="object-cover"
                  sizes="88px"
                />
              </Link>
              <div className="min-w-0">
                <Link
                  href={`/lots/${lot.slug}`}
                  className="font-display text-lg font-semibold text-ink hover:text-accent-deep"
                >
                  {lot.title}
                </Link>
                <p className="mt-1 text-sm text-steel">
                  {lot.sellByUnit
                    ? `${formatCurrency(lotPrice(lot))} each`
                    : unitLabel(lot, quantity)}
                </p>
                {lot.sellByUnit && maxQty > 1 ? (
                  <label className="mt-2 inline-flex items-center gap-2 text-sm text-ink-soft">
                    <span>Qty</span>
                    <input
                      type="number"
                      min={lot.minQuantity}
                      max={maxQty}
                      value={quantity}
                      className="field w-20 py-1"
                      disabled={pending}
                      onChange={(event) => onQuantity(lot.slug, Number(event.target.value))}
                    />
                  </label>
                ) : (
                  <p className="mt-1 text-sm text-steel">{unitLabel(lot, quantity)}</p>
                )}
                <button
                  type="button"
                  className="mt-2 text-sm font-semibold text-warn hover:underline"
                  onClick={() => onRemove(lot.slug)}
                  disabled={pending}
                >
                  Remove
                </button>
              </div>
              <p className="font-display text-lg font-semibold sm:text-right">
                {formatCurrency(lineTotal(lot, quantity))}
              </p>
            </div>
          );
        })}
      </div>

      <aside className="h-fit border border-line bg-surface p-5 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Order</p>
        <p className="mt-2 font-display text-3xl font-bold text-ink">{formatCurrency(total)}</p>
        <p className="mt-1 text-sm text-steel">
          {lines.length} lot{lines.length === 1 ? "" : "s"} · Shipping free
        </p>

        <div
          className={`mt-4 border px-3 py-2 text-sm ${
            canCheckout
              ? "border-accent-soft bg-accent-soft/40 text-ink-soft"
              : "border-warn/30 bg-warn/10 text-ink-soft"
          }`}
          data-testid="min-order-banner"
          role="status"
        >
          {canCheckout ? (
            <p>Order minimum of {formatCurrency(minDollars)} met.</p>
          ) : (
            <p>{minOrderMessage(total, minOrderTotalCents)}</p>
          )}
        </div>

        {signedIn ? (
          <div className="mt-5 space-y-4">
            <TermsAgree
              checked={termsAccepted}
              onChange={setTermsAccepted}
              id="cart-terms"
            />
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={onCheckout}
              disabled={pending || !termsAccepted || !canCheckout || lines.length === 0}
              data-testid="cart-checkout"
            >
              {pending ? "Sending…" : canCheckout ? "Request order" : `Minimum ${formatCurrency(minDollars)}`}
            </button>
          </div>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent("/cart")}`}
            className="btn btn-primary mt-5 w-full"
          >
            Sign in to order
          </Link>
        )}

        {error ? (
          <p className="mt-4 border border-line bg-mist/60 px-3 py-2 text-sm text-ink-soft" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-4 text-xs text-steel">
            Email confirmation from PalletDeals ops. No card charge until confirmed.
            {remaining > 0 ? ` ${formatCurrency(remaining)} left to unlock checkout.` : ""}
          </p>
        )}
      </aside>
    </div>
  );
}
