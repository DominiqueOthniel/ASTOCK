import { NextResponse } from "next/server";
import {
  createSupabaseServiceClient,
  hasSupabaseServiceRole,
} from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!hasSupabaseServiceRole()) {
    return NextResponse.json(
      { error: "Signup is temporarily unavailable. Try again shortly." },
      { status: 503 },
    );
  }

  let body: { email?: string; password?: string; termsAccepted?: boolean };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Use at least 8 characters for your password." },
      { status: 400 },
    );
  }
  if (!body.termsAccepted) {
    return NextResponse.json(
      { error: "Please agree to the terms to continue." },
      { status: 400 },
    );
  }

  const acceptedAt = new Date().toISOString();
  const admin = createSupabaseServiceClient();

  const created = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      terms_accepted_at: acceptedAt,
      privacy_accepted_at: acceptedAt,
    },
  });

  if (created.error) {
    const message = created.error.message.toLowerCase();
    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      return NextResponse.json(
        { error: "That email already has an account. Sign in instead." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: created.error.message }, { status: 400 });
  }

  if (created.data.user?.id) {
    // Belt and suspenders if project still has Confirm email On.
    await admin.auth.admin.updateUserById(created.data.user.id, {
      email_confirm: true,
    });
  }

  return NextResponse.json({ ok: true });
}
