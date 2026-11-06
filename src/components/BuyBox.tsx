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
  const [mailto, setMailto] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, startTransition] = useTransition();
  const loginHref = `/login?next=${encodeURIComponent(`/lots/${lot.slug}`)}`;

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
      <p className="text-xs uppercase tracking-[0.14em] text-steel">
        {lot.status === "sold" ? "Sold" : closed ? "Unavailable" : "Asking price"}
      </p>
      <p className="mt-2 break-words font-display text-3xl font-bold text-ink">
        {formatCurrency(price)}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4 text-sm">
        <div>
          <dt className="text-steel">Units</dt>
          <dd className="mt-1 font-semibold">{lot.unitCount.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-steel">Est. retail</dt>
          <dd className="mt-1 font-semibold">{formatCurrency(lot.estimatedRetail)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-steel">Location</dt>
          <dd className="mt-1 font-semibold">{lot.location}</dd>
        </div>
      </dl>

      {closed ? (
        <p className="mt-5 text-sm text-steel">
          {lot.status === "sold" ? "This lot has been sold." : "This listing is no longer available."}
        </p>
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
                {pending ? "Sending…" : "Request purchase"}
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
          {message.toLowerCase().includes("cart") ? (
            <Link href="/cart" className="block font-semibold text-accent-deep hover:underline">
              Go to cart
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 text-xs leading-relaxed text-steel">
          Fixed price. Add to cart or request purchase. Astock confirms by email.
        </p>
      )}
    </aside>
  );
}
