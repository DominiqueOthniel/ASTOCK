/** Public brand for PalletDealsShop (palletdealsshop.com). */
export const brand = {
  name: "PalletDeals",
  legalName: "PalletDealsShop",
  short: "PD",
  domain: "palletdealsshop.com",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://palletdealsshop.com",
  tagline: "Bulk lots, clear prices",
  description:
    "PalletDeals is a fixed-price marketplace for graded liquidation lots: retail returns, overstock, pallets, and truckloads.",
} as const;
