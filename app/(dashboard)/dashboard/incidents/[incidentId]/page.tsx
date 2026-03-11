import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { incidents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { IncidentCard } from "@/components/IncidentCard";
import { getUnassignedHandlers } from "../../team/[id]/[incidents]/page";

export async function getIncidentDetails(incidentId: string) {
  const incident = await db
    .select()
    .from(incidents)
    .where(eq(incidents.id, incidentId))
    .then((res) => res[0]);

  return incident;
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ incidentId: string }>;
}) {
  const { incidentId } = await params;
  const incident = await getIncidentDetails(incidentId);

  if (!incidentId || !incident) return notFound();

  const unassignedHandlers = await getUnassignedHandlers();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black font-sans p-10">
      <main className="flex min-h-screen w-full flex-col items-start justify-start bg-white dark:bg-black">

        {/* PAGE HEADER */}

        <section className="w-full">

          <p className="text-4xl font-extrabold">
            Incident {incident.incidentIdDisplay}
          </p>

          <div className="flex items-center py-4">
            <FaHome size={20} className="text-gray-400 mr-2" />
            <Link href="/dashboard" className="text-gray-400 text-xl">
              / Dashboard
            </Link>
            <p className="text-gray-400 text-xl"> / Incident</p>
          </div>

        </section>

        {/* INCIDENT SUMMARY */}

        <section className="w-full mt-10">

          <h1 className="text-black dark:text-white text-3xl font-extrabold mb-4">
            Incident summary
          </h1>

          <table className="w-full border border-white">
            <tbody>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Category
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.category}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Status
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.status}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Location
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.location}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Incident date
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.incidentDate}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Reporter type
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.reporterType}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Assigned handler
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.assignedHandlerId ?? "Unassigned"}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Deadline
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {incident.deadlineAt
                    ? new Intl.DateTimeFormat("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }).format(new Date(incident.deadlineAt))
                    : "—"}
                </td>
              </tr>

              <tr>
                <td className="border border-black dark:border-white px-4 py-3 font-bold">
                  Submitted
                </td>
                <td className="border border-black dark:border-white px-4 py-3">
                  {new Intl.DateTimeFormat("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  }).format(new Date(incident.createdAt))}
                </td>
              </tr>

            </tbody>
          </table>
        </section>

        {/* INCIDENT DESCRIPTION */}

        <section className="w-full mt-12">

          <h1 className="text-black dark:text-white text-3xl font-extrabold mb-4">
            Description
          </h1>

          <div className="border border-black dark:border-white px-6 py-6 text-black dark:text-white leading-relaxed">
            {incident.description}
          </div>

        </section>

        {/* INVOLVED PEOPLE */}

        {incident.involvedPeople && (
          <section className="w-full mt-12">

            <h1 className="text-black dark:text-white text-3xl font-extrabold mb-4">
              Involved people
            </h1>

            <div className="border border-black dark:border-white px-6 py-6 text-black dark:text-white leading-relaxed">
              {incident.involvedPeople}
            </div>

          </section>
        )}

        {/* INVESTIGATION ACTIONS */}

        <section className="w-full mt-16">

        <IncidentCard incident={incident} unassignedHandlers={unassignedHandlers} />

        </section>

      </main>
    </div>
  );
}