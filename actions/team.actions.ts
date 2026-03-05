"use server";

import { db } from "@/lib/db";
import { incidents, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function toggleAccountStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    await db
        .update(users)
        .set({ status: newStatus })
        .where(eq(users.id, id));
}

export async function removeMember(id: string) {
    await db.delete(users).where(eq(users.id, id));
}

export async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "Handler" ? "Admin" : "Handler";

    await db
        .update(users)
        .set({ role: newRole })
        .where(eq(users.id, id));
}

export async function assignIncident (incidentId: string, handlerId: string) {
    await db
    .update(incidents)
    .set({assignedHandlerId: handlerId})
    .where(eq(incidents.id, incidentId));
}