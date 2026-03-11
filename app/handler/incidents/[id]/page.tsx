import { IncidentHandlerCard } from "@/components/IncidentHandlerCard";
import IncidentHandlerChat from "@/components/incident/IncidentHandlerChat";
import Link from 'next/link';
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { incidents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getInitialMessages } from "@/app/whistleblowing/[reporting_page]/track/incident/page";
import { IoMdArrowRoundBack } from "react-icons/io";

export default async function IncidentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if(!session || session.type !== "handler") redirect("/handler")
    const userId = await session?.user.id;
    const initialMessages = await getInitialMessages(id);

    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    if (!incident) return notFound();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 gap-10">

            <div className="flex flex-row gap-2 self-start ml-16 lg:ml-28">
                <IoMdArrowRoundBack size={16} color={"black"} />
                <Link href={"/handler/incidents"} className="text-gray-400 font-bold text-sm">Back to incidents</Link>
            </div>

            <p className="text-4xl font-extrabold text-black dark:text-white">
                Inncident Details & Chat
            </p>
            <IncidentHandlerCard incident={incident} />
            <IncidentHandlerChat incidentId={incident.id} incidentName={incident.incidentIdDisplay} initialMessages={initialMessages} senderId={userId} />
        </div>
    );
}