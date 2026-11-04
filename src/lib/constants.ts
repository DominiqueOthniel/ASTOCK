import type { Category, ConditionGrade, LotType, SaleType, SortOption } from "./types";

export const categories: Category[] = [
  "Electronics",
  "Apparel",
  "Home Goods",
  "Grocery",
  "Sporting Goods",
  "Toys",
  "Office",
  "Mixed Pallets",
];

export const conditionGrades: ConditionGrade[] = [
  "A",
  "B",
  "C",
  "Customer Returns",
  "Shelf Pulls",
];

export const lotTypes: LotType[] = ["Pallet", "Truckload", "Mixed"];

export const saleTypes: SaleType[] = ["Auction", "Buy Now"];

export const sortLabels: Record<SortOption, string> = {
  ending: "Ending soon",
  "bid-high": "Bid: high to low",
  "bid-low": "Bid: low to high",
  retail: "Est. retail",
  newest: "Newest listed",
};
