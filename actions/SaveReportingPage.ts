"use server";

import { db } from "@/lib/db";
import { reportingPages, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { promise } from "zod";

export async function saveReportingPage(
  companyId: string,
  title: string,
  introContent: string,
  policyUrl: string,
  reportingPageUrl: string,
  category: string
) {
  // Check if page already exists
  const existing = await db
    .select()
    .from(reportingPages)
    .where(eq(reportingPages.companyId, companyId));

  // get categories
  const categoryNames = await db
    .select()
    .from(categories)
    .where(eq(categories.companyId, companyId))
    .then(res => res.map(res => res.categoryName));

  const isCategoryExisting = categoryNames.includes(category);

  if (!isCategoryExisting) {

  }

  if (existing.length > 0 && isCategoryExisting) {
    // Update existing page and category

    await Promise.all([
      await db
        .update(reportingPages)
        .set({ title, introContent, policyUrl, reportingPageUrl })
        .where(eq(reportingPages.companyId, companyId)),

      await db.update(categories).set({
        companyId,
        categoryName: category
      }).where(eq(categories.companyId, companyId)),
    ]);

    return { updated: true };

  } else {
    // Insert new page
    await Promise.all([
      await db
        .insert(reportingPages)
        .values({
          companyId,
          title,
          introContent,
          policyUrl,
          reportingPageUrl
        }),
        
      await db
        .insert(categories)
        .values({
          companyId,
          categoryName: category
        })
    ])

    return { inserted: true };
  }
}