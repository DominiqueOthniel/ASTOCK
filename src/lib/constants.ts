import type { Category, ConditionGrade, LotType, SaleType, SortOption } from "./types";

export const categories: Category[] = [
  "Electronics",
  "Apparel",
  "Home Goods",
  "Grocery",
  "Sporting Goods",
  "Toys",
  "Office",
  "Christmas",
  "Tools",
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

export const saleTypes: SaleType[] = ["Buy Now"];

export const sortLabels: Record<SortOption, string> = {
  newest: "Newest",
  "price-high": "Price: high to low",
  "price-low": "Price: low to high",
  retail: "Est. retail",
};
