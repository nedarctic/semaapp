import { CategoriesChart } from "@/components/CategoriesChart";
import { getClosedIncidentsByCategories } from "@/lib/helpers";

export async function CategoriesChartWrapper () {

    const data = await getClosedIncidentsByCategories();

    return <CategoriesChart data={data} />
}