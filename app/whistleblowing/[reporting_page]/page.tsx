import ReportClient from "./ReportClient";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";

type ReportingPageDetails = InferSelectModel<typeof reportingPages>;

type ReportingPageReturnType = {
    success?: boolean;
    error?: string;
    data?: ReportingPageDetails;
} | null;

export async function getReportingPageData(reporting_page: string): Promise<ReportingPageReturnType> {
    try {
        const data = await db.select().from(reportingPages).where(eq(reportingPages.reportingPageUrl, reporting_page)).then(res => res[0]);
        if (data) return { success: true, data: data }
        return null;

    } catch (error) {
        return { error: error instanceof Error ? error.message : "Unknown error" }
    }
}

export default async function ({ params }: { params: Promise<{ reporting_page: string }> }) {
    ;

    const { reporting_page } = await params;

    const res = await getReportingPageData(reporting_page);

    if (!res?.data) return notFound();

    console.log("Reporting page result:", res);

    const {
        companyId,
        title,
        introContent,
        policyUrl,
        reportingPageUrl
     } = res.data;

    return (
        <ReportClient
            companyId={companyId}
            title={title}
            introContent={introContent}
            policyUrl={policyUrl}
            reportingPageUrl={reportingPageUrl}
            reportingPageLink={reporting_page}
        />
    );
}