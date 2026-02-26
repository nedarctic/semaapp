import { IncidentTrendsChart } from "./IncidentTrendsChart";
import { getClosedIncidentsByCategoriesForVariableDays, getClosedIncidentsByCategories } from "@/lib/helpers";


export async function IncidentTrendsChartWrapper () {

    const all_time_incidents = await getClosedIncidentsByCategories();
    const past_week_incidents = await getClosedIncidentsByCategoriesForVariableDays(7);
    const past_month_incidents = await getClosedIncidentsByCategoriesForVariableDays(30);
    const past_six_months_incidents = await getClosedIncidentsByCategoriesForVariableDays(180);

    return (
        <IncidentTrendsChart all_time_incidents={all_time_incidents} past_week_incidents={past_week_incidents} past_month_incidents={past_month_incidents} past_six_months_incidents={past_six_months_incidents} />
    );
}