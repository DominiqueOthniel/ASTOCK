import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { absoluteUrl } from "@/lib/http";
import { parseLotFormData } from "@/lib/admin-lot-form";
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
  const existing = await prisma.lot.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Lot not found." }, { status: 404 });
  }

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "save");

  if (intent === "delete") {
    await prisma.lot.delete({ where: { id } });
    return NextResponse.redirect(await absoluteUrl("/admin/lots"), 303);
  }

  if (intent === "publish") {
    await prisma.lot.update({ where: { id }, data: { published: true } });
    return NextResponse.redirect(await absoluteUrl(`/admin/lots/${id}/edit`), 303);
  }

  if (intent === "unpublish") {
    await prisma.lot.update({ where: { id }, data: { published: false } });
    return NextResponse.redirect(await absoluteUrl(`/admin/lots/${id}/edit`), 303);
  }

  const data = parseLotFormData(formData);
  if (!data.title || !data.slug || !data.location || Number.isNaN(data.endsAt.getTime())) {
    return NextResponse.json({ error: "Missing required lot fields." }, { status: 400 });
  }

  const clash = await prisma.lot.findFirst({
    where: { slug: data.slug, NOT: { id } },
  });
  const slug = clash ? `${data.slug}-${Date.now().toString(36)}` : data.slug;

  await prisma.lot.update({
    where: { id },
    data: { ...data, slug },
  });

  return NextResponse.redirect(await absoluteUrl(`/admin/lots/${id}/edit`), 303);
}
