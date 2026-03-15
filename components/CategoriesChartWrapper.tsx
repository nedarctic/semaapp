import { CategoriesChart } from "@/components/CategoriesChart";
import { getClosedIncidentsByCategories } from "@/lib/helpers";
import { closedIncidentsByCategories } from "./IncidentTrendsChartWrapper";
import { getCompanyId } from "@/app/(dashboard)/dashboard/team/page";

export async function CategoriesChartWrapper () {

    const res = await getCompanyId();
    const companyId = res.data;

    const closed_incidents_by_categories = await closedIncidentsByCategories(companyId!);

    if (!closed_incidents_by_categories.length) return <p className="text-sm font-bold text-black dark:text-white mt-2">No incidents yet.</p>;

    return <CategoriesChart data={closed_incidents_by_categories} />
}