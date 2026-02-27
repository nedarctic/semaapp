"use client";

import { useState } from "react";

export default function NewIncidentReport() {
  const [reporterType, setReporterType] = useState<"anonymous" | "confidential" | null>(null);

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-light">
            Report an Incident
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base leading-relaxed">
            Use this form to report misconduct, abuse, corruption, or other
            unethical behavior. Reports are handled securely and confidentially.
          </p>
        </header>

        {/* Step 1: Anonymity Choice */}
        <section className="space-y-6">
          <h2 className="text-black dark:text-white text-xl font-semibold">
            Would you like to report anonymously?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setReporterType("anonymous")}
              className={`border-2 rounded-2xl p-6 text-left transition
                ${
                  reporterType === "anonymous"
                    ? "border-black dark:border-white"
                    : "border-black/30 dark:border-white/30"
                }`}
            >
              <p className="text-black dark:text-white font-semibold">
                Yes, report anonymously
              </p>
              <p className="mt-2 text-black/70 dark:text-white/70 text-sm">
                No name or contact details will be collected.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setReporterType("confidential")}
              className={`border-2 rounded-2xl p-6 text-left transition
                ${
                  reporterType === "confidential"
                    ? "border-black dark:border-white"
                    : "border-black/30 dark:border-white/30"
                }`}
            >
              <p className="text-black dark:text-white font-semibold">
                No, share my details confidentially
              </p>
              <p className="mt-2 text-black/70 dark:text-white/70 text-sm">
                Your identity will only be visible to authorized handlers.
              </p>
            </button>
          </div>
        </section>

        {/* Step 2: Incident Details */}
        <section className="space-y-8">
          <h2 className="text-black dark:text-white text-xl font-semibold">
            Incident details
          </h2>

          <div className="space-y-6">
            <select className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white">
              <option value="">Select incident category</option>
              <option>Corruption</option>
              <option>Bribery</option>
              <option>Sexual abuse</option>
              <option>Discrimination</option>
            </select>

            <textarea
              rows={6}
              placeholder="Describe the incident in detail"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />

            <input
              type="text"
              placeholder="Where did the incident happen?"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />

            <input
              type="text"
              placeholder="Who was involved?"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />

            <input
              type="date"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />

            <input
              type="file" multiple
              className="w-full text-sm text-black dark:text-white"
            />
          </div>
        </section>

        {/* Step 3: Reporter Details (Conditional) */}
        {reporterType === "confidential" && (
          <section className="space-y-6">
            <h2 className="text-black dark:text-white text-xl font-semibold">
              Your details
            </h2>

            <p className="text-black/70 dark:text-white/70 text-sm">
              These details will be kept confidential and visible only to
              authorized investigators.
            </p>

            <input
              type="text"
              placeholder="Full name"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />

            <input
              type="email"
              placeholder="Email address"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />

            <input
              type="tel"
              placeholder="Phone number (optional)"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent"
            />
          </section>
        )}

        {/* Submit */}
        <section className="pt-12">
          <button
            type="submit"
            className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 font-semibold hover:opacity-90 transition"
          >
            Submit report securely
          </button>

          <p className="mt-4 text-center text-black/60 dark:text-white/60 text-sm">
            After submission, you will receive an Incident ID and a secret code.
            Save the secret code — it cannot be recovered.
          </p>
        </section>
      </div>
    </main>
  );
}