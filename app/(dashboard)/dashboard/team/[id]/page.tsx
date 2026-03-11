import { db } from "@/lib/db";
import { incidents, users } from '@/db/schema'
import { InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { TeamAdminControls } from "@/components/TeamAdminControls";
import { BreadCrumb } from "@/components/BreadCrumb";
import { getCompanyId } from "../page";
import { eq } from "drizzle-orm";

type User = InferSelectModel<typeof users>

export async function getUnassignedIncidents () {
    const companyId = await getCompanyId();
    
    const companyIncidents = await db
    .select()
    .from(incidents)
    .where(eq(incidents.companyId, companyId.data!));

    const unassignedIncidents = companyIncidents.filter(incident => incident.assignedHandlerId === null);

    return unassignedIncidents;
}

export async function getTeamMemberDetails(id: string): Promise<User[] | null> {
    try {
        const teamMember = await await db.select().from(users).where(eq(users.id, id))
        return teamMember;
    } catch (error) {
        return null;
    }
}

export async function getHandlerDetails(id: string): Promise<{
    totalAssignedIncidents: number;
    totalOpenIncidents: number;
    totalOverdueIncidents: number;
    avgResolutionTime: number;
} | null> {

    try {
        const handlerIncidents = await db.select()
            .from(incidents)
            .where(eq(incidents.assignedHandlerId, id));

        const totalAssignedIncidents = handlerIncidents.length;
        let totalOpenIncidents = 0;
        let totalOverdueIncidents = 0;

        // increment total open incidents
        for (const incident of handlerIncidents) {
            if (incident.status !== "Closed") {
                totalOpenIncidents++;
            }
        }

        // increment total overdue incidents
        for (const incident of handlerIncidents) {
            if (incident.deadlineAt) {
                if (Date.now() < new Date(incident.deadlineAt).getTime()) {
                    totalOverdueIncidents++;
                }
            }
        }

        // get avg incident resolution time
        const totalTime = handlerIncidents.reduce((sum, incident) => {

            if (incident.closedAt) {
                const opened = new Date(incident.createdAt).getTime();
                const closed = new Date(incident.closedAt).getTime();
                return sum + (closed - opened);
            }

            return sum;

        }, 0);

        const closedIncidents = handlerIncidents.filter(incident => incident.closedAt)

        const timePerIncident = totalTime / closedIncidents.length;
        const avgResolutionTime = Math.round((timePerIncident / (1000 * 60 * 60 * 24)))

        return {
            totalAssignedIncidents,
            totalOpenIncidents,
            totalOverdueIncidents,
            avgResolutionTime: Number.isNaN(avgResolutionTime) ? 0 : avgResolutionTime,
        }
    } catch (error) {
        return null;
    }
}

export default async function TeamMember({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const teamMember = await getTeamMemberDetails(id);
    const handlerDetails = await getHandlerDetails(id);

    if (!teamMember || !handlerDetails) return notFound();

    const user = teamMember[0];
    const {
        avgResolutionTime,
        totalAssignedIncidents,
        totalOpenIncidents,
        totalOverdueIncidents
    } = handlerDetails;

    const crumbs: Map<string, string> = new Map();
    crumbs.set(`/dashboard/team`, "Team");
    crumbs.set(`/dashboard/team/${id}`, "Team Member");

    const unassignedIncidents = await getUnassignedIncidents();

    return (
        <div className="flex min-h-screen bg-white dark:bg-black p-10">
            <main className="w-full max-w-6xl mx-auto flex flex-col gap-16">

                {/* Header */}
                <section className="flex flex-col gap-4">
                    {/* page title */}
                    <p className="text-4xl font-extrabold text-black dark:text-white">
                        Team Member
                    </p>

                    {/* breadcrumb */}
                    <BreadCrumb crumbs={crumbs} />

                    <p className="text-gray-500 text-sm">
                        Detailed view of account access, role configuration, and membership status.
                    </p>

                    <div className="pt-4">
                        <Link
                            href="/dashboard/team"
                            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm font-medium"
                        >
                            <FaArrowLeft className="mr-2" /> Back to Team
                        </Link>
                    </div>
                </section>

                {/* Profile Overview */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-extrabold text-black dark:text-white">
                        Profile information
                    </h2>

                    <table className="w-full border border-white">
                        <tbody>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    Full name
                                </td>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                    {user.name ?? "—"}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    Email address
                                </td>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                    {user.email}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    Role
                                </td>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                    {user.role}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    ID
                                </td>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                    {id}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    Status
                                </td>
                                <td
                                    className={`border border-black dark:border-white px-4 py-3 text-sm font-semibold ${user.status === "Active"
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {user.status}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm font-bold font-medium">
                                    Created
                                </td>
                                <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                    }).format(new Date(user.createdAt))}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </section>

                {/* Administrative Controls */}
                <TeamAdminControls unassignedIncidents={unassignedIncidents} id={id} role={user.role!} status={user.status!} />

                {/* Workload Snapshot Placeholder */}
                <section className="flex flex-col gap-6">
                    <h2 className="text-2xl font-extrabold text-black dark:text-white">
                        Workload snapshot
                    </h2>

                    <p className="text-xs text-gray-500 max-w-xl">
                        Click on the row to view and manage the incidents assigned to this handler.
                    </p>

                    <table className="w-full border border-white">
                        <thead>
                            <tr>
                                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                    Total assigned
                                </th>
                                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                    Open incidents
                                </th>
                                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                    Overdue
                                </th>
                                <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                    Avg resolution (days)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                {[
                                    totalAssignedIncidents,
                                    totalOpenIncidents,
                                    totalOverdueIncidents,
                                    avgResolutionTime
                                ].map((item, index) => (

                                    <td
                                        key={index}
                                        className="hover:bg-black hover:text-white hover:border-white border border-black dark:border-white text-black dark:text-white text-sm font-normal px-4 py-2">
                                        <Link
                                            href={`/dashboard/team/${id}/${id}`}
                                            className="block w-full h-full text-black dark:text-white">
                                            {item}
                                        </Link>
                                    </td>

                                ))}
                            </tr>
                        </tbody>
                    </table>

                    <p className="text-xs text-gray-500">
                        Workload metrics reflect active case assignments and SLA adherence.
                    </p>
                </section>

            </main>
        </div>
    );
}