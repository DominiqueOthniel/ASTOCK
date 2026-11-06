"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkoutCartAction, removeFromCartAction } from "@/app/actions/cart";
import { TermsAgree } from "@/components/TermsAgree";
import { formatCurrency } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";
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
  const total = lots.reduce((sum, lot) => sum + lotPrice(lot), 0);

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
      setMessage("Sign in to request your order.");
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
          ? `Order requested for ${result.count} lot${result.count === 1 ? "" : "s"} (${formatCurrency(result.total)}).`
          : `Order recorded for ${result.count} lot${result.count === 1 ? "" : "s"} (${formatCurrency(result.total)}).`,
      );
      router.refresh();
    });
  }

  if (lots.length === 0 && !message) {
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
        {lots.map((lot) => (
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
                {lot.location} · {lot.unitCount.toLocaleString()} units
              </p>
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
              {formatCurrency(lotPrice(lot))}
            </p>
          </div>
        ))}
      </div>

      <aside className="h-fit border border-line bg-surface p-5 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Order</p>
        <p className="mt-2 font-display text-3xl font-bold text-ink">{formatCurrency(total)}</p>
        <p className="mt-1 text-sm text-steel">
          {lots.length} lot{lots.length === 1 ? "" : "s"}
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
              {pending ? "Sending…" : "Request order"}
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
              View orders
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-xs text-steel">Email confirmation from Astock ops. No card charge.</p>
        )}
      </aside>
    </div>
  );
}
