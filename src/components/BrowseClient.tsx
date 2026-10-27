"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LotListItem } from "@/components/LotListItem";
import { categories, conditionGrades, lotTypes, lots, sortLots } from "@/lib/lots";
import type { SortOption } from "@/lib/types";

const sortLabels: Record<SortOption, string> = {
  ending: "Ending soon",
  "bid-high": "Bid: high to low",
  "bid-low": "Bid: low to high",
  retail: "Est. retail",
  newest: "Newest listed",
};

export function BrowseClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory as (typeof categories)[number])
      ? initialCategory
      : "All",
  );
  const [condition, setCondition] = useState("All");
  const [lotType, setLotType] = useState("All");
  const [endingSoon, setEndingSoon] = useState(false);
  const [sort, setSort] = useState<SortOption>("ending");

  const filtered = useMemo(() => {
    const now = Date.now();
    const list = lots.filter((lot) => {
      const haystack = `${lot.title} ${lot.category} ${lot.location} ${lot.id}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (category !== "All" && lot.category !== category) return false;
      if (condition !== "All" && lot.condition !== condition) return false;
      if (lotType !== "All" && lot.lotType !== lotType) return false;
      if (endingSoon) {
        const hoursLeft = (new Date(lot.endsAt).getTime() - now) / 3600000;
        if (hoursLeft > 24) return false;
      }
      return true;
    });
    return sortLots(list, sort);
  }, [query, category, condition, lotType, endingSoon, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setCondition("All");
    setLotType("All");
    setEndingSoon(false);
    setSort("ending");
  }

  const hasFilters =
    query !== "" ||
    category !== "All" ||
    condition !== "All" ||
    lotType !== "All" ||
    endingSoon;

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <aside className="h-fit border border-line bg-white p-4 shadow-[var(--shadow)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-accent transition-colors hover:text-accent-deep"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink-soft">Search</span>
            <input
              className="field"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title, city, lot id"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink-soft">Category</span>
            <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>All</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink-soft">Condition grade</span>
            <select
              className="field"
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            >
              <option>All</option>
              {conditionGrades.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink-soft">Lot type</span>
            <select className="field" value={lotType} onChange={(event) => setLotType(event.target.value)}>
              <option>All</option>
              {lotTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-ink-soft">
            <input
              type="checkbox"
              checked={endingSoon}
              onChange={(event) => setEndingSoon(event.target.checked)}
              className="size-4 accent-[var(--accent)]"
            />
            Ending within 24 hours
          </label>
        </div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 border-b border-line pb-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-steel">
            {filtered.length} lot{filtered.length === 1 ? "" : "s"}
            {hasFilters ? " matching filters" : " live"}
          </p>
          <label className="flex items-center gap-2 text-sm text-steel">
            <span className="whitespace-nowrap">Sort</span>
            <select
              className="field !min-h-9 !py-1.5"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          {filtered.map((lot) => (
            <LotListItem key={lot.id} lot={lot} />
          ))}
          {filtered.length === 0 ? (
            <div className="border-b border-line py-16 text-center">
              <p className="font-display text-xl font-semibold text-ink">No lots match</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">
                Try clearing filters or searching a different city, category, or lot id. New liquidation lots post throughout the week.
              </p>
              <button type="button" className="btn btn-secondary mt-6" onClick={clearFilters}>
                Reset filters
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
