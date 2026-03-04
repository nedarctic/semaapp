import Link from "next/link";
import { getPresignedUrl } from "@/lib/utils";

type Attachment = {
    id: string;
    incidentId: string;
    uploadedBy: "Reporter" | "Handler" | string;
    fileName: string;
    filePath: string;
    createdAt: Date;
};

export default async function IncidentEvidence({
    attachments,
}: {
    attachments: Attachment[];
}) {
    return (
        <section className="flex flex-col gap-12 border-t border-gray-200 dark:border-zinc-800 pt-16">

            <header className="flex flex-col gap-4 max-w-2xl">
                <h2 className="text-black dark:text-white text-2xl font-light">
                    Evidence and documents
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
                    Supporting files submitted in relation to this incident are stored
                    securely and are accessible only to authorized personnel.
                </p>
            </header>

            {attachments.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                    No supporting documents have been submitted for this incident.
                </p>
            ) : (
                <ul className="flex flex-col gap-6 max-w-3xl">
                    {attachments.map((attachment) => (
                        <li
                            key={attachment.id}
                            className="flex flex-col gap-1 border-b border-gray-200 dark:border-zinc-800 pb-4"
                        >
                            <Link
                                href={`/api/attachments/download?id=${attachment.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black dark:text-white text-sm md:text-base font-medium hover:underline"
                            >
                                {attachment.fileName}
                            </Link>
                            <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-light">
                                Uploaded by {attachment.uploadedBy} ·{" "}
                                {attachment.createdAt.toLocaleDateString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </section>
    );
}