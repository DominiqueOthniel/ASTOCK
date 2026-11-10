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
    "Buy fixed-price liquidation pallets on PalletDeals at palletdealsshop.com: toys pallets, PS5 Slim, Christmas trees, household overstock, and graded retail returns.",
} as const;
