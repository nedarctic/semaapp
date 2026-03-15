import { FaHome } from "react-icons/fa";

import { StatusChart } from "@/components/StatusChart";
import { KpiCard } from "@/components/KpiCard";
import { IncidentTrendsChartWrapper } from "@/components/IncidentTrendsChartWrapper";
import { CategoriesChartWrapper } from "@/components/CategoriesChartWrapper"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { db } from "@/lib/db";
import { incidents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCompanyId } from "./team/page";
import { getIncidents } from "./incidents/page";
import { getHandlerDetails } from "./team/[id]/page";
import { getTeamHandlersIncidentsWithDetails } from "./team/page";

export async function totalIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  return data.length;
}

export async function totalOpenIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  const openIncidents = data.filter((incident) => incident.status !== "Closed");
  return openIncidents.length;
}

export async function totalOverdueIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  const overdueIncidents = data.filter((incident) => {
    return new Date(incident.deadlineAt!).getTime() < Date.now()
  })
  return overdueIncidents.length;
}

export async function totalIncidentsDueSoon(companyId: string, days: number) {

  let now = Date.now();
  const limit = now + days * 24 * 60 * 60 * 1000;

  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  
  const incidentsDueSoon = data.filter(({ deadlineAt }) => {
    const deadline = new Date(deadlineAt!).getTime();
    return deadline > now && deadline < limit;
  });

  return incidentsDueSoon.length;
}

export async function SLACompaliance(companyId: string) {

  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  // get closed incidents
  const closed = data.filter(({ closedAt }) => closedAt !== null);

  if (closed.length === 0) return 0;

  // filter those that were closed before deadline
  const within_SLA = closed.filter(({ deadlineAt, closedAt }) => {
    const deadline = new Date(deadlineAt!).getTime();
    const closed = new Date(closedAt!).getTime();
    return closed <= deadline;
  }).length;

  // return percentage of SLA compliance
  return Math.round((within_SLA / data.length) * 100);
}

export async function unassignedIncidents(companyId: string) {

  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));

  return Array.from(data.filter(({ assignedHandlerId }) => {
    return assignedHandlerId === null;
  }));
}

export async function incidentsDueSoon(companyId: string, days: number) {

  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));

  return Array.from(data.filter(({ deadlineAt }) => {
    const deadline = new Date(deadlineAt!).getTime();
    const now = Date.now();
    const limit = Date.now() * days * 24 * 60 * 60 * 1000;
    return deadline > now && limit > deadline;
  }));
}

export async function overdueIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  const overdueIncidents = data.filter((incident) => {
    return new Date(incident.deadlineAt!).getTime() < Date.now()
  })
  return overdueIncidents;
}

export async function chartData(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));

  if (data.length) {
    return data.reduce((acc, incident) => {
      acc[incident.status]++;
      return acc;
    }, {
      New: 0,
      "In Review": 0,
      Investigation: 0,
      Resolved: 0,
      Closed: 0,
    } as Record<string, number>);
  } else {
    return null
  }
}

export async function handlersDetails(companyId: string) {
  const handlers = await db
    .select()
    .from(users)
    .where(eq(users.companyId, companyId))
    .then(res => res.filter(user => user.role == "Handler"));

  const results = await Promise.all(
    handlers.map(h => getHandlerDetails(h.id))
  );

  return results.filter(Boolean);
}

export async function avgResolutionTime(companyId: string): Promise<number> {

  const incidents = await getIncidents(companyId);

  // get closed incidents
  const closed = incidents.filter(({ closedAt }) => closedAt !== null);

  if (closed.length === 0) return 0;

  // get time taken to resolve all incidents
  const total_resoulution_time = closed.reduce((sum, incident) => {
    const created = new Date(incident.createdAt).getTime();
    const closed = new Date(incident.closedAt!).getTime();
    return sum + (closed - created);
  }, 0);

  // divide total resolution time by total resolved cases
  const total_avg_microsecs = total_resoulution_time / closed.length;

  // convert to days and round
  return Math.round(total_avg_microsecs / (1000 * 60 * 60 * 24));

}


export default async function Home() {

  const session = await getServerSession(authOptions);
  console.log("Session:", session)

  // if(!session || session.type !== "admin"){
  //   redirect("/signin");
  // }

  // console.log("Admin session details:", session)

  const companyId = await getCompanyId();

  const total_incidents = await totalIncidents(companyId?.data!);
  const avg_resolution_time = await avgResolutionTime(companyId?.data!);
  const total_incidents_due_soon = await totalIncidentsDueSoon(companyId?.data!, 3);
  const total_open_incidents = await totalOpenIncidents(companyId?.data!);
  const total_overdue_incidents = await totalOverdueIncidents(companyId?.data!);
  const sla_compliance = await SLACompaliance(companyId?.data!);
  const chart_data = await chartData(companyId?.data!);
  const unassigned_incidents = await unassignedIncidents(companyId?.data!);
  const incidents_due_soon = await incidentsDueSoon(companyId?.data!, 3);
  const overdue_incidents = await overdueIncidents(companyId?.data!);

  const handlers_details = await getTeamHandlersIncidentsWithDetails();

  const handlers = [];

  for (const [id, handler] of handlers_details!) {
    handlers.push(handler);
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black p-10">
      <main className="flex min-h-screen w-full flex-col items-start justify-start bg-white dark:bg-black sm:items-start">

        <section>
          {/* page title */}
          <p className="text-4xl font-extrabold">Dashboard</p>

          {/* breadcrumb */}
          <div className="flex items-center py-4">
            <FaHome size={20} className="text-gray-400 mr-2" /><p className="text-gray-400 text-xl"> / Home</p>
          </div>

          {/* KPI CARDS */}
          <KpiCard
            total_incidents={total_incidents}
            total_open_incidents={total_open_incidents}
            total_overdue_incidents={total_overdue_incidents}
            total_incidents_due_soon={total_incidents_due_soon!}
            avg_resolution_time={avg_resolution_time}
            sla_compliance={sla_compliance}
          />
        </section>

        {/* STATUS BREAKDOWN */}
        {total_incidents ? (<section className="w-full">

          {/* stacked bar chart showing: new, in review, investigation, resolved, closed */}
          {/* under the chart, clickable legend that filters list */}

          <h1 className="text-black dark:text-white text-3xl font-extrabold mt-20">Status Breakdown</h1>

          {chart_data ? (<StatusChart data={chart_data} />) : (<p className="text-sm font-bold text-black dark:text-white">No incidents yet.</p>)}
        </section>) : (<p className="text-sm font-bold text-black dark:text-white mt-4 text-center">The company has no incidents yet.</p>)}

        {/* URGENT CASES LIST */}

        {total_incidents ? (<section className="w-full">
          {/* Needs attention panel - short list max 5-7 of: overdue incidents, due soon, unassigned incidents */}
          {/* each row: incident id, category, status, deadline (with overview by x days), assigned handler (or "Unassigned"), quick action - assign handler, open incident  */}

          <h1 className="text-black text-3xl font-extrabold mt-10">Urgent cases: Needs attention panel</h1>

          <h1 className="text-red-500 text-2xl font-extrabold mt-4">Overdue incidents</h1>

          {overdue_incidents.length ? (<table className="w-full mt-5 border border-white">
            <thead>
              <tr>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Incident ID</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Assigned Handler</th>
              </tr>
            </thead>
            <tbody>
              {overdue_incidents.map(({ id, category, status, deadlineAt, assignedHandlerId, incidentIdDisplay }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incidentIdDisplay}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadlineAt!))}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{assignedHandlerId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (<p className="text-sm font-bold text-black dark:text-white">No incidents yet.</p>)}

          <h1 className="text-red-500 text-2xl font-extrabold mt-10">Incidents due in 3 days</h1>

          {incidents_due_soon.length ? (<table className="w-full mt-5 border border-white">
            <thead>
              <tr>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Incident ID</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Assigned Handler</th>
              </tr>
            </thead>
            <tbody>
              {incidents_due_soon.map(({ id, category, status, deadlineAt, assignedHandlerId, incidentIdDisplay }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incidentIdDisplay}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadlineAt!))}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{assignedHandlerId}</td>
                </tr>
              ))}
            </tbody>
          </table>) : (<p className="text-sm font-bold text-black dark:text-white">No incidents yet.</p>)}

          <h1 className="text-red-500 text-2xl font-extrabold mt-10">Unassigned incidents</h1>

          {unassigned_incidents.length ? (<table className="w-full mt-5 border border-white">
            <thead>
              <tr>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Incident ID</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {unassigned_incidents.map(({ id, category, status, deadlineAt, incidentIdDisplay }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incidentIdDisplay}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadlineAt!))}</td>
                </tr>
              ))}
            </tbody>
          </table>) : (<p className="text-sm font-bold text-black dark:text-white">No incidents yet.</p>)}

        </section>) : ''}


        {/* INCIDENT TRENDS */}
        {total_incidents ? (<section className="w-full">
          {/* simple bar chart showing incidents created over time */}
          {/* toggle last 6 days, last 30 days, last 6 months */}
          {/* overlay of closed incidents line for throughput comparison */}
          <h1 className="text-black dark:text-white text-3xl font-extrabold mt-10 mb-4">Incident trends</h1>
          <h1 className="text-black dark:text-white text-2xl font-extrabold mt-4">Throughput (total against closed ones)</h1>
          <IncidentTrendsChartWrapper />

          {/* CATEGORY DISTRIBUTION */}

          {/* a compact chart showing incidents by category - corruption, bribery, etc */}
          <h1 className="text-black dark:text-white text-2xl font-extrabold mt-8">Category distribution</h1>
          <CategoriesChartWrapper />

        </section>) : ''}

        {/* TEAM WORKLOAD */}
        {total_incidents ? (<section className="w-full">

          {/* table showing: handler name, open incidents assigned, overdue incidents, avg resolution time */}
          {/* admin should be able to click handler and show filtered incident list  */}

          <h1 className="text-black dark:text-white text-3xl font-extrabold mt-10 mb-4">
            Handler workload & performance
          </h1>

          {handlers.length ? (<table className="w-full mt-5 border border-white">
            <thead>
              <tr>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                  Handler
                </th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                  Total Assigned
                </th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                  Open Incidents
                </th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                  Overdue
                </th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                  Avg Resolution (days)
                </th>
              </tr>
            </thead>

            <tbody>
              {handlers.map(handler => (
                <tr key={handler!.id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.name}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.totalAssignedIncidents}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.totalOpenIncidents}
                  </td>

                  <td
                    className={`hover:border-white border border-black dark:border-white text-md px-4 py-2 text-sm ${handler!.overdueIncidents > 0
                      ? "text-red-600 font-bold hover:bg-red-600 hover:text-white"
                      : "text-black dark:text-white hover:bg-black hover:text-white"
                      }`}
                  >
                    {handler!.overdueIncidents}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white text-sm border border-black dark:border-white text-black dark:text-white text-md px-4 py-2">
                    {handler!.avgResolutionTime > 0
                      ? `${handler!.avgResolutionTime} days`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>) : (<p className="text-sm font-bold text-black dark:text-white">No handlers yet. Go to team to create new members.</p>)}


        </section>) : ''}



        {/* RECENT ACTIVITY FEED */}

        {/* a chronological feed: deadline updated, INC-003 assigned to Jane Doe, Status changed from investigation - resolved, new message from reporter INC-003 */}

        {/* REPORTING LINK HEALTH */}

        {/* small panel showing: company reporting link, status: "Active", last incident submitted: 2 days ago */}

        {/* IF NO INCIDENTS YET, SHOW: No reports submitted yet, reporting link, encourage sharing internally */}

        {/* IF INCIDENTS EXIST BUT NONE URGENT: All incidents within SLA! 🎉 */}

      </main>
    </div>
  );
}