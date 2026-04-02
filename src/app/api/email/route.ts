import { NextRequest, NextResponse } from "next/server";
import { sendEmail, renderTemplate, TEMPLATES } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, templateName, variables, userId } = body;

  if (!to || !templateName) return NextResponse.json({ error: "Missing to or templateName" }, { status: 400 });

  const template = TEMPLATES[templateName as keyof typeof TEMPLATES];
  if (!template) return NextResponse.json({ error: `Unknown template: ${templateName}` }, { status: 400 });

  try {
    const subject = renderTemplate(template.subject, variables ?? {});
    const html = renderTemplate(template.body, variables ?? {});
    const result = await sendEmail({ to, subject, html });

    if (userId) {
      await prisma.emailLog.create({
        data: { userId, to, subject, templateId: templateName, status: "sent", resendId: result?.id ?? null, sentAt: new Date() },
      });
    }

    return NextResponse.json({ success: true, id: result?.id });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const logs = await prisma.emailLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ logs });
}
