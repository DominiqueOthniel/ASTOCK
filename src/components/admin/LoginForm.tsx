"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Unable to sign in.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-line bg-white p-6 shadow-[var(--shadow)]">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Email</span>
        <input
          className="field"
          type="email"
          name="email"
          required
          autoComplete="username"
          defaultValue="admin@astock.market"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Password</span>
        <input
          className="field"
          type="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </label>
      {error ? (
        <p className="border border-warn/30 bg-warn/10 px-3 py-2 text-sm text-ink-soft">{error}</p>
      ) : null}
      <button type="submit" className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
