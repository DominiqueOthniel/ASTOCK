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
  slug: string;
  title: string;
  category: Category;
  condition: ConditionGrade;
  lotType: LotType;
  saleType: SaleType;
  currentBid: number;
  buyNowPrice?: number;
  startingBid: number;
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
  published?: boolean;
  status?: "open" | "sold" | "ended";
  soldAt?: string;
}

export type SortOption = "ending" | "bid-high" | "bid-low" | "retail" | "newest";

export type DashboardCounts = {
  publishedLots: number;
  draftLots: number;
  openInquiries: number;
  totalLots: number;
};
