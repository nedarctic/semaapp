import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { eq } from "drizzle-orm";

export async function GET () {
    try {
        const data = await db.select().from(reportingPages);

        return NextResponse.json({success: true, data: data});
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Unknown error"});
    }
}

export async function POST (req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(reportingPages).values({
            companyId: body.companyId,
            title: body.title,
            introContent: body.introContent,
            policyUrl: body.policyUrl,
        });

        return NextResponse.json({success: true, data: body});
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Uknknown error"})
    }
}

export async function PUT(req: NextRequest) {
  const { companyId, title, introContent, policyUrl } = await req.json();

  const existing = await db.select().from(reportingPages).where(eq(reportingPages.companyId, companyId));

  if (existing.length === 0) {
    return NextResponse.json({ success: false, error: "No reporting page found for this company" }, { status: 404 });
  }

  await db
    .update(reportingPages)
    .set({ title, introContent, policyUrl })
    .where(eq(reportingPages.companyId, companyId));

  return NextResponse.json({ success: true });
}