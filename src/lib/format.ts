import { lotPrice } from "./pricing";
import type { ConditionGrade, Lot, SortOption } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Relative age from an absolute timestamp; updates as “now” moves. */
export function formatRelativeTime(
  createdAt: string | Date,
  now: Date | number = Date.now(),
): string {
  const then = createdAt instanceof Date ? createdAt.getTime() : new Date(createdAt).getTime();
  if (!Number.isFinite(then)) return "";
  const nowMs = typeof now === "number" ? now : now.getTime();
  const seconds = Math.max(0, Math.floor((nowMs - then) / 1000));

  if (seconds < 45) return "just now";
  if (seconds < 90) return "1 minute ago";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 45) return `${minutes} minutes ago`;
  if (minutes < 90) return "1 hour ago";

  const hours = Math.floor(minutes / 60);
  if (hours < 36) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (hours < 60) return "1 day ago";

  const days = Math.floor(hours / 24);
  if (days < 11) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 18) return "2 weeks ago";

  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (weeks < 12) return "2 months ago";

  const months = Math.floor(days / 30);
  if (months < 18) return `${Math.max(1, months)} month${months === 1 ? "" : "s"} ago`;

  const years = Math.floor(days / 365);
  return `${Math.max(1, years)} year${years === 1 ? "" : "s"} ago`;
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
