import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import type { Lot } from "@/lib/types";
import { formatCondition } from "@/lib/format";
import { lotPrice } from "@/lib/pricing";

/** Canonical production origin for SEO (always palletdealsshop.com). */
export function canonicalOrigin(): string {
  return "https://palletdealsshop.com";
}

export function absoluteUrl(path = "/"): string {
  const origin = canonicalOrigin();
  if (!path || path === "/") return origin;
  return path.startsWith("http") ? path : `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(src: string | undefined | null): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return absoluteUrl(src);
}

const defaultOgImage =
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&h=630&q=80";

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  images?: string[];
  index?: boolean;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const images = (opts.images?.length ? opts.images : [defaultOgImage])
    .map((src) => absoluteImageUrl(src))
    .filter((src): src is string => Boolean(src));
  const index = opts.index !== false;

  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brand.name,
      title: opts.title,
      description: opts.description,
      url,
      images: images.map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images,
    },
  };
}

export function lotDescription(lot: Lot): string {
  const price = lotPrice(lot);
  const grade = formatCondition(lot.condition);
  const bits = [
    `${lot.title} on ${brand.name}.`,
    `${lot.category} ${lot.lotType.toLowerCase()}, ${grade}, fixed price $${price.toLocaleString("en-US")}.`,
    lot.manifestSummary?.slice(0, 140) ||
      "Graded liquidation inventory ready to order at palletdealsshop.com.",
  ];
  return bits.join(" ").replace(/\s+/g, " ").trim().slice(0, 300);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    legalName: brand.legalName,
    url: canonicalOrigin(),
    email: "uncledrewlegacy@gmail.com",
    telephone: "+1-240-400-9904",
    description: brand.description,
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    url: canonicalOrigin(),
    description: brand.description,
    publisher: {
      "@type": "Organization",
      name: brand.name,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${canonicalOrigin()}/browse?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(lot: Lot) {
  const price = lotPrice(lot);
  const images = lot.images
    .map((src) => absoluteImageUrl(src))
    .filter((src): src is string => Boolean(src));
  const availability =
    lot.status === "sold" || lot.unitCount <= 0
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: lot.title,
    description: lotDescription(lot),
    sku: lot.slug,
    category: lot.category,
    image: images.length ? images : [defaultOgImage],
    brand: {
      "@type": "Brand",
      name: brand.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/lots/${lot.slug}`),
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability,
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: brand.name,
      },
    },
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export { defaultOgImage };
