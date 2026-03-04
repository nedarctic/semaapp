// import all data and types
import { incidents, users } from "@/lib/data";
import type { Incident, HandlerTeamStats } from "@/lib/types";

// get total incidents
export function getTotalIncidents(): number {
    return incidents.length;
}

// get open incidents
export function getTotalOpenIncidents(): number {
    return incidents.filter(({ status }) => status !== "Closed").length;

}

// get overdue incidents
export function getTotalOverdueIncidents(): number {

    return incidents.filter(({ deadline_at }) => {
        return new Date(deadline_at!).getTime() < Date.now()
    }).length;
}

// get due soon
export function getTotalIncidentsDueSoon(days: number): number {

    let now = Date.now();
    const limit = now + days * 24 * 60 * 60 * 1000;

    return incidents.filter(({ deadline_at }) => {
        const deadline = new Date(deadline_at!).getTime();
        return deadline > now && deadline < limit;
    }).length;
}

// get avg resolution time
export function getAvgResolutionTime(): number {

    // get closed incidents
    const closed = incidents.filter(({ closed_at }) => closed_at !== null);

    if (closed.length === 0) return 0;

    // get time taken to resolve all incidents
    const total_resoulution_time = closed.reduce((sum, incident) => {
        const created = new Date(incident.created_at).getTime();
        const closed = new Date(incident.closed_at!).getTime();
        return sum + (closed - created);
    }, 0);

    // divide total resolution time by total resolved cases
    const total_avg_microsecs = total_resoulution_time / closed.length;

    // convert to days and round
    return Math.round(total_avg_microsecs / (1000 * 60 * 60 * 24));

}

// get SLA complince
export function getSLACompliance(): number {
    // get closed incidents
    const closed = incidents.filter(({ closed_at }) => closed_at !== null);

    if (closed.length === 0) return 0;

    // filter those that were closed before deadline
    const within_SLA = closed.filter(({ deadline_at, closed_at }) => {
        const deadline = new Date(deadline_at!).getTime();
        const closed = new Date(closed_at!).getTime();
        return closed <= deadline;
    }).length;

    // return percentage of SLA compliance
    return Math.round((within_SLA / incidents.length) * 100);
}

// get chart data
export function getChartData() {
    return incidents.reduce((acc, incident) => {
        acc[incident.status]++;
        return acc;
    }, {
        New: 0,
        "In Review": 0,
        Investigation: 0,
        Resolved: 0,
        Closed: 0,
    } as Record<string, number>);
}

// get unassigned incidents
export async function getUnassignedIncidents(): Promise<Incident[]> {
    return Array.from(incidents.filter(({ assigned_handler_user_id }) => {
        return assigned_handler_user_id === null;
    }));
}

// get overdue incidents
export async function getOverdueIncidents(): Promise<Incident[]> {
    return Array.from(incidents.filter(({ deadline_at }) => {
        const deadline = new Date(deadline_at!).getTime();
        const now = Date.now();
        return now > deadline;
    }));
}

// get due soon incidents
export async function getIncidentsDueSoon(days: number): Promise<Incident[]> {
    return Array.from(incidents.filter(({ deadline_at }) => {
        const deadline = new Date(deadline_at!).getTime();
        const now = Date.now();
        const limit = Date.now() * days * 24 * 60 * 60 * 1000;
        return deadline > now && limit > deadline;
    }));
}

// get incidents from the past week
export async function getPastWeekIncidents(): Promise<Incident[]> {
    return incidents.filter(({ created_at }) => {
        const limit = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return (now - new Date(created_at).getTime()) < limit;
    });
}

// get incidents from the past month - 30 days
export async function getPastMonthIncidents(): Promise<Incident[]> {
    return incidents.filter(({ created_at }) => {
        const limit = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now()
        return (now - new Date(created_at).getTime()) < limit;
    });
}

// get incidents from the past six months
export async function getPastSixMonthsIncidents(): Promise<Incident[]> {
    return incidents.filter(({ created_at }) => {
        const limit = 180 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        return (now - new Date(created_at).getTime()) < limit;
    });
}

// get all the categories
export async function getCategories() {
    const categories: string[] = [];
    incidents.forEach(({ category }) => {
        if (!categories.includes(category)) {
            categories.push(category)
        }
    });
    return categories;
}


// get incidents by categories
export async function getIncidentsByCategories() {

    const categories = await getCategories();

    const incidents_per_category: Record<string, number> = {};

    categories.forEach((cat) => {
        incidents_per_category[cat] = 0;
    })

    incidents.forEach(({ category }) => {
        if (incidents_per_category[category] !== undefined) {
            incidents_per_category[category]++;
        } else {
            incidents_per_category[category] = 1;
        }
    });

    return incidents_per_category;
}

