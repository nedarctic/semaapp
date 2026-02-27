import { NextResponse } from "next/server";
import { minioClient, ensureBucket } from "@/lib/minio";
import { db } from "@/lib/db";
import { attachments } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const incidentId = formData.get("incidentId") as string;

  if (!file || !incidentId) {
    return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
  }

  const bucket = "uploads";
  await ensureBucket(bucket);

  const buffer = Buffer.from(await file.arrayBuffer());
  await minioClient.putObject(bucket, file.name, buffer);

  const url = `http://localhost:9000/${bucket}/${file.name}`;

  await db.insert(attachments).values({
    incidentId: incidentId,
    fileName: file.name,
    filePath: url,
    uploadedBy: "Reporter",
  });

  return NextResponse.json({ url });
}