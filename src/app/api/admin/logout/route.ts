import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { absoluteUrl } from "@/lib/http";

export async function POST() {
  const response = NextResponse.redirect(await absoluteUrl("/admin/login"), 303);
  return clearSessionCookie(response);
}
