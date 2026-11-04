import { compare } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

export const ADMIN_COOKIE_NAME = "astock_admin_session";

const SESSION_TTL = "7d";

type AdminSession = {
  id: string;
  email: string;
};

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

function cookieSecure() {
  return process.env.COOKIE_SECURE === "true";
}

export async function createSessionToken(user: {
  id: string;
  email: string;
}): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(sessionSecret());
}

export function applySessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: cookieSecure(),
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<{ id: string; email: string } | null> {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, email: user.email };
}

async function readTokenFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(ADMIN_COOKIE_NAME.length + 1));
}

async function verifyToken(token: string | undefined | null) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret());
    const email = typeof payload.email === "string" ? payload.email : null;
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    if (!email || !sub) return null;
    return { id: sub, email } satisfies AdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(request?: Request) {
  const cookieStore = await cookies();
  let token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    const headerStore = request ? null : await headers();
    const cookieHeader = request
      ? request.headers.get("cookie")
      : headerStore?.get("cookie") ?? null;
    token = (await readTokenFromCookieHeader(cookieHeader)) ?? undefined;
  }

  return verifyToken(token);
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
