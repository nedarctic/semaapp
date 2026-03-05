"use client";

import { useState, useTransition } from "react";
import {
    closeIncident,
    resolveIncident,
    changeIncidentStatus,
    reassignHandler,
    setDeadline,
} from "@/actions/incident.actions";

import type { InferSelectModel } from "drizzle-orm";
import { incidents, users } from "@/db/schema";
import { useRouter } from "next/navigation";

type Incident = InferSelectModel<typeof incidents>;
type User = InferSelectModel<typeof users>;

export function IncidentHandlerCard({
    incident
}: {
    incident: Incident
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [confirm, setConfirm] = useState<string | null>(null);
    const [status, setStatus] = useState<"New" | "In Review" | "Investigation" | "Resolved" | "Closed">(incident.status);
    const [handlerId, setHandlerId] = useState<string>(incident.assignedHandlerId!);
    const [date, setDate] = useState<string>();

    const isOverdue =
        incident.deadlineAt &&
        incident.status !== "Closed" &&
        new Date(incident.deadlineAt).getTime() < Date.now();

    function handleAction(action: string) {
        startTransition(async () => {
            if (action === "close") {
                await closeIncident(incident.id);
                router.refresh();
            }

            else if (action === "resolve") {
                await resolveIncident(incident.id);
                router.refresh();
            }

            else if (action === "changeStatus") {
                await changeIncidentStatus(incident.id, status);
                router.refresh();
            }

            else if (action === "reassign") {
                await reassignHandler(incident.id, handlerId);
                router.refresh();
            }

            else if (action === "deadline") {
                await setDeadline(incident.id, date!);
                router.refresh();
            }

            setConfirm(null);
        });
    }

    return (
        <div className="border border-black dark:border-white p-8 flex flex-col gap-8">

            {/* Top Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-extrabold text-black dark:text-white">
                    {incident.incidentIdDisplay}
                </h2>

                <p className="text-sm text-gray-500">
                    {incident.category} · {incident.location}
                </p>

                <p
                    className={`text-sm font-semibold ${incident.status === "Closed"
                        ? "text-green-600"
                        : isOverdue
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                >
                    {isOverdue ? "Overdue" : incident.status}
                </p>
            </div>

            {/* Description */}
            <div className="text-sm text-black dark:text-white leading-relaxed">
                {incident.description}
            </div>

            {/* Metadata */}
            <div className="text-xs text-gray-500 flex flex-col gap-1">
                <span>
                    Created:{" "}
                    {new Intl.DateTimeFormat("en-GB").format(
                        new Date(incident.createdAt)
                    )}
                </span>

                {incident.deadlineAt && (
                    <span>
                        Deadline:{" "}
                        {new Intl.DateTimeFormat("en-GB").format(
                            new Date(incident.deadlineAt)
                        )}
                    </span>
                )}
            </div>

            {/* Administrative Controls */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-black dark:border-white">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    <button
                        onClick={() => setConfirm("close")}
                        className="px-4 py-2 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                    >
                        Close incident
                    </button>

                    <button
                        onClick={() => setConfirm("resolve")}
                        className="px-4 py-2 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                    >
                        Mark as resolved
                    </button>

                    <button onClick={() => setConfirm("deadline")} className="px-4 py-2 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
                        Set deadline
                    </button>

                    <button
                        onClick={() => setConfirm("changeStatus")}
                        className="px-4 py-2 border border-black dark:border-white text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
                    >
                        Change Status
                    </button>                    
                </div>
            </div>

            {/* Confirmation Modal - close, resolve incident */}
            {confirm && (
                <div onClick={() => setConfirm(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white dark:bg-black border border-black dark:border-white p-6 max-w-md w-full rounded-lg">
                        <h3 className="text-lg font-bold mb-4">
                            Confirm administrative action
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            This action will immediately update the case workflow.
                            Continue?
                        </p>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirm(null)}
                                className="px-4 py-2 border border-gray-400 text-sm rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleAction(confirm)}
                                disabled={isPending}
                                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* set status modal */}
            {confirm == "changeStatus" && (
                <div onClick={() => setConfirm(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-black border border-black dark:border-white p-6 max-w-md w-full rounded-lg">
                        <h3 className="text-lg font-bold mb-4">
                            Change incident status
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            Select one
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 mb-6">
                            <button className={`rounded-md px-4 py-3 ${status == "New" ? "bg-white text-black border-2 border-black" : "bg-black text-white"} w-3/4`} onClick={() => setStatus("New")}>New</button>
                            <button className={`rounded-md px-4 py-3 ${status == "In Review" ? "bg-white text-black border-2 border-black" : "bg-black text-white"} bg-black w-3/4`} onClick={() => setStatus("In Review")}>In Review</button>
                            <button className={`rounded-md px-4 py-3 ${status == "Investigation" ? "bg-white text-black border-2 border-black" : "bg-black text-white"} bg-black w-3/4`} onClick={() => setStatus("Investigation")}>Investigation</button>
                            <button className={`rounded-md px-4 py-3 ${status == "Resolved" ? "bg-white text-black border-2 border-black" : "bg-black text-white"} bg-black w-3/4`} onClick={() => setStatus("Resolved")}>Resolved</button>
                            <button className={`rounded-md px-4 py-3 ${status == "Closed" ? "bg-white text-black border-2 border-black" : "bg-black text-white"} bg-black w-3/4`} onClick={() => setStatus("Closed")}>Closed</button>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirm(null)}
                                className="px-4 py-2 border border-gray-400 text-sm rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleAction(confirm)}
                                disabled={isPending}
                                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* set deadline modal */}
            {confirm == "deadline" && (
                <div onClick={() => setConfirm(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-black border border-black dark:border-white p-6 max-w-md w-full rounded-lg">

                        <h3 className="text-lg font-bold mb-4">
                            Set or update deadline for incident.
                        </h3>

                        <input
                            type="date"
                            name="incidentDate"
                            onChange={e => setDate(e.target.value)}
                            required
                            className="w-full border-2 rounded-xl px-4 py-3 bg-transparent mb-6"
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setConfirm(null)}
                                className="px-4 py-2 border border-gray-400 text-sm rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleAction(confirm)}
                                disabled={isPending || !date}
                                className="px-4 py-2 bg-black text-white text-sm disabled:opacity-50 rounded-lg"
                            >
                                {isPending ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}