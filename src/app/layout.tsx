import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { brand } from "@/lib/brand";
import { absoluteUrl, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Figtree({
  variable: "--font-body-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const homeTitle = `${brand.name} | Liquidation pallets, toys, PS5 Slim, Christmas trees`;

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: homeTitle,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brand.name,
    title: homeTitle,
    description: brand.description,
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: brand.description,
  },
  verification: {
    google: "wOaA-aSovXaGzsQGhl0rhuvTwZzm4dPlOx24g3QfsQw",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
