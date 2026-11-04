"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitSellInquiryAction } from "@/app/actions/inquiries";

export function SellForm({ signedIn, defaultEmail }: { signedIn: boolean; defaultEmail?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signedIn) {
      setError("Sign in to submit a seller inquiry.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await submitSellInquiryAction(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="border border-accent-soft bg-white p-6 shadow-[var(--shadow)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Request received</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Thanks for reaching out</h2>
        <p className="mt-3 max-w-xl text-steel leading-relaxed">
          Your seller inquiry is saved. An Astock seller manager will follow up with next steps for manifests, grades, and pickup.
        </p>
        <button type="button" className="btn btn-secondary mt-6" onClick={() => setSubmitted(false)}>
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-line bg-white p-6 shadow-[var(--shadow)] md:p-8"
    >
      {!signedIn ? (
        <p className="border border-line bg-mist/40 px-3 py-2 text-sm text-ink-soft">
          <Link href="/login?next=/sell" className="font-medium text-accent-deep hover:underline">
            Sign in
          </Link>{" "}
          to submit a seller inquiry.
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Company</span>
          <input className="field" name="company" required placeholder="Retailer or brand" disabled={!signedIn} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Contact name</span>
          <input className="field" name="name" required placeholder="Full name" disabled={!signedIn} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Work email</span>
          <input
            className="field"
            type="email"
            name="email"
            required
            defaultValue={defaultEmail ?? ""}
            placeholder="you@company.com"
            disabled={!signedIn}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Phone</span>
          <input className="field" type="tel" name="phone" placeholder="Optional" disabled={!signedIn} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Inventory type</span>
          <select className="field" name="inventory" defaultValue="Customer returns" disabled={!signedIn}>
            <option>Customer returns</option>
            <option>Overstock</option>
            <option>Shelf pulls</option>
            <option>Mixed liquidation</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Primary categories</span>
          <select className="field" name="categories" defaultValue="Electronics" disabled={!signedIn}>
            <option>Electronics</option>
            <option>Apparel</option>
            <option>Home Goods</option>
            <option>Grocery</option>
            <option>Sporting Goods</option>
            <option>Office</option>
            <option>Mixed / multi-category</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Warehouse cities</span>
        <input className="field" name="cities" placeholder="Dallas, Columbus, Reno" disabled={!signedIn} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Approximate monthly volume</span>
        <textarea
          className="field min-h-28"
          name="volume"
          required
          placeholder="Pallets or truckloads per month, lot types, any constraints"
          disabled={!signedIn}
        />
      </label>
      {error ? (
        <p className="border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-ink-soft">{error}</p>
      ) : null}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        {signedIn ? (
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Sending…" : "Request seller intro"}
          </button>
        ) : (
          <Link href="/login?next=/sell" className="btn btn-primary">
            Sign in to continue
          </Link>
        )}
        <p className="text-xs text-steel">We store your inquiry securely for the seller team.</p>
      </div>
    </form>
  );
}
