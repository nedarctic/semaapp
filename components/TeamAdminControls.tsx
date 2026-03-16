"use client";

import { useState, useTransition } from "react";
import { 
    toggleAccountStatus, 
    removeMember, 
    toggleRole,
    assignIncident 
} from '@/actions/team.actions';

import { useRouter } from "next/navigation";
import { incidents } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Incident = InferSelectModel<typeof incidents>;

export function TeamAdminControls({ id, role, status, unassignedIncidents }: { id: string; role: string; status: string; unassignedIncidents: Incident[] }) {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [action, setAction] = useState<null | "toggleStatus" | "remove" | "toggleRole" | "assignIncident">(null);
    const [incidentId, setIncidentId] = useState<string>();

    console.log("Incident ID:", incidentId);

    function handleConfirm() {
        if (!action) return;

        startTransition(async () => {
            if (action == "toggleStatus") {
                await toggleAccountStatus(id, status);
                router.refresh();
            }

            if (action == "remove") {
                await removeMember(id);
                router.push("/dashboard/team");
            }

            if (action == "toggleRole") {
                await toggleRole(id, role);
                router.refresh();
            }

            if (action == "assignIncident") {
                console.log("Incident ID inside handler at action call point", incidentId);
                await assignIncident(incidentId!, id);
                router.refresh();
            }

            setAction(null);
        });
    }

    return (
        <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-extrabold text-black dark:text-white">
                Administrative controls
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button
                    onClick={() => setAction("toggleRole")}
                    className="px-6 py-3 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                >
                    {role === "Handler" ? "Make Admin" : "Make Handler"}
                </button>
                <button
                    onClick={() => setAction("assignIncident")}
                    className="px-6 py-3 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                >
                    Assign Incident
                </button>
                <button
                    onClick={() => setAction("toggleStatus")}
                    className="px-6 py-3 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                >
                    {status === "Active" ? "Deactivate account" : "Activate account"}
                </button>

                <button
                    onClick={() => setAction("remove")}
                    className="px-6 py-3 border border-red-600 text-red-600 text-sm hover:bg-red-600 hover:text-white transition"
                >
                    Remove member
                </button>
            </div>

            {/* Confirmation Modal */}
            {action && (
                <div onClick={() => setAction(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-black border border-black dark:border-white p-6 max-w-md w-full rounded-xl">
                        <h3 className="text-lg font-bold mb-4">
                            Confirm action
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            This action will immediately affect system access.
                            Are you sure you want to continue?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setAction(null)}
                                className="px-4 py-2 border border-gray-400 text-sm rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="px-4 py-2 border border-black bg-black text-white text-sm disabled:opacity-50 rounded-lg"
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* set status modal */}
            {action == "assignIncident" && (
                <div onClick={() => setAction(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-black border border-black dark:border-white p-6 max-w-md w-full rounded-lg">
                        <h3 className="text-lg font-bold mb-4">
                            Assign handler a new incident
                        </h3>

                        {unassignedIncidents.length ? (<p className="text-sm text-gray-500 mb-6">
                            Select one
                        </p>) : ''}

                        <div className="flex flex-col items-center justify-center gap-4 mb-6">
                            {unassignedIncidents !== null && unassignedIncidents.length > 0  ? unassignedIncidents?.map((incident, index) => (
                                <button key={index} className={`rounded-md px-4 py-3 ${incidentId == incident.id ? "bg-white text-black border-2 border-black" : "bg-black text-white"} w-3/4`} onClick={() => setIncidentId(incident.id)}>{incident.category} incident</button>
                            )) : (<p className="text-sm text-gray-500 mb-6">No unassigned incidents at this point.</p>)}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setAction(null)}
                                className="px-4 py-2 border border-gray-400 text-sm rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={isPending || !incidentId}
                                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500 max-w-xl">
                Changes to role or status immediately affect system access and
                visibility of assigned incidents. Removal should only occur after
                reassignment of active cases.
            </p>
        </section>
    );
}