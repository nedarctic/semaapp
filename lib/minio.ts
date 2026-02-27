import { Client } from "minio";

export const minioClient = new Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minio-sema-admin",
  secretKey: "minio-sema-pass123", 
});

export async function ensureBucket(bucket: string) {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) await minioClient.makeBucket(bucket);
}