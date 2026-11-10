"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LotCard } from "@/components/LotCard";
import { categories, conditionGrades, lotTypes, sortLabels } from "@/lib/constants";
import { sortLots } from "@/lib/format";
import type { Lot, SortOption } from "@/lib/types";

export function BrowseClient({ lots }: { lots: Lot[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const initialQuery = searchParams.get("q")?.trim() ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory as (typeof categories)[number])
      ? initialCategory
      : "All",
  );
  const [condition, setCondition] = useState("All");
  const [lotType, setLotType] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const list = lots.filter((lot) => {
      const haystack = `${lot.title} ${lot.category} ${lot.location} ${lot.slug}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (category !== "All" && lot.category !== category) return false;
      if (condition !== "All" && lot.condition !== condition) return false;
      if (lotType !== "All" && lot.lotType !== lotType) return false;
      return true;
    });
    return sortLots(list, sort);
  }, [lots, query, category, condition, lotType, sort]);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setCondition("All");
    setLotType("All");
    setSort("newest");
  }

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  if (category !== "All") {
    activeChips.push({ key: "category", label: category, clear: () => setCategory("All") });
  }
  if (condition !== "All") {
    activeChips.push({ key: "condition", label: `Grade ${condition}`, clear: () => setCondition("All") });
  }
  if (lotType !== "All") {
    activeChips.push({ key: "lotType", label: lotType, clear: () => setLotType("All") });
  }
  if (query) {
    activeChips.push({
      key: "query",
      label: `Search: ${query}`,
      clear: () => setQuery(""),
    });
  }

  const hasFilters = activeChips.length > 0;

  return (
    <div className="space-y-4">
      <div className="browse-sticky">
        <div className="browse-filter-bar">
          <label className="browse-field browse-field-search">
            <span className="sr-only">Search</span>
            <input
              className="field !min-h-10 !py-1.5"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search lots"
              aria-label="Search lots"
            />
          </label>
          <label className="browse-field">
            <span className="sr-only">Category</span>
            <select
              className="field !min-h-10 !py-1.5"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Category"
            >
              <option value="All">All categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field">
            <span className="sr-only">Condition grade</span>
            <select
              className="field !min-h-10 !py-1.5"
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
              aria-label="Condition grade"
            >
              <option value="All">All grades</option>
              {conditionGrades.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field">
            <span className="sr-only">Lot type</span>
            <select
              className="field !min-h-10 !py-1.5"
              value={lotType}
              onChange={(event) => setLotType(event.target.value)}
              aria-label="Lot type"
            >
              <option value="All">All lot types</option>
              {lotTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field browse-field-sort">
            <span className="sr-only">Sort</span>
            <select
              className="field !min-h-10 !py-1.5"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              aria-label="Sort"
            >
              {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="category-strip scroll-x" role="tablist" aria-label="Category shortcuts">
          <button
            type="button"
            role="tab"
            aria-selected={category === "All"}
            className={`category-chip ${category === "All" ? "is-active" : ""}`}
            onClick={() => setCategory("All")}
          >
            All
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`category-chip ${category === item ? "is-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <p className="text-sm text-steel">
            {filtered.length} lot{filtered.length === 1 ? "" : "s"}
            {hasFilters ? " matching" : " available"}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className="active-filter-chip"
              onClick={chip.clear}
            >
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-accent transition-colors hover:text-accent-deep"
            >
              Clear all
            </button>
          ) : null}
        </div>
      </div>

      <div className="lot-grid">
        {filtered.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line bg-white/70 py-16 text-center">
          <p className="font-display text-xl font-semibold text-ink">No lots match</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-steel">
            Try clearing filters or searching a different city or category.
          </p>
          <button type="button" className="btn btn-secondary mt-6" onClick={clearFilters}>
            Reset filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
