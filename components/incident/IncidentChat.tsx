"use client";

export default function IncidentChat({
  incidentId,
}: {
  incidentId: string;
}) {
  return (
    <section className="flex flex-col gap-12 border-t border-gray-200 dark:border-zinc-800 pt-16">

      <header className="flex flex-col gap-4 max-w-2xl">
        <h2 className="text-black dark:text-white text-2xl font-light">
          Secure communication
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
          This space enables confidential communication between you and authorized
          handlers assigned to this incident. All messages are logged and auditable.
        </p>
      </header>

      <div className="text-gray-500 dark:text-gray-400 text-sm font-light">
        Conversation history will appear here.
      </div>

    </section>
  );
}