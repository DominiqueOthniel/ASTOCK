"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AccountMenu({
  email,
  onDark,
}: {
  email: string | null;
  onDark?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    });
  }

  if (!email) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className={`text-sm font-medium ${onDark ? "opacity-80 hover:opacity-100" : "text-ink-soft hover:text-ink"}`}
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className={`btn !min-h-10 !px-4 text-sm ${onDark ? "btn-ghost" : "btn-secondary"}`}
        >
          Join
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/account"
        className={`max-w-[10rem] truncate text-sm font-medium ${onDark ? "opacity-80 hover:opacity-100" : "text-ink-soft hover:text-ink"}`}
        title={email}
      >
        {email}
      </Link>
      <button
        type="button"
        className={`btn !min-h-10 !px-4 text-sm ${onDark ? "btn-ghost" : "btn-secondary"}`}
        onClick={signOut}
        disabled={pending}
      >
        {pending ? "…" : "Sign out"}
      </button>
    </div>
  );
}
