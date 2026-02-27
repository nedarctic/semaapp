import { getCompanyId } from "../../team/page";
import { eq } from "drizzle-orm";
import ReportingPageConfigure from "./ReportingPageConfigureClient";
import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";

export default async function ReportingConfig () {

    // get the company id

    const response = await getCompanyId();
    let companyId = response.data!;

    // fetch the reporting page data related to it
    const reportingPageData = await db.select().from(reportingPages).where(eq(reportingPages.companyId, companyId))

    return <ReportingPageConfigure companyId={companyId} reportingPageData={reportingPageData} />
}