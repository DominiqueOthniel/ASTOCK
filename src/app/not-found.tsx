import Link from "next/link";

export default function NotFound() {
  return (
    <div className="site-grid flex min-h-[60vh] flex-col items-start justify-center pt-24 pb-20">
      <h1 className="font-display text-4xl font-semibold">Lot not found</h1>
      <p className="mt-3 max-w-md text-steel">
        That listing is not in the demo catalog. Browse open lots to keep going.
      </p>
      <Link href="/browse" className="btn btn-primary mt-8">
        Browse lots
      </Link>
    </div>
  );
}
