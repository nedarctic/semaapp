import { db } from "@/lib/db";
import { messages } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET () {
    try {
        const data = await db.select().from(messages);

        return NextResponse.json({ success: true, data: data });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}

export async function POST (req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(messages).values({
            incidentId: body.incidentId,
            senderType: body.senderType,
            content: body.content,
        });

        return NextResponse.json({ success: true, data: "Message sent successfully!" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}