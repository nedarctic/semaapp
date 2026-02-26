import { db } from "@/lib/db";
import { companies } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET () {
    try {
        const allCompanies = await db.select().from(companies);

        return NextResponse.json({success: true, data: allCompanies});
    } catch (error) {
        return {error: error instanceof Error ? error.message : "Unknown error"}
    }
}

export async function POST (req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(companies).values({
            name: body.name,
            reportingLinkSlug: body.reportingLinkSlug,
        });

        return NextResponse.json({success: true, data: body});
    } catch (error) {
        return {error: error instanceof Error ? error.message : "Unknown error"}
    }
}