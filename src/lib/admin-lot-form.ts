import { slugify } from "./lot-mapper";

export type LotFormValues = {
  title: string;
  slug: string;
  category: string;
  condition: string;
  lotType: string;
  saleType: string;
  currentBid: number;
  buyNowPrice: number | null;
  startingBid: number;
  reserveMet: boolean;
  bidCount: number;
  unitCount: number;
  estimatedRetail: number;
  location: string;
  endsAt: Date;
  featured: boolean;
  published: boolean;
  imagesJson: string;
  manifestSummary: string;
  conditionNotes: string;
  sellerNotes: string;
  shipping: string;
  pickup: string;
};

function num(value: FormDataEntryValue | null, fallback = 0) {
  const raw = String(value ?? "").trim();
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "true" || formData.get(key) === "on";
}

export function parseLotFormData(formData: FormData): LotFormValues {
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || title);
  const images = String(formData.get("images") ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const buyNowRaw = String(formData.get("buyNowPrice") ?? "").trim();
  const endsRaw = String(formData.get("endsAt") ?? "");

  return {
    title,
    slug,
    category: String(formData.get("category") ?? "").trim(),
    condition: String(formData.get("condition") ?? "").trim(),
    lotType: String(formData.get("lotType") ?? "").trim(),
    saleType: String(formData.get("saleType") ?? "").trim(),
    currentBid: num(formData.get("currentBid")),
    buyNowPrice: buyNowRaw ? num(formData.get("buyNowPrice")) : null,
    startingBid: num(formData.get("startingBid")),
    reserveMet: bool(formData, "reserveMet"),
    bidCount: Math.max(0, Math.floor(num(formData.get("bidCount")))),
    unitCount: Math.max(1, Math.floor(num(formData.get("unitCount"), 1))),
    estimatedRetail: num(formData.get("estimatedRetail")),
    location: String(formData.get("location") ?? "").trim(),
    endsAt: new Date(endsRaw),
    featured: bool(formData, "featured"),
    published: bool(formData, "published"),
    imagesJson: JSON.stringify(images),
    manifestSummary: String(formData.get("manifestSummary") ?? "").trim(),
    conditionNotes: String(formData.get("conditionNotes") ?? "").trim(),
    sellerNotes: String(formData.get("sellerNotes") ?? "").trim(),
    shipping: String(formData.get("shipping") ?? "").trim(),
    pickup: String(formData.get("pickup") ?? "").trim(),
  };
}
