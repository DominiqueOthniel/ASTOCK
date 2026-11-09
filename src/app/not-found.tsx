import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <SiteChrome email={null} cartCount={0}>
      <main className="flex-1">
        <div className="site-grid flex min-h-[60vh] flex-col items-start justify-center pt-24 pb-20">
          <h1 className="font-display text-4xl font-semibold">Lot not found</h1>
          <p className="mt-3 max-w-md text-steel">
            That listing is not in the catalog. Browse open lots to keep going.
          </p>
          <Link href="/browse" className="btn btn-primary mt-8">
            Browse lots
          </Link>
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
