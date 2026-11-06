import { lotPrice } from "./pricing";
import type { ConditionGrade, Lot, SortOption } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCondition(condition: ConditionGrade | string): string {
  return ["A", "B", "C"].includes(condition) ? `Grade ${condition}` : condition;
}

export function sortLots(list: Lot[], sort: SortOption): Lot[] {
  const next = [...list];
  switch (sort) {
    case "price-high":
      return next.sort((a, b) => lotPrice(b) - lotPrice(a));
    case "price-low":
      return next.sort((a, b) => lotPrice(a) - lotPrice(b));
    case "retail":
      return next.sort((a, b) => b.estimatedRetail - a.estimatedRetail);
    case "newest":
    default:
      return next.sort(
        (a, b) => new Date(b.endsAt).getTime() - new Date(a.endsAt).getTime(),
      );
  }
}
