// app/api/attachments/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { minioClient } from "@/lib/minio";
import { db } from "@/lib/db";
import { attachments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const attachmentId = url.searchParams.get("id");

        if (!attachmentId) {
            return NextResponse.json({ error: "Missing attachment ID" }, { status: 400 });
        }

        // Check user session
        const session = await getServerSession(authOptions);
        console.log("Session", session);

        if (!session) {
            console.log("No session found")
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Lookup attachment
        const [attachment] = await db
            .select()
            .from(attachments)
            .where(eq(attachments.id, attachmentId));


        if (!attachment) {
            console.log("Attachment not found")
            return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
        }

        // Optional: enforce incident access check
        // if (session.incidentId !== attachment.incidentId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // Fetch file from MinIO
        const objectName = attachment.filePath.replace(/^\/uploads\//, "");
        const nodeStream = await minioClient.getObject("uploads", objectName);

        // Convert Node Readable to Web ReadableStream
        const stream = new ReadableStream({
            async start(controller) {
                nodeStream.on("data", (chunk) => controller.enqueue(chunk));
                nodeStream.on("end", () => controller.close());
                nodeStream.on("error", (err) => controller.error(err));
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Disposition": `attachment; filename="${attachment.fileName}"`,
                "Content-Type": "application/octet-stream",
            },
        });
    } catch (err) {
        console.error("Attachment download error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}