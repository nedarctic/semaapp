"use client";

import { useState } from "react";
import { saveReportingPage } from "@/actions/SaveReportingPage";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { reportingPages } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type ReportingPage = InferSelectModel<typeof reportingPages>;

interface Props {
  reportingPageData: ReportingPage[];
  companyId: string;
}

export default function ReportingPageConfigure({ reportingPageData, companyId }: Props) {
  const data = reportingPageData[0] || {};

  const [title, setTitle] = useState(data.title ?? "");
  const [introContent, setIntroContent] = useState(data.introContent ?? "");
  const [policyUrl, setPolicyUrl] = useState(data.policyUrl ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportingPageUrl, setReportingPageUrl] = useState(data.reportingPageUrl ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await saveReportingPage(companyId, title, introContent, policyUrl, reportingPageUrl);
      if (res.updated) setStatus("Reporting page updated successfully!");
      else if (res.inserted) setStatus("Reporting page created successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Failed to save reporting page.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <Link
            href="/dashboard/reporting"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white text-sm font-medium"
          >
            <FaArrowLeft className="mr-2" /> Back to Reporting
          </Link>
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-light">
            Configure Reporting Page
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base leading-relaxed">
            Customize the reporting page that employees and external users see when submitting incidents.
          </p>
        </header>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Page Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Report an Incident"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Intro Content
            </label>
            <textarea
              value={introContent}
              onChange={(e) => setIntroContent(e.target.value)}
              placeholder="Write a short introduction for the reporting page..."
              rows={6}
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Reporting page URL
            </label>
            <input
              value={reportingPageUrl}
              onChange={(e) => setReportingPageUrl(e.target.value)}
              placeholder="e.g. company-x-whistleblowing_page"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Policy URL
            </label>
            <input
              type="text"
              value={policyUrl}
              onChange={(e) => setPolicyUrl(e.target.value)}
              placeholder="https://yourcompany.com/policy"
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          {/* Submit */}
          <div className="pt-6 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {status && (
              <p className="text-center text-green-600 dark:text-green-400 text-sm mt-6">{status}</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}