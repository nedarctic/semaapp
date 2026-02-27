import { FaHome } from "react-icons/fa";
import { MdAddLink } from "react-icons/md";
import Link from "next/link";
import { db } from "@/lib/db";
import { reportingPages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCompanyId } from "../team/page";

export default async function ReportingPage() {
  const response = await getCompanyId();
  let companyId = response.data!;
  const data = await db
    .select()
    .from(reportingPages)
    .where(eq(reportingPages.companyId, companyId));

  const page = data[0] || null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white dark:bg-black font-sans p-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <p className="text-4xl font-extrabold text-black dark:text-white">Reporting</p>
          <div className="flex items-center py-2">
            <FaHome size={20} className="text-gray-400 mr-2" />
            <p className="text-gray-400 text-xl">/ Reporting</p>
          </div>
        </div>
        <Link
          href="/dashboard/reporting/configure"
          className="mt-4 md:mt-0 px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex items-center justify-center"
        >
          <MdAddLink size={20} className="text-white dark:text-black mr-2" />
          Configure Reporting Page
        </Link>
      </header>

      {/* Admin notice */}
      {page && (
        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 mb-6 rounded-lg">
          <p className="text-black dark:text-white text-sm">
            These are the currently configured reporting page details. To update them, click the{" "}
            <span className="font-semibold">Configure Reporting Page</span> button above.
          </p>
        </div>
      )}

      {/* Reporting page details */}
      <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 space-y-6 w-full">
        {page ? (
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-black dark:text-white">{page.title}</h2>
            <p className="text-black/70 dark:text-white/70">{page.introContent}</p>

            
            {page.policyUrl && (
              <div className="mt-4">
                <span className="font-semibold text-black dark:text-white">Policy URL: </span>
                <Link
                  href={page.policyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {page.policyUrl}
                </Link>
              </div>
            )}

            {page.reportingPageUrl && (
              <div>
                <span className="font-semibold text-black dark:text-white">Reporting URL: </span>
                <Link
                  href={`http://localhost:3000/whistleblowing/${page.reportingPageUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline"
                >
                  {`http://localhost:3000/whistleblowing/${page.reportingPageUrl}`}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <p className="text-black/70 dark:text-white/70">
            No reporting page has been configured yet. Click "Configure Reporting Page" above to get started.
          </p>
        )}
      </section>
    </div>
  );
}