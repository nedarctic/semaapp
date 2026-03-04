import crypto from 'crypto';
import { minioClient } from "@/lib/minio";

export function hashIncidentSecret(secret: string) {
    return crypto
    .createHmac("sha256", process.env.INCIDENT_SECRET_PEPPER!)
    .update(secret)
    .digest("hex")
};

export async function getPresignedUrl(filePath: string) {
  const url = await minioClient.presignedGetObject("uploads", filePath, 60 * 5); // expires in 5 minutes
  return url;
}