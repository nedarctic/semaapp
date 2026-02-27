import ReportClient from "./ReportClient";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getReportingPageData (reporting_page: string) {
    try {
        const data = await db.select().from(reportingPages).where(eq(reportingPages.reportingPageUrl, reporting_page));
        if (data.length > 0) return {success: true, data: data}
        return null;

    } catch (error) {
        return {error: error instanceof Error ? error.message : "Unknown error"}
    }
}

export default async function ({params}: {params: Promise<{reporting_page: string}>}) {;

    const {reporting_page} = await params;

    const res = await getReportingPageData(reporting_page);
    console.log("Reporting page result:", res);

    if(!res) redirect("https://www.semafacts.com")

    return <ReportClient reportingPageLink={reporting_page}/>
}