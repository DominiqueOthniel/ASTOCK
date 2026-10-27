export type Category =
  | "Electronics"
  | "Apparel"
  | "Home Goods"
  | "Grocery"
  | "Sporting Goods"
  | "Toys"
  | "Office"
  | "Mixed Pallets";

export type ConditionGrade = "A" | "B" | "C" | "Customer Returns" | "Shelf Pulls";

export type LotType = "Pallet" | "Truckload" | "Mixed";

export type SaleType = "Auction" | "Buy Now";

export interface Lot {
  id: string;
  title: string;
  category: Category;
  condition: ConditionGrade;
  lotType: LotType;
  saleType: SaleType;
  currentBid: number;
  buyNowPrice?: number;
  reserveMet: boolean;
  bidCount: number;
  unitCount: number;
  estimatedRetail: number;
  location: string;
  endsAt: string;
  images: string[];
  manifestSummary: string;
  conditionNotes: string;
  sellerNotes: string;
  shipping: string;
  pickup: string;
  featured?: boolean;
}

export type SortOption = "ending" | "bid-high" | "bid-low" | "retail" | "newest";
