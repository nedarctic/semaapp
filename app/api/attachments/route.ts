import { db } from "@/lib/db";
import { attachments } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";

export async function GET () {
    try {
        const allAttachments = await db.select().from(attachments);

        return NextResponse.json({success: true, data: allAttachments});
    } catch (error) {
        return {error: error instanceof Error ? error.message : "Unknown error"};
    }
}

export async function POST (req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(attachments).values({
            fileName: body.fileName,
            filePath: body.filePath,
            incidentId: body.incidentId,
            uploadedBy: body.uploadedBy,
        });

        return NextResponse.json({success: true, data: body});
    } catch (error) {
        return {error: error instanceof Error ? error.message : "Unknown error"}
    }
}