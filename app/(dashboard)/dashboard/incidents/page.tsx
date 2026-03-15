import { FaHome } from "react-icons/fa";
import { getIncidentDetails } from "@/lib/helpers";
import { getHandler } from "@/lib/helpers";
import { db } from "@/lib/db";
import { incidents, reportingPages } from "@/db/schema";
import { getServerSession } from "next-auth";
import { getCompanyId } from "../team/page";
import { eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { BreadCrumb } from "@/components/BreadCrumb";
import { CiLink } from "react-icons/ci";


type Incident = InferSelectModel<typeof incidents>;

export async function getIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  return data;
}

async function getReportingPageUrl(companyId: string) {
  const { reportingPageUrl } = await db
    .select()
    .from(reportingPages)
    .where(
      eq(reportingPages.companyId, companyId)
    ).then(res => res[0])

  return reportingPageUrl;
}

export default async function IncidentPage() {

  const data = await getCompanyId();
  const companyId = data.data;
  const incidents: Incident[] = await getIncidents(companyId!);
  const reportingPageUrl = await getReportingPageUrl(companyId!);

  const crumbs: Map<string, string> = new Map();
  crumbs.set(`/dashboard/incidents`, "Incidents");

  if (!incidents.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
        <main className="flex min-h-screen w-full flex-col items-start justify-start p-10 bg-white dark:bg-black">

          {/* page title */}
          <p className="text-4xl font-extrabold text-black dark:text-white">
            Incidents
          </p>

          {/* breadcrumb */}
          <BreadCrumb crumbs={crumbs} />

          <div className="py-8">
            <p className="text-sm font-bold">No incidents yet.</p>
          </div>

          {!reportingPageUrl && (<div className="py-8">
            <p className="text-sm font-bold">No incidents yet. Begin by creating a reporting link and sharing.</p>
          </div>)}

          {!reportingPageUrl && (<Link href={"/dashboard/reporting/configure"} className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex flex-row items-center justify-center">
            <CiLink size={20} className="text-white dark:text-black mr-2" />Create new reporting link
          </Link>)}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start justify-start p-10 bg-white dark:bg-black sm:items-start">

        {/* page title */}
        <p className="text-4xl font-extrabold">Incidents</p>

        {/* breadcrumb */}
        <div className="flex items-center py-4">
          <FaHome size={20} className="text-gray-400 mr-2" /><p className="text-gray-400 text-xl"> / Incidents</p>
        </div>

        <table className="border border-black">
          <thead>
            <tr>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">ID</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Reporter</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Description</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Location</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Created At</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(({ id, category, companyId, createdAt, reporterType, assignedHandlerId, description, location, status, deadlineAt, closedAt }) => {

              return (
                <tr key={id}>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{id}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{category}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{reporterType}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{description}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{location}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{status}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{deadlineAt ? deadlineAt.toLocaleDateString("en") : ""}</Link></td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm"><Link className="block w-full h-full text-black dark:text-white" href={`/dashboard/incidents/${id}`}>{createdAt.toLocaleDateString("en")}</Link></td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </main>
    </div>
  );
}