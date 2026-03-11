import { FaHome } from "react-icons/fa";
import { getIncidentDetails } from "@/lib/helpers";
import { getHandler } from "@/lib/helpers";
import { db } from "@/lib/db";
import { incidents } from "@/db/schema";
import { getServerSession } from "next-auth";
import { getCompanyId } from "../team/page";
import { eq } from "drizzle-orm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

type Incident = InferSelectModel<typeof incidents>;

export async function getIncidents(companyId: string) {
  const data = await db.select().from(incidents).where(eq(incidents.companyId, companyId));
  return data;
}

export default async function IncidentPage() {

    const data = await getCompanyId();
    const companyId = data.data; 
    const incidents: Incident[] = await getIncidents(companyId!);

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