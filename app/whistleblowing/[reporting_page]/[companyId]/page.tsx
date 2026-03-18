import { NewIncidentReportClient } from "./NewIncidentReportClient";
import { db } from "@/lib/db";
import { categories, reportingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCategories(companyId: string) {
    const res = await db.select().from(categories).where(eq(categories.companyId, companyId));
    return res;
}

export default async function NewReportingPage({ params }: { params: Promise<{ companyId: string }> }) {

    const { companyId } = await params;

    const categories = await getCategories(companyId);

    const reportingLink = await db.select().from(reportingPages).where(eq(reportingPages.companyId, companyId)).then(res => res.map(res => res.reportingPageUrl)).then(res => res[0]);

    return <NewIncidentReportClient reportingLink={reportingLink!} categories={categories} />
}