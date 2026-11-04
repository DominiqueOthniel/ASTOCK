import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to bid, buy, and sell on Astock.",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="site-grid flex min-h-[70vh] flex-col justify-center pt-28 pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Sign in</h1>
      <p className="mt-3 max-w-md text-steel">
        Use your Astock account to place bids, buy lots, and submit seller inquiries.
      </p>
      <div className="mt-8 max-w-md">
        <Suspense fallback={<p className="text-sm text-steel">Loading…</p>}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-steel">
        New here?{" "}
        <Link href="/signup" className="font-medium text-accent-deep hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
