import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET () {
    try {
        const data = await db.select().from(users);

        return NextResponse.json({ success: true, data: data });
    } catch (error) {
        return NextResponse.json({error: error instanceof Error ? error.message : "Unknown error"});
    }
}

export async function POST (req: NextRequest) {
    const body = await req.json();

    try {
        await db.insert(users).values({
            companyId: body.companyId,
            name: body.name,
            email: body.email,
            password: body.password,
            role: body.role,
            status: body.status,
        });

        return NextResponse.json({ success: true, message: "User created successfully" });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
}