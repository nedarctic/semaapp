import { db } from "@/lib/db";
import { reporters } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await db.select().from(reporters);

        return NextResponse.json({ success: true, data: data });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(reporters).values({
            incidentId: body.incidentId,
            email: body.email,
            name: body.name,
            phone: body.phone,
        });

        return NextResponse.json({ success: true, data: "Reporter created successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}