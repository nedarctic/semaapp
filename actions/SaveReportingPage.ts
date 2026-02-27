"use server";

import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function saveReportingPage(
  companyId: string,
  title: string,
  introContent: string,
  policyUrl: string,
  reportingPageUrl: string
) {
  // Check if page already exists
  const existing = await db
    .select()
    .from(reportingPages)
    .where(eq(reportingPages.companyId, companyId));

  if (existing.length > 0) {
    // Update existing page
    await db
      .update(reportingPages)
      .set({ title, introContent, policyUrl, reportingPageUrl })
      .where(eq(reportingPages.companyId, companyId));
    return { updated: true };
  } else {
    // Insert new page
    await db.insert(reportingPages).values({ companyId, title, introContent, policyUrl, reportingPageUrl });
    return { inserted: true };
  }
}