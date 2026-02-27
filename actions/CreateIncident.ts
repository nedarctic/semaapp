"use server";

import { db } from "@/lib/db";
import {
    incidents,
    reporters,
    attachments,
} from "@/db/schema";
import { minioClient, ensureBucket } from "@/lib/minio";
import { generateIncidentNumber, generateSecretCode } from "@/lib/incident";
import argon2 from "argon2";
import { randomUUID } from "crypto";
import { getCompanyId } from "@/app/(dashboard)/dashboard/team/page";
import { eq } from "drizzle-orm";

const PEPPER = process.env.INCIDENT_SECRET_PEPPER!;

export type CreateIncidentState =
    | { success: false; error?: string }
    | { success: true; incidentNumber: string; secretCode: string };

export async function CreateIncident(
    _prevState: CreateIncidentState,
    formData: FormData
): Promise<CreateIncidentState> {
    try {
        /* -----------------------------
         * Resolve company (server-side)
         * ----------------------------- */
        const response = await getCompanyId();
        const companyId = response?.data;

        if (!companyId) {
            return { success: false, error: "Company not resolved" };
        }

        /* -----------------------------
         * Extract form data
         * ----------------------------- */
        const reporterType = formData.get("reporterType") as
            | "Anonymous"
            | "Confidential";

        const category = formData.get("category") as string;
        const description = formData.get("description") as string;
        const location = formData.get("location") as string;
        const involvedPeople = formData.get("involvedPeople") as string | null;
        const incidentDate = formData.get("incidentDate") as string;

        const name = formData.get("name") as string | null;
        const email = formData.get("email") as string | null;
        const phone = formData.get("phone") as string | null;

        const files = formData.getAll("files") as File[];

        /* -----------------------------
         * Generate identifiers
         * ----------------------------- */
        const incidentId = randomUUID();
        const reporterId = randomUUID();

        const incidentNumber = generateIncidentNumber();
        const secretCode = generateSecretCode();
        const secretCodeHash = await argon2.hash(secretCode + PEPPER);

        /* -----------------------------
         * DB TRANSACTION
         * ----------------------------- */
        await db.transaction(async (tx) => {
            // Reporter (only if confidential)
            if (reporterType === "Confidential") {
                await tx.insert(reporters).values({
                    id: reporterId,
                    name,
                    email,
                    phone,
                    incidentId,
                });
            }

            // Incident
            await tx.insert(incidents).values({
                id: incidentId,
                companyId,
                incidentIdDisplay: incidentNumber,
                category,
                description,
                location,
                involvedPeople,
                incidentDate,
                reporterType,
                reporterId,
                status: "New",
                secretCodeHash,
            });
        });

        /* -----------------------------
         * Upload attachments (outside tx)
         * ----------------------------- */
        if (files.length > 0) {
            const bucket = "uploads";
            await ensureBucket(bucket);

            for (const file of files) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const objectName = `${incidentId}/${file.name}`;

                await minioClient.putObject(bucket, objectName, buffer);

                await db.insert(attachments).values({
                    incidentId,
                    uploadedBy: "Reporter",
                    fileName: file.name,
                    filePath: `/${bucket}/${objectName}`,
                });
            }
        }


        console.log(
            {
                success: true,
                incidentNumber,
                secretCode, // returned ONCE
            }
    );

        return {
            success: true,
            incidentNumber,
            secretCode, // returned ONCE
        };
    } catch (error) {
        console.error("CreateIncident failed:", error);
        return {
            success: false,
            error: "Failed to submit incident. Please try again.",
        };
    }
}