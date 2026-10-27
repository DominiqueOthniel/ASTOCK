"use client";

import { useState } from "react";

export function SellForm() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-accent-soft bg-white p-6 shadow-[var(--shadow)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Demo complete</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">Request received</h2>
        <p className="mt-3 max-w-xl text-steel leading-relaxed">
          Thanks. This is a demo form, so nothing was sent. In production, an Astock seller manager would follow up with next steps for manifests, grades, and pickup.
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
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Company</span>
          <input className="field" name="company" required placeholder="Retailer or brand" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Contact name</span>
          <input className="field" name="name" required placeholder="Full name" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Work email</span>
          <input className="field" type="email" name="email" required placeholder="you@company.com" />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Phone</span>
          <input className="field" type="tel" name="phone" placeholder="Optional" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Inventory type</span>
          <select className="field" name="inventory" defaultValue="Customer returns">
            <option>Customer returns</option>
            <option>Overstock</option>
            <option>Shelf pulls</option>
            <option>Mixed liquidation</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Primary categories</span>
          <select className="field" name="categories" defaultValue="Electronics">
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
        <input className="field" name="cities" placeholder="Dallas, Columbus, Reno" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Approximate monthly volume</span>
        <textarea
          className="field min-h-28"
          name="volume"
          required
          placeholder="Pallets or truckloads per month, lot types, any constraints"
        />
      </label>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary">
          Request seller intro
        </button>
        <p className="text-xs text-steel">No payment or account required for this demo.</p>
      </div>
    </form>
  );
}
