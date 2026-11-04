import type { ConditionGrade, Lot, SortOption } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCountdown(endsAt: string, now: number): string {
  const diff = new Date(endsAt).getTime() - now;
  if (diff <= 0) return "Ended";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatCondition(condition: ConditionGrade | string): string {
  return ["A", "B", "C"].includes(condition) ? `Grade ${condition}` : condition;
}

export function sortLots(list: Lot[], sort: SortOption): Lot[] {
  const next = [...list];
  switch (sort) {
    case "bid-high":
      return next.sort((a, b) => b.currentBid - a.currentBid);
    case "bid-low":
      return next.sort((a, b) => a.currentBid - b.currentBid);
    case "retail":
      return next.sort((a, b) => b.estimatedRetail - a.estimatedRetail);
    case "newest":
      return next.sort((a, b) => b.id.localeCompare(a.id));
    case "ending":
    default:
      return next.sort(
        (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
      );
  }
}
