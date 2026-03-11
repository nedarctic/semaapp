import { FaHome } from "react-icons/fa";
import {
  getTotalIncidents,
  getAvgResolutionTime,
  getTotalIncidentsDueSoon,
  getTotalOpenIncidents,
  getTotalOverdueIncidents,
  getSLACompliance,
  getChartData,
  getIncidentsDueSoon,
  getOverdueIncidents,
  getUnassignedIncidents,
  getAllHandlersDetails,
} from '@/lib/helpers'
import { StatusChart } from "@/components/StatusChart";
import { KpiCard } from "@/components/KpiCard";
import { IncidentTrendsChartWrapper } from "@/components/IncidentTrendsChartWrapper";
import { CategoriesChartWrapper } from "@/components/CategoriesChartWrapper"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { incidents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCompanyId } from "./team/page";
import { getIncidents } from "./incidents/page";

export async function totalIncidents (companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  return data.length;
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

  if(!session || session.type !== "admin"){
    redirect("/signin");
  }

  console.log("Admin session details:", session)

  const companyId = await getCompanyId();

  const total_incidents = await totalIncidents(companyId?.data!);
  const avg_resolution_time = await avgResolutionTime(companyId?.data!);
  const total_incidents_due_soon = getTotalIncidentsDueSoon(3);
  const total_open_incidents = getTotalOpenIncidents();
  const total_overdue_incidents = getTotalOverdueIncidents();
  const sla_compliance = getSLACompliance();
  const chart_data = getChartData();
  const unassigned_incidents = await getUnassignedIncidents();
  const incidents_due_soon = await getIncidentsDueSoon(3);
  const overdue_incidents = await getOverdueIncidents();

  const handlers_details = await getAllHandlersDetails();


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
            total_incidents_due_soon={total_incidents_due_soon}
            avg_resolution_time={avg_resolution_time}
            sla_compliance={sla_compliance}
          />
        </section>

        {/* STATUS BREAKDOWN */}
        <section className="w-full">

          {/* stacked bar chart showing: new, in review, investigation, resolved, closed */}
          {/* under the chart, clickable legend that filters list */}

          <h1 className="text-black text-3xl font-extrabold mt-20">Status Breakdown</h1>

          <StatusChart data={chart_data} />
        </section>

        {/* URGENT CASES LIST */}

        <section className="w-full">
          {/* Needs attention panel - short list max 5-7 of: overdue incidents, due soon, unassigned incidents */}
          {/* each row: incident id, category, status, deadline (with overview by x days), assigned handler (or "Unassigned"), quick action - assign handler, open incident  */}

          <h1 className="text-black text-3xl font-extrabold mt-10">Urgent cases: Needs attention panel</h1>

          <h1 className="text-red-500 text-2xl font-extrabold mt-4">Overdue incidents</h1>

          <table className="w-full mt-5 border border-white">
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
              {overdue_incidents.map(({ id, category, status, deadline_at, assigned_handler_user_id, incident_id_display }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incident_id_display}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadline_at!))}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{assigned_handler_user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h1 className="text-red-500 text-2xl font-extrabold mt-10">Incidents due in 3 days</h1>

          <table className="w-full mt-5 border border-white">
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
              {incidents_due_soon.map(({ id, category, status, deadline_at, assigned_handler_user_id, incident_id_display }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incident_id_display}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadline_at!))}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{assigned_handler_user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h1 className="text-red-500 text-2xl font-extrabold mt-10">Unassigned incidents</h1>

          <table className="w-full mt-5 border border-white">
            <thead>
              <tr>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Incident ID</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {unassigned_incidents.map(({ id, category, status, deadline_at, incident_id_display }) => (
                <tr key={id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{incident_id_display}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{category}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{status}</td>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">{new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", }).format(new Date(deadline_at!))}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>


        {/* INCIDENT TRENDS */}
        <section className="w-full">
          {/* simple bar chart showing incidents created over time */}
          {/* toggle last 6 days, last 30 days, last 6 months */}
          {/* overlay of closed incidents line for throughput comparison */}
          <h1 className="text-black text-3xl font-extrabold mt-10 mb-4">Incident trends</h1>
          <h1 className="text-black text-2xl font-extrabold mt-4">Throughput (total against closed ones)</h1>
          <IncidentTrendsChartWrapper />

          {/* CATEGORY DISTRIBUTION */}

          {/* a compact chart showing incidents by category - corruption, bribery, etc */}
          <h1 className="text-black text-2xl font-extrabold mt-8">Category distribution</h1>
          <CategoriesChartWrapper />

        </section>

        {/* TEAM WORKLOAD */}
        <section className="w-full">

          {/* table showing: handler name, open incidents assigned, overdue incidents, avg resolution time */}
          {/* admin should be able to click handler and show filtered incident list  */}

          <h1 className="text-black dark:text-white text-3xl font-extrabold mt-10 mb-4">
            Handler workload & performance
          </h1>

          <table className="w-full mt-5 border border-white">
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
              {handlers_details.map(handler => (
                <tr key={handler!.handler_id}>
                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.handler_name}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.total_assigned_incidents}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal flex-1 px-4 py-2">
                    {handler!.total_open_incidents}
                  </td>

                  <td
                    className={`hover:border-white border border-black dark:border-white text-md px-4 py-2 text-sm ${handler!.total_overdue_incidents > 0
                        ? "text-red-600 font-bold hover:bg-red-600 hover:text-white"
                        : "text-black dark:text-white hover:bg-black hover:text-white"
                      }`}
                  >
                    {handler!.total_overdue_incidents}
                  </td>

                  <td className="hover:bg-black hover:text-white hover:border-white text-sm border border-black dark:border-white text-black dark:text-white text-md px-4 py-2">
                    {handler!.avg_resolution_time_days > 0
                      ? `${handler!.avg_resolution_time_days} days`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </section>



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