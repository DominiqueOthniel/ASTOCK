import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.redirect(await absoluteUrl("/admin/login"), 303);
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "handled");

  if (intent === "handled") {
    await prisma.sellInquiry.update({
      where: { id },
      data: { handled: true },
    });
  }

  return NextResponse.redirect(await absoluteUrl("/admin/inquiries"), 303);
}
