import { NextResponse, NextRequest } from "next/server";
import { incidents } from "@/db/schema";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const allIncidents = await db.select().from(incidents);

        return NextResponse.json({ success: true, data: allIncidents });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(incidents).values({
            category: body.category,
            companyId: body.companyId,
            description: body.description,
            incidentDate: body.incidentDate,
            incidentIdDisplay: body.incidentIdDisplay,
            location: body.location,
            reporterId: body.reporterId,
            reporterType: body.reporterType,
            secretCodeHash: body.secretCodeHash,
            status: body.status,
            assignedHandlerId: body.assignedHandlerId,
            closedAt: body.closedAt,
            deadlineAt: body.deadlineAt,
            involvedPeople: body.involvedPeople,
            updatedAt: body.updatedAt,
        });

        return NextResponse.json({ status: true, data: body });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" })
    }
}