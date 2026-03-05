import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { incidents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function getHandler(handlerId: string) {
    const [handler] = await db.select().from(users).where(eq(users.id, handlerId));
    return handler;
}

export default async function HandlerIncidentsPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/handler");
    console.log("Session:", session);
    
    const handler = await getHandler(session.user.id);

    const handlerIncidents = await db
        .select()
        .from(incidents)
        .where(eq(incidents.assignedHandlerId, session.user.id));

    return (
        <div className="flex min-h-screen bg-white dark:bg-black p-10">
            <main className="w-full max-w-6xl mx-auto flex flex-col gap-16">

                <p className="text-md font-bold">Welcome, {handler.name}</p>

                {/* Header */}
                <section className="flex flex-col gap-4">
                    <p className="text-4xl font-extrabold text-black dark:text-white">
                        Assigned incidents
                    </p>

                    <p className="text-gray-500 text-sm max-w-2xl">
                        Overview of all incidents currently assigned to you.
                        Click on a record to review case details, update status,
                        and manage investigative actions.
                    </p>

                </section>

                {/* Table Section */}
                <section className="flex flex-col gap-6">

                    {handlerIncidents.length === 0 ? (
                        <div className="border border-black dark:border-white p-8 text-center">
                            <p className="text-sm font-medium text-black dark:text-white">
                                No incidents are currently assigned to your account.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                New assignments will appear here automatically once allocated.
                            </p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full border border-white">
                                <thead>
                                    <tr>
                                        <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                            Incident ID
                                        </th>
                                        <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                            Category
                                        </th>
                                        <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                            Status
                                        </th>
                                        <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                            Deadline
                                        </th>
                                        <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                                            Created
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {handlerIncidents.map((incident) => (
                                        <tr key={incident.id}>
                                            <td className="border border-black dark:border-white px-4 py-3 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
                                                <Link
                                                    href={`/handler/incidents/${incident.id}`}
                                                    className="block w-full h-full"
                                                >
                                                    {incident.incidentIdDisplay}
                                                </Link>
                                            </td>

                                            <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                                <Link
                                                    href={`/handler/incidents/${incident.id}`}
                                                    className="block w-full h-full"
                                                >{incident.category}</Link>
                                            </td>

                                            <td
                                                className={`border border-black dark:border-white px-4 py-3 text-sm font-semibold ${incident.status === "Closed"
                                                    ? "text-green-600"
                                                    : incident.status === "Resolved"
                                                        ? "text-blue-600"
                                                        : "text-yellow-600"
                                                    }`}
                                            ><Link
                                                href={`/handler/incidents/${incident.id}`}
                                                className="block w-full h-full"
                                            >
                                                    {incident.status}</Link>
                                            </td>

                                            <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                                <Link
                                                    href={`/handler/incidents/${incident.id}`}
                                                    className="block w-full h-full"
                                                >{incident.deadlineAt
                                                    ? new Intl.DateTimeFormat("en-GB", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "2-digit",
                                                    }).format(new Date(incident.deadlineAt))
                                                    : "—"}</Link>
                                            </td>

                                            <td className="border border-black dark:border-white px-4 py-3 text-sm">
                                                <Link
                                                    href={`/handler/incidents/${incident.id}`}
                                                    className="block w-full h-full"
                                                >{new Intl.DateTimeFormat("en-GB", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                }).format(new Date(incident.createdAt))}</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <p className="text-xs text-gray-500">
                                Records reflect current case ownership and operational status.
                                Ensure updates are logged to maintain audit integrity.
                            </p>
                        </>
                    )}
                </section>
            </main>
        </div>
    );
}