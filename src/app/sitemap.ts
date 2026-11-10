import type { MetadataRoute } from "next";
import { categories } from "@/lib/constants";
import { listPublishedLots } from "@/lib/lot-service";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lots = await listPublishedLots();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: absoluteUrl("/browse"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/support"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/sell"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/browse?category=${encodeURIComponent(category)}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.75,
  }));

  const lotRoutes = lots.map((lot) => ({
    url: absoluteUrl(`/lots/${lot.slug}`),
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: lot.featured ? 0.85 : 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...lotRoutes];
}
