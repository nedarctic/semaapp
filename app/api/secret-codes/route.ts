import { db } from "@/lib/db";
import { secretCodes } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";

export async function GET () {
    try {
        const allSecretCodes = await db.select().from(secretCodes);

        return NextResponse.json({success: true, data: allSecretCodes});
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Unknown error"});
    }
}

export async function POST (req: NextRequest) {

    const body = await req.json();

    try {
        await db.insert(secretCodes).values({
            incidentId: body.incidentId,
            secretCodeHash: body.secretCodeHash,
        });

        return NextResponse.json({success: true, data: body});
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Unknown error"});
    }
}