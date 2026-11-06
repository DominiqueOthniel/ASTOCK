import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isOptionalHttpUrl,
  normalizeWhatsApp,
} from "@/lib/site-settings";

function read(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const form = await request.formData();
  const contactEmail = read(form, "contactEmail");
  const contactPhone = read(form, "contactPhone");
  const whatsappRaw = read(form, "whatsapp");
  const addressNote = read(form, "addressNote");
  const facebookUrl = read(form, "facebookUrl");
  const instagramUrl = read(form, "instagramUrl");
  const tiktokUrl = read(form, "tiktokUrl");
  const linkedinUrl = read(form, "linkedinUrl");
  const xUrl = read(form, "xUrl");

  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return NextResponse.redirect(
      new URL("/admin/settings?error=email", request.url),
    );
  }

  const whatsapp = whatsappRaw ? normalizeWhatsApp(whatsappRaw) : "";
  const urls = [facebookUrl, instagramUrl, tiktokUrl, linkedinUrl, xUrl, whatsapp];
  if (urls.some((value) => value && !isOptionalHttpUrl(value))) {
    return NextResponse.redirect(new URL("/admin/settings?error=url", request.url));
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      whatsapp: whatsapp || null,
      addressNote: addressNote || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      tiktokUrl: tiktokUrl || null,
      linkedinUrl: linkedinUrl || null,
      xUrl: xUrl || null,
    },
    create: {
      id: "default",
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      whatsapp: whatsapp || null,
      addressNote: addressNote || null,
      facebookUrl: facebookUrl || null,
      instagramUrl: instagramUrl || null,
      tiktokUrl: tiktokUrl || null,
      linkedinUrl: linkedinUrl || null,
      xUrl: xUrl || null,
    },
  });

  return NextResponse.redirect(new URL("/admin/settings?saved=1", request.url));
}
