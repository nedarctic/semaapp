"use server";

import { db } from "@/lib/db";
import { incidents } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function closeIncident(id: string) {
  await db
    .update(incidents)
    .set({
      status: "Closed",
      closedAt: new Date(),
    })
    .where(eq(incidents.id, id));
}

export async function changeIncidentStatus(
  id: string,
  status: "New" | "In Review" | "Investigation" | "Resolved" | "Closed"
) {
  await db
    .update(incidents)
    .set({ status })
    .where(eq(incidents.id, id));
}

export async function resolveIncident (id: string) {
    await db.
    update(incidents).
    set({status: "Closed"}).
    where(eq(incidents.id, id))
}

export async function reassignHandler (incidentId:string, handlerId: string) {
    await db.update(incidents).set({assignedHandlerId: handlerId}).where(eq(incidents.id, incidentId))
}

export async function setDeadline (id: string, deadline: string) {
    await db
    .update(incidents)
    .set({deadlineAt: new Date(deadline)})
    .where(eq(incidents.id, id));
}