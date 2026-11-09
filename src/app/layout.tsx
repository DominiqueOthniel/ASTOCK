import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { brand } from "@/lib/brand";
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

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} | Bulk liquidation marketplace`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  applicationName: brand.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brand.name,
    title: `${brand.name} | Bulk liquidation marketplace`,
    description: brand.description,
    url: brand.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | Bulk liquidation marketplace`,
    description: brand.description,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
