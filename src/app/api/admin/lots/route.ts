import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/http";
import { parseLotFormData } from "@/lib/admin-lot-form";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.redirect(await absoluteUrl("/admin/login"), 303);
  }

  const formData = await request.formData();
  const data = parseLotFormData(formData);

  if (!data.title || !data.slug || !data.location || Number.isNaN(data.endsAt.getTime())) {
    return NextResponse.json({ error: "Missing required lot fields." }, { status: 400 });
  }

  const existing = await prisma.lot.findUnique({ where: { slug: data.slug } });
  const slug = existing ? `${data.slug}-${Date.now().toString(36)}` : data.slug;

  const lot = await prisma.lot.create({
    data: { ...data, slug },
  });

  return NextResponse.redirect(await absoluteUrl(`/admin/lots/${lot.id}/edit`), 303);
}
