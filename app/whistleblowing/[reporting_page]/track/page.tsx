"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function TrackIncidentPage() {
  const [incidentId, setIncidentId] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("incident-access", {
      incidentId,
      secretCode,
      redirect: false,
    });

    if (res?.error) {
      // Intentionally vague for security
      setError("Invalid Incident ID or Secret Code.");
      setLoading(false);
      return;
    }

    // Successful login → redirect to tracking page
    window.location.href = "track/incident";
  }

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-light">
            Track an Incident
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base leading-relaxed">
            Enter your Incident ID and secret code to securely track the status
            of your report.
          </p>
        </header>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Incident ID
            </label>
            <input
              type="text"
              value={incidentId}
              onChange={(e) => setIncidentId(e.target.value)}
              placeholder="e.g. INC-AB3K9Q"
              required
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Secret Code
            </label>
            <input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Enter the secret code you received"
              required
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Track incident"}
          </button>
        </form>

        {/* Helper text */}
        <p className="text-center text-black/60 dark:text-white/60 text-sm">
          Lost your secret code? For security reasons, it cannot be recovered.
        </p>
      </div>
    </main>
  );
}