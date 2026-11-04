"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function submitSellInquiryAction(formData: FormData) {
  const company = String(formData.get("company") ?? "").trim();
  const contactName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
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
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
  return { ok: true as const };
}
