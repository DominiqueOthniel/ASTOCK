import type { MetadataRoute } from "next";
import { brand } from "@/lib/brand";
import { listPublishedLots } from "@/lib/lot-service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lots = await listPublishedLots();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: brand.siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${brand.siteUrl}/browse`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${brand.siteUrl}/sell`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${brand.siteUrl}/cart`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.4,
    },
    {
      url: `${brand.siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${brand.siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const lotRoutes = lots.map((lot) => ({
    url: `${brand.siteUrl}/lots/${lot.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...lotRoutes];
}
