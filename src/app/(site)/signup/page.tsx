import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Join",
  description: "Create an Astock account with email and password.",
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="site-grid flex min-h-[70vh] flex-col justify-center pt-28 pb-20">
      <h1 className="font-display text-4xl font-semibold text-ink">Join Astock</h1>
      <p className="mt-3 max-w-md text-steel">Email and password. Start ordering right away.</p>
      <div className="mt-8 max-w-md">
        <Suspense fallback={<p className="text-sm text-steel">Loading…</p>}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
      <p className="mt-6 text-sm text-steel">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-accent-deep hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