// get incidents by categories
export async function getClosedIncidentsByCategories() {
    const categories = await getCategories();

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
    incidents.forEach(({ category, closed_at }) => {
        const record = categoryMap.get(category);
        if (record) {
            record.total_category_incidents++;
            if (closed_at !== null) {
                record.total_category_closed_incidents++;
            }
        } else {
            // optional: handle new category not in your list
            incidents_closed_per_category.push({
                category,
                total_category_incidents: 1,
                total_category_closed_incidents: closed_at ? 1 : 0,
            });
        }
    });

    return incidents_closed_per_category;
}

// get incidents by categories for a filtered period
export async function getClosedIncidentsByCategoriesForVariableDays(days: number) {
    const categories = await getCategories();

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
    const past_week_incidents = incidents.filter(({ created_at }) => {
        const now = Date.now();
        const limit = days * 60 * 60 * 1000;
        const created = new Date(created_at).getTime();

        return (now - created) < limit
    })

    // count incidents
    past_week_incidents.forEach(({ category, closed_at }) => {
        const record = categoryMap.get(category);
        if (record) {
            record.total_category_incidents++;
            if (closed_at !== null) {
                record.total_category_closed_incidents++;
            }
        } else {
            // optional: handle new category not in your list
            incidents_closed_per_category.push({
                category,
                total_category_incidents: 1,
                total_category_closed_incidents: closed_at ? 1 : 0,
            });
        }
    });

    return incidents_closed_per_category;
}

// get handler avg resolution time
export async function getHandlerDetails(id: number) {
    const handler = users.find(u => u.id === id && u.role === "handler");

    if (!handler) return null;

    // incidents assigned to handler
    const incidents_assigned = incidents.filter(
        inc => inc.assigned_handler_user_id === id
    );

    const total_assigned_incidents = incidents_assigned.length;

    // closed incidents
    const closed_incidents = incidents_assigned.filter(
        inc => inc.closed_at !== null
    );

    const total_closed_incidents = closed_incidents.length;

    // average resolution time (days)
    let avg_resolution_time_days = 0;

    if (total_closed_incidents > 0) {
        const total_resolution_time = closed_incidents.reduce((sum, inc) => {
            const created = new Date(inc.created_at).getTime();
            const closed = new Date(inc.closed_at!).getTime();
            return sum + (closed - created);
        }, 0);

        avg_resolution_time_days = Math.round(
            total_resolution_time / total_closed_incidents / (1000 * 60 * 60 * 24)
        );
    }

    // open incidents
    const open_incidents = incidents_assigned.filter(
        inc => inc.closed_at === null
    );

    const total_open_incidents = open_incidents.length;

    // overdue incidents (open + past deadline)
    const now = Date.now();

    const overdue_incidents = open_incidents.filter(inc => {
        if (!inc.deadline_at) return false;
        return now > new Date(inc.deadline_at).getTime();
    });

    const total_overdue_incidents = overdue_incidents.length;

    return {
        handler_id: handler.id,
        handler_name: handler.name,
        total_assigned_incidents,
        total_open_incidents,
        total_overdue_incidents,
        avg_resolution_time_days
    };
}

export async function getAllHandlersDetails() {
    const handlers = users.filter(u => u.role === "handler");

    const results = await Promise.all(
        handlers.map(h => getHandlerDetails(h.id))
    );

    return results.filter(Boolean);
}


export async function getAllHandlersWithDetails(): Promise<HandlerTeamStats[]> {
    const handlers = users.filter(user => user.role === "handler");

    return handlers.map(handler => {
        const assigned = incidents.filter(
            inc => inc.assigned_handler_user_id === handler.id
        );

        const total_assigned_incidents = assigned.length;

        const open_incidents = assigned.filter(
            inc => inc.closed_at === null
        );

        const total_open_incidents = open_incidents.length;

        const overdue_incidents = open_incidents.filter(inc => {
            if (!inc.deadline_at) return false;
            return new Date(inc.deadline_at).getTime() < Date.now();
        });

        const total_overdue_incidents = overdue_incidents.length;

        const closed_incidents = assigned.filter(
            inc => inc.closed_at !== null
        );

        const avg_resolution_time_days =
            closed_incidents.length === 0
                ? null
                : Math.round(
                    closed_incidents.reduce((sum, inc) => {
                        const created = new Date(inc.created_at).getTime();
                        const closed = new Date(inc.closed_at!).getTime();
                        return sum + (closed - created);
                    }, 0) /
                    closed_incidents.length /
                    (1000 * 60 * 60 * 24)
                );

        return {
            handler_id: handler.id,
            name: handler.name,
            email: handler.email,
            total_assigned_incidents,
            total_open_incidents,
            total_overdue_incidents,
            avg_resolution_time_days,
        };
    });
}

// get incident details
export async function getIncidentDetails(): Promise<Incident[]> {
    return incidents;
}

// get assigned handler from id
export async function getHandler(id: number) {
    return users.filter(({ id }) => id === id);
}