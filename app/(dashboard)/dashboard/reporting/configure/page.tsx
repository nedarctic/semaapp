import { getCompanyId } from "../../team/page";
import { eq } from "drizzle-orm";
import ReportingPageConfigure from "./ReportingPageConfigureClient";
import { db } from "@/lib/db";
import { reportingPages, categories } from "@/db/schema";

export default async function ReportingConfig () {

    // get the company id

    const response = await getCompanyId();
    let companyId = response.data!;

    console.log("Company ID:", companyId);

    const categoryNames = await db
    .select()
    .from(categories)
    .where(eq(categories.companyId, companyId));

    // fetch the reporting page data related to it
    const reportingPageData = await db.select().from(reportingPages).where(eq(reportingPages.companyId, companyId))

    return <ReportingPageConfigure categoryNames={categoryNames} companyId={companyId} reportingPageData={reportingPageData} />
}