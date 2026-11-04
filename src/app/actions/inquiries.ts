"use server";

import { revalidatePath } from "next/cache";
import { notifySellInquiry } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getMarketplaceUser } from "@/lib/supabase/server";

export async function submitSellInquiryAction(formData: FormData) {
  const user = await getMarketplaceUser();
  if (!user?.email) {
    return {
      ok: false as const,
      error: "Sign in to submit a seller inquiry.",
      authRequired: true as const,
    };
  }

  const company = String(formData.get("company") ?? "").trim();
  const contactName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim() || user.email;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const inventoryType = String(formData.get("inventory") ?? "").trim();
  const categories = String(formData.get("categories") ?? "").trim() || null;
  const cities = String(formData.get("cities") ?? "").trim() || null;
  const volume = String(formData.get("volume") ?? "").trim();

  if (!company || !contactName || !email || !inventoryType || !volume) {
    return { ok: false as const, error: "Please fill in the required fields." };
  }

  await prisma.sellInquiry.create({
    data: {
      company,
      contactName,
      email,
      phone,
      inventoryType,
      categories,
      cities,
      volume,
      userId: user.id,
    },
  });

  void notifySellInquiry({ email, company });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true as const };
}
