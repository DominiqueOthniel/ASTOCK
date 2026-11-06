"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkoutCartAction, removeFromCartAction } from "@/app/actions/cart";
import { TermsAgree } from "@/components/TermsAgree";
import { formatCurrency } from "@/lib/format";
import type { Lot } from "@/lib/types";

export function CartCheckout({
  lots,
  signedIn,
}: {
  lots: Lot[];
  signedIn: boolean;
}) {
  const router = useRouter();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const total = lots.reduce(
    (sum, lot) => sum + (lot.buyNowPrice ?? lot.currentBid),
    0,
  );

  function onRemove(slug: string) {
    const formData = new FormData();
    formData.set("slug", slug);
    startTransition(async () => {
      await removeFromCartAction(formData);
      router.refresh();
    });
  }

  function onCheckout() {
    if (!signedIn) {
      setMessage("Sign in to place your order.");
      return;
    }
    if (!termsAccepted) {
      setMessage("Please agree to the terms to continue.");
      return;
    }
    const formData = new FormData();
    formData.set("termsAccepted", "true");
    startTransition(async () => {
      const result = await checkoutCartAction(formData);
      if (!result.ok) {
        setMessage(result.error);
        setMailto(null);
        return;
      }
      setMailto(result.mailto);
      setMessage(
        result.emailed
          ? `Order placed for ${result.count} lot${result.count === 1 ? "" : "s"} (${formatCurrency(result.total)}). We emailed ops and will follow up.`
          : `Order recorded for ${result.count} lot${result.count === 1 ? "" : "s"} (${formatCurrency(result.total)}). Open email to ops if needed.`,
      );
      router.refresh();
    });
  }

  if (lots.length === 0 && !message) {
    return (
      <div className="border border-line bg-white p-8 text-center shadow-[var(--shadow)]">
        <p className="font-display text-xl font-semibold text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-steel">Add Buy Now lots from the catalog.</p>
        <Link href="/browse" className="btn btn-primary mt-6">
          Browse lots
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        {lots.map((lot) => (
          <div
            key={lot.id}
            className="flex flex-col gap-3 border border-line bg-white p-4 shadow-[var(--shadow)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <Link
                href={`/lots/${lot.slug}`}
                className="font-display text-lg font-semibold text-ink hover:text-accent-deep"
              >
                {lot.title}
              </Link>
              <p className="mt-1 text-sm text-steel">
                {lot.location} · {lot.unitCount.toLocaleString()} units
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
              <p className="font-display text-lg font-semibold">
                {formatCurrency(lot.buyNowPrice ?? lot.currentBid)}
              </p>
              <button
                type="button"
                className="text-sm font-semibold text-warn hover:underline"
                onClick={() => onRemove(lot.slug)}
                disabled={pending}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="h-fit border border-line bg-white p-5 shadow-[var(--shadow)]">
        <p className="text-xs uppercase tracking-[0.14em] text-steel">Checkout</p>
        <p className="mt-2 font-display text-3xl font-bold text-ink">{formatCurrency(total)}</p>
        <p className="mt-1 text-sm text-steel">
          {lots.length} lot{lots.length === 1 ? "" : "s"} · email order
        </p>

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
              disabled={pending || !termsAccepted || lots.length === 0}
            >
              {pending ? "Placing order…" : "Place order"}
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

        {message ? (
          <div className="mt-4 space-y-2 border border-accent-soft bg-accent-soft/50 px-3 py-2 text-sm text-ink-soft">
            <p>{message}</p>
            {mailto ? (
              <a href={mailto} className="font-semibold text-accent-deep hover:underline">
                Open email to ops
              </a>
            ) : null}
            <Link href="/account" className="block font-semibold text-accent-deep hover:underline">
              View account orders
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-xs leading-relaxed text-steel">
            We record your order and notify Astock ops by email. No card checkout.
          </p>
        )}
      </aside>
    </div>
  );
}
