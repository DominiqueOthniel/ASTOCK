"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { TermsAgree } from "@/components/TermsAgree";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/browse";
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    setError(null);
    setMessage(null);

    if (mode === "signup" && !termsAccepted) {
      setError("Agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      if (mode === "signup") {
        const acceptedAt = new Date().toISOString();
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              terms_accepted_at: acceptedAt,
              privacy_accepted_at: acceptedAt,
            },
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        setMessage("Account created. You can sign in and start bidding.");
        router.push(`/login?next=${encodeURIComponent(next)}`);
        router.refresh();
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
        {pending ? "Working…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
    </form>
  );
}
