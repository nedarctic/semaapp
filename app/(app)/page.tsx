import { Capability } from '@/components/Capability';
import Link from 'next/link';
import bcrypt from 'bcrypt';

export async function hashPassword (password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed password", hashedPassword);
}

export default async function AdminWelcome() {

  await hashPassword("semapass123");

  return (
    <main className="min-h-screen w-full">
      <section className="min-h-screen bg-white dark:bg-black flex items-center px-6">
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-24 py-20">

          {/* Brand / Context */}
          <header className="flex flex-col gap-8">
            <h1 className="text-black dark:text-white text-5xl md:text-6xl lg:text-7xl font-light tracking-tight">
              SemaFacts
            </h1>

            <div className="max-w-2xl flex flex-col gap-4">
              <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg font-light leading-relaxed">
                SemaFacts is a secure incident reporting and case management system
                designed for organizations that require confidentiality,
                accountability, and structured investigation workflows.
              </p>

              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base font-light leading-relaxed">
                The platform enables safe reporting, controlled access for handlers,
                auditable timelines, and secure communication between reporters and
                assigned staff.
              </p>
            </div>
          </header>

          {/* Capabilities */}
          <section className="flex flex-col gap-16 border-t border-gray-200 dark:border-zinc-800 pt-16">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">

              <Capability
                title="Secure reporting"
                description="Receive incidents anonymously or confidentially, including supporting evidence, through a protected reporting channel."
              />

              <Capability
                title="Incident management"
                description="Assign handlers, track progress, update statuses, and manage deadlines within a structured case workspace."
              />

              <Capability
                title="Controlled access"
                description="Manage administrators and handlers with defined roles and permissions tailored to your organization."
              />

              <Capability
                title="Auditability and compliance"
                description="Maintain a complete audit trail of actions, communications, and status changes to support governance and compliance needs."
              />

            </div>
          </section>

          {/* Actions */}
          <section className="flex flex-col items-center justify-center sm:flex-row gap-4 pt-8">

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
            >
              Enter dashboard
            </Link>

          </section>

        </div>
      </section>
    </main>
  )
}
