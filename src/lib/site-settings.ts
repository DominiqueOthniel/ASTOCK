import { prisma } from "@/lib/prisma";

export type SiteSettingsData = {
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  addressNote: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
  xUrl: string;
};

/** Canonical public contacts for PalletDealsShop. */
export const canonicalContacts = {
  contactEmail: "uncledrewlegacy@gmail.com",
  contactPhone: "",
  whatsapp: "+12404009904",
  addressNote: "",
  facebookUrl: "https://www.facebook.com/share/1FVCpM6JYi/",
  instagramUrl: "https://www.instagram.com/palletplugdeals",
  tiktokUrl: "https://www.tiktok.com/@palletplugdeals",
  linkedinUrl: "",
  xUrl: "",
} as const;

export const emptySiteSettings: SiteSettingsData = {
  contactEmail: "",
  contactPhone: "",
  whatsapp: "",
  addressNote: "",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  linkedinUrl: "",
  xUrl: "",
};

function asString(value: string | null | undefined) {
  return (value ?? "").trim();
}

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!row) return { ...emptySiteSettings };
  return {
    contactEmail: asString(row.contactEmail),
    contactPhone: asString(row.contactPhone),
    whatsapp: asString(row.whatsapp),
    addressNote: asString(row.addressNote),
    facebookUrl: asString(row.facebookUrl),
    instagramUrl: asString(row.instagramUrl),
    tiktokUrl: asString(row.tiktokUrl),
    linkedinUrl: asString(row.linkedinUrl),
    xUrl: asString(row.xUrl),
  };
}

export async function ensureSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", ...canonicalContacts },
  });
}

export async function applyCanonicalContacts() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: { ...canonicalContacts },
    create: { id: "default", ...canonicalContacts },
  });
}

export function normalizeWhatsApp(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/[^\d+]/g, "");
  if (!digits) return "";
  const number = digits.replace(/^\+/, "");
  return `https://wa.me/${number}`;
}

export function isOptionalHttpUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function publicSocialLinks(settings: SiteSettingsData) {
  const links: { label: string; href: string }[] = [];
  if (settings.facebookUrl) links.push({ label: "Facebook", href: settings.facebookUrl });
  if (settings.instagramUrl) {
    links.push({ label: "@palletplugdeals", href: settings.instagramUrl });
  }
  if (settings.whatsapp) {
    links.push({ label: "WhatsApp", href: normalizeWhatsApp(settings.whatsapp) });
  }
  if (settings.tiktokUrl) links.push({ label: "TikTok", href: settings.tiktokUrl });
  // LinkedIn and X intentionally omitted unless set; canonical contacts leave them blank.
  if (settings.linkedinUrl) links.push({ label: "LinkedIn", href: settings.linkedinUrl });
  if (settings.xUrl) links.push({ label: "X", href: settings.xUrl });
  return links.filter((link) => link.href);
}
