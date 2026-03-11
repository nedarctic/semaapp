import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { incidents, attachments, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";
import { redirect } from "next/navigation";
import IncidentChat from "@/components/incident/IncidentChat";
import IncidentEvidence from "@/components/incident/IncidentEvidence";
import IncidentOverview from "@/components/incident/IncidentOverview";

type Incident = InferSelectModel<typeof incidents>;

export async function getIncident(incidentId: unknown): Promise<Incident[]> {
    const incident = await db.select().from(incidents).where(eq(incidents.id, incidentId as string));
    return incident;
}

export async function getAttachments (incidentId: unknown) {
    const data = await db.select().from(attachments).where(eq(attachments.incidentId, incidentId as string));
    return data;
}

export async function getInitialMessages (incidentId: string) {
    const initialMessages = await db.select().from(messages).where(eq(messages.incidentId, incidentId));

    return initialMessages;
}

export default async function TrackIncidentPage() {
    const session = await getServerSession(authOptions);
    if (!session || session.type !== "incident") redirect("https://www.semafacts.com");

    const incidentId: unknown = session!.incidentId;
    const [incident] = await getIncident(incidentId);
    const attachments = await getAttachments(incidentId);
    const senderId = incident.reporterId;
    const senderType = "Reporter";
    const incidentName = incident.incidentIdDisplay;
    const initialMessages = await getInitialMessages(incident.id);

    console.log("Session details", session);
    console.log("Incident Details:", incident);
    console.log("Attachments:", attachments);

    return (
        <main className="min-h-screen w-full">
            <section className="min-h-screen bg-white dark:bg-black px-6">
                <div className="max-w-5xl mx-auto w-full flex flex-col gap-24 py-20">

                    <IncidentOverview incident={incident} />

                    <IncidentChat 
                    incidentId={incident.id} 
                    incidentName={incidentName}
                    initialMessages={initialMessages}
                    senderId={senderId}
                    />

                    <IncidentEvidence attachments={attachments} />

                </div>
            </section>
        </main>
    );
}