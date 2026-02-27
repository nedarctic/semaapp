"use client";

import Link from "next/link";

export default function ReportClient({reportingPageLink}: {reportingPageLink?: string}) {
  return (
    <main className="min-h-screen w-full bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-black dark:text-white text-4xl md:text-6xl lg:text-8xl font-light">
          Speak Up Safely
        </h1>
        <p className="mt-6 max-w-2xl text-black/80 dark:text-white/80 text-lg md:text-xl leading-relaxed">
          A secure and confidential way to report misconduct, abuse, fraud, or
          unethical behavior — without fear of retaliation.
        </p>
        <p className="mt-4 max-w-xl text-black/60 dark:text-white/60 text-sm md:text-base">
          Reports can be submitted anonymously and are handled by authorized
          investigators only.
        </p>
      </section>

      {/* Action Cards */}
      <section className="flex flex-col items-center justify-center w-full px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
          {/* Report Card */}
          <div className="flex flex-col justify-between border-2 border-black dark:border-white rounded-3xl p-8 min-h-[320px]">
            <div className="space-y-4">
              <h2 className="text-black dark:text-white text-2xl font-semibold">
                Submit a Report
              </h2>
              <p className="text-black dark:text-white text-base leading-relaxed">
                Report incidents such as corruption, harassment, abuse of power,
                safety violations, or unethical conduct.
              </p>
              <ul className="list-disc pl-5 text-black/80 dark:text-white/80 text-sm space-y-1">
                <li>Anonymous reporting supported</li>
                <li>No login required</li>
                <li>Secure and encrypted submission</li>
              </ul>
            </div>

            <Link
              href={`/whistleblowing/${reportingPageLink}/new`}
              className="mt-8 inline-flex items-center justify-center w-full rounded-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition"
            >
              Start a Report
            </Link>
          </div>

          {/* Track Card */}
          <div className="flex flex-col justify-between border-2 border-black dark:border-white rounded-3xl p-8 min-h-[320px]">
            <div className="space-y-4">
              <h2 className="text-black dark:text-white text-2xl font-semibold">
                Track an Existing Report
              </h2>
              <p className="text-black dark:text-white text-base leading-relaxed">
                If you’ve already submitted a report, you can check its status
                or communicate securely with investigators.
              </p>
              <ul className="list-disc pl-5 text-black/80 dark:text-white/80 text-sm space-y-1">
                <li>Use your report reference code</li>
                <li>View updates and responses</li>
                <li>Maintain anonymity</li>
              </ul>
            </div>

            <Link
              href={`/whistleblowing/${reportingPageLink}/track`}
              className="mt-8 inline-flex items-center justify-center w-full rounded-full px-6 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold text-sm hover:opacity-90 transition"
            >
              Track a Report
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-6 py-24 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto space-y-12">
          <h2 className="text-black dark:text-white text-3xl md:text-4xl font-light">
            How Reporting Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
              <h3 className="text-black dark:text-white font-semibold text-lg">
                1. Submit
              </h3>
              <p className="text-black/80 dark:text-white/80 text-sm leading-relaxed">
                Provide details about the incident. You may attach evidence and
                choose to remain anonymous.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-black dark:text-white font-semibold text-lg">
                2. Review
              </h3>
              <p className="text-black/80 dark:text-white/80 text-sm leading-relaxed">
                Authorized investigators review the report securely and may ask
                follow-up questions.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-black dark:text-white font-semibold text-lg">
                3. Resolution
              </h3>
              <p className="text-black/80 dark:text-white/80 text-sm leading-relaxed">
                Appropriate action is taken based on findings, while protecting
                the reporter’s identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="w-full px-6 py-16 border-t border-black/20 dark:border-white/20">
        <p className="text-center text-black/60 dark:text-white/60 text-sm max-w-3xl mx-auto">
          This platform is designed to protect whistleblowers, ensure fairness,
          and promote accountability. Retaliation against reporters is strictly
          prohibited.
        </p>
      </section>
    </main>
  );
}