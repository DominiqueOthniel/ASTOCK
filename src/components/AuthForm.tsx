"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { TermsAgree } from "@/components/TermsAgree";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/browse";
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setError(null);

    if (mode === "signup" && !termsAccepted) {
      setError("Please agree to the terms to continue.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();

      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, termsAccepted: true }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) {
          setError(data.error ?? "Could not create account.");
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
        router.push(next);
        router.refresh();
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        const message = signInError.message.toLowerCase();
        if (message.includes("confirm") || message.includes("email not confirmed")) {
          setError(
            "Email confirmation is still required in Supabase. Ask an admin to turn Confirm email Off, then try again.",
          );
          return;
        }
        setError(signInError.message);
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-line bg-white p-5 shadow-[var(--shadow)] sm:p-6"
    >
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Email</span>
        <input className="field" type="email" name="email" required autoComplete="email" />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Password</span>
        <input
          className="field"
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      {mode === "signup" ? (
        <TermsAgree checked={termsAccepted} onChange={setTermsAccepted} id="signup-terms" />
      ) : null}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={pending || (mode === "signup" && !termsAccepted)}
      >
        {pending ? "Working…" : mode === "login" ? "Sign in" : "Join Astock"}
      </button>
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {mode === "signup" ? (
        <p className="text-xs leading-relaxed text-steel">
          You are signed in right after joining. No confirmation email needed to browse or order.
        </p>
      ) : (
        <p className="text-xs text-steel">
          Need an account?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="font-medium text-accent-deep hover:underline">
            Join
          </Link>
        </p>
      )}
    </form>
  );
}
