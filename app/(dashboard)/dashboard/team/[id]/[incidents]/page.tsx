import { db } from "@/lib/db";
import { incidents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { IncidentCard } from "@/components/IncidentCard";
import { getHandlerNameAndEmail } from "@/app/(dashboard)/dashboard/team/page";
import { FaHome } from "react-icons/fa";
import { getTeamHandlers } from "@/app/(dashboard)/dashboard/team/page";

type Incident = InferSelectModel<typeof incidents>;
type User = InferSelectModel<typeof users>;

export async function getUnassignedHandlers() {

    try {
        const allIncidents = await db.select().from(incidents);

        const assignedHandlerIds = allIncidents.map(incident => {
            return incident.assignedHandlerId;
        })

        const allHandlers = await getTeamHandlers();
        if (!allHandlers?.data) return null;
        const allHandlersIds = allHandlers?.data.map(handler => {
            return handler.id;
        })

        const allHandlersIdsSet = new Set(allHandlersIds);
        const assignedHandlerIdsSet = new Set(assignedHandlerIds);

        const unassignedHandlersIds = [...allHandlersIdsSet].filter(id => !assignedHandlerIdsSet.has(id));
        
        const unassignedHandlers: User[]  = [];

        for (const handler of allHandlers.data) {
            unassignedHandlersIds.map(id => {
                if(handler.id === id){
                    unassignedHandlers.push(handler);
                }
            })
        }

        return unassignedHandlers;

    }
    catch (error) {
        return null;
    }
}

export async function getHandlerIncidents(
    id: string
): Promise<Incident[] | null> {
    try {
        return await db
            .select()
            .from(incidents)
            .where(eq(incidents.assignedHandlerId, id));
    } catch {
        return null;
    }
}

export default async function TeamMemberIncidents({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const handlerIncidents = await getHandlerIncidents(id);
    if (!handlerIncidents) return notFound();

    const { name, email } = await getHandlerNameAndEmail(id);

    const unassignedHandlers = await getUnassignedHandlers();
    if(unassignedHandlers) console.log("Unassigned handlers:", unassignedHandlers);

    return (
        <div className="flex min-h-screen bg-white dark:bg-black p-10">
            <main className="w-full max-w-5xl mx-auto flex flex-col gap-16">

                {/* Header */}
                <section className="flex flex-col gap-4">
                    <h1 className="text-4xl font-extrabold text-black dark:text-white">
                        Assigned incidents
                    </h1>

                    {/* breadcrumb */}
                    <div className="flex items-center py-4">
                        <Link href={"/dashboard"}><FaHome size={20} className="text-gray-400 mr-2" /></Link> <p className="text-gray-400 text-xl"> / <Link href={"/dashboard/team"}>Team</Link> / <Link href={`/dashboard/team/${id}`}>Team Member</Link> / <Link href={`/dashboard/team/${id}`}>Team Member Incidents</Link></p>
                    </div>

                    <p className="text-gray-500 text-sm">
                        Detailed case view including workflow stage, SLA tracking,
                        and administrative controls.
                    </p>

                    <div className="pt-4">
                        <Link
                            href={`/dashboard/team/${id}`}
                            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm font-medium"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to team member
                        </Link>
                    </div>
                </section>

                <p className="text-black text-xl font-bold">
                    {name ? name : email}&apos;s incidents
                </p>

                {/* Incident Cards */}
                <section className="flex flex-col gap-10">
                    {handlerIncidents.length === 0 ? (
                        <div className="border border-black dark:border-white px-6 py-10 text-sm text-gray-500">
                            No incidents currently assigned to this handler.
                        </div>
                    ) : (
                        handlerIncidents.map((incident) => (
                            <IncidentCard key={incident.id} incident={incident} unassignedHandlers={unassignedHandlers ?? null} />
                        ))
                    )}
                </section>
            </main>
        </div>
    );
}