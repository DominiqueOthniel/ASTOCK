import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to PalletDeals.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="site-grid flex min-h-[70vh] flex-col justify-center py-14">
      <h1 className="font-display text-4xl font-semibold text-ink">Sign in</h1>
      <p className="mt-2 text-steel">Welcome back.</p>
      <div className="mt-8 max-w-md">
        <Suspense fallback={<p className="text-sm text-steel">Loading…</p>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-steel">
        New here?{" "}
        <Link href="/signup" className="font-medium text-accent-deep hover:underline">
          Join PalletDeals
        </Link>
      </p>
    </div>
  );
}
