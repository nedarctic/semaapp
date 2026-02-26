import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const allCategories = await db.select().from(categories);

        return NextResponse.json({ success: true, data: allCategories });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(categories).values({
            categoryName: body.categoryName,
            companyId: body.companyId,
        });

        return NextResponse.json({ success: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" })
    };
}