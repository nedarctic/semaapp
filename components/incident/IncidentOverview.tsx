import { InferSelectModel } from "drizzle-orm";
import { incidents } from "@/db/schema";

type Incident = InferSelectModel<typeof incidents>;

export default function IncidentOverview({ incident }: { incident: Incident }) {
  return (
    <section className="flex flex-col gap-12">

      {/* Header */}
      <header className="flex flex-col gap-6">
        <h1 className="text-black dark:text-white text-4xl md:text-5xl font-light tracking-tight">
          Incident {incident.incidentIdDisplay}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light max-w-2xl leading-relaxed">
          This page provides the current status of your report, relevant details,
          and a secure channel for communication regarding this incident.
        </p>
      </header>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 text-sm md:text-base">

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Status</p>
          <p className="text-black dark:text-white font-medium">{incident.status}</p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Category</p>
          <p className="text-black dark:text-white font-medium">{incident.category}</p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Location</p>
          <p className="text-black dark:text-white font-medium">{incident.location}</p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Incident date</p>
          <p className="text-black dark:text-white font-medium">{incident.incidentDate}</p>
        </div>

        <div>
          <p className="text-gray-500 dark:text-gray-400 font-light">Reporter type</p>
          <p className="text-black dark:text-white font-medium">{incident.reporterType}</p>
        </div>

      </div>

      {/* Description */}
      <div className="max-w-3xl flex flex-col gap-4">
        <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
          Description
        </p>

        <p className="text-black dark:text-white text-base md:text-lg font-light leading-relaxed whitespace-pre-wrap">
          {incident.description}
        </p>
      </div>

    </section>
  );
}