import { IncidentTrendsChart } from "./IncidentTrendsChart";
import { getClosedIncidentsByCategoriesForVariableDays, getClosedIncidentsByCategories } from "@/lib/helpers";
import { incidents } from "@/db/schema";
import { db } from "@/lib/db";
import { getCompanyId } from "@/app/(dashboard)/dashboard/team/page";
import { eq } from "drizzle-orm";


export async function getCategories(companyId: string) {
    
    const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
    const categories: string[] = [];
    data.forEach(({ category }) => {
        if (!categories.includes(category)) {
            categories.push(category)
        }
    });
    return categories;
}

export async function closedIncidentsByCategories(companyId: string) {

    const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
    const categories = await getCategories(companyId);

    // initialize array with objects for each category
    const incidents_closed_per_category = categories.map((cat) => ({
        category: cat,
        total_category_incidents: 0,
        total_category_closed_incidents: 0,
    }));

    // create a map for quick lookup by category
    const categoryMap = new Map(
        incidents_closed_per_category.map((item) => [item.category, item])
    );

    // count incidents
    data.forEach(({ category, closedAt }) => {
        const record = categoryMap.get(category);
        if (record) {
            record.total_category_incidents++;
            if (closedAt !== null) {
                record.total_category_closed_incidents++;
            }
        } else {
            // optional: handle new category not in your list
            incidents_closed_per_category.push({
                category,
                total_category_incidents: 1,
                total_category_closed_incidents: closedAt ? 1 : 0,
            });
        }
    });

    return incidents_closed_per_category;
}

export async function closedIncidentsByCategoriesForVariableDays(companyId: string, days: number) {
    
    const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
    const categories = await getCategories(companyId);

    // initialize array with objects for each category
    const incidents_closed_per_category = categories.map((cat) => ({
        category: cat,
        total_category_incidents: 0,
        total_category_closed_incidents: 0,
    }));

    // create a map for quick lookup by category
    const categoryMap = new Map(
        incidents_closed_per_category.map((item) => [item.category, item])
    );

    // incidents created in the past week
    const past_week_incidents = data.filter(({ createdAt }) => {
        const now = Date.now();
        const limit = days * 60 * 60 * 1000;
        const created = new Date(createdAt).getTime();

        return (now - created) < limit
    })

    // count incidents
    past_week_incidents.forEach(({ category, closedAt }) => {
        const record = categoryMap.get(category);
        if (record) {
            record.total_category_incidents++;
            if (closedAt !== null) {
                record.total_category_closed_incidents++;
            }
        } else {
            // optional: handle new category not in your list
            incidents_closed_per_category.push({
                category,
                total_category_incidents: 1,
                total_category_closed_incidents: closedAt ? 1 : 0,
            });
        }
    });

    return incidents_closed_per_category;
}


export async function IncidentTrendsChartWrapper() {

    const res = await getCompanyId();
    const companyId = res.data;

    const all_time_incidents = await closedIncidentsByCategories(companyId!);
    const past_week_incidents = await closedIncidentsByCategoriesForVariableDays(companyId!, 7);
    const past_month_incidents = await closedIncidentsByCategoriesForVariableDays(companyId!, 30);
    const past_six_months_incidents = await closedIncidentsByCategoriesForVariableDays(companyId!, 180);

    if (!all_time_incidents.length) return <p className="text-sm font-bold text-black dark:text-white mt-2">No incidents yet.</p>;

    return (
        <IncidentTrendsChart all_time_incidents={all_time_incidents} past_week_incidents={past_week_incidents} past_month_incidents={past_month_incidents} past_six_months_incidents={past_six_months_incidents} />
    );
}