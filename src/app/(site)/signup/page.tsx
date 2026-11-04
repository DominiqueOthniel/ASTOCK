import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an Astock buyer or seller account.",
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="site-grid flex min-h-[70vh] flex-col justify-center pt-28 pb-20">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-steel">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Create account</h1>
      <p className="mt-3 max-w-md text-steel">
        Register with email and password to bid on auctions and buy listed lots.
      </p>
      <div className="mt-8 max-w-md">
        <Suspense fallback={<p className="text-sm text-steel">Loading…</p>}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-steel">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-accent-deep hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
