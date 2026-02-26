import { FaHome } from "react-icons/fa";
import { getAllHandlersWithDetails } from "@/lib/helpers";
import Link from "next/link";
import { TiUserAdd } from "react-icons/ti";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>

type FetchData = {
  success?: boolean;
  error?: string;
  data?: any;
};

async function getTeamMembers() {

  try {
    // 1. get user id from session
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    console.log("user id:", userId);

    // 2. get company user object and destructure company id
    const user = await db.select().from(users).where(eq(users.id, userId)).then(res => res[0]);
    const { companyId } = user;

    console.log("company id", companyId)

    // 3. all users with the company id
    const members = await db.select().from(users).where(eq(users.companyId, companyId));

    // 4. return members
    return { success: true, data: members };
  } catch (error) {
    return { error: error instanceof Error ? error.message.toString : "Unknown error" }
  }

}

async function getTeamAdmins() {
  try {
    const members = (await getTeamMembers()).data;

    if (typeof members === undefined) {
      return null;
    }

    const admins = members?.filter(member => member.role === "Admin");

    if (typeof admins === undefined) {
      return null;
    }

    return { success: true, data: admins }

  } catch (error) {
    return { error: error instanceof Error ? error.message.toString() : "Unknown error" }
  }
}

async function getTeamHandlers() {
  try {
    const members = (await getTeamMembers()).data;

    if (typeof members === undefined) {
      return null;
    }

    const admins = members?.filter(member => member.role === "Handler");

    if (typeof admins === undefined) {
      return null;
    }

    return { success: true, data: admins }

  } catch (error) {
    return { error: error instanceof Error ? error.message.toString() : "Unknown error" }
  }
}

export default async function TeamPage() {
  const handlers = await getAllHandlersWithDetails();
  const members = await getTeamMembers();
  const newHandlers = await getTeamHandlers();
  const admins = await getTeamAdmins();

  if(newHandlers?.success) console.log("Handlers", newHandlers.data)

  if(admins?.success) console.log("Admins:", admins.data)

  if (members.success) console.log("Members:", members.data)

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start justify-start p-10 bg-white dark:bg-black">

        {/* page title */}
        <p className="text-4xl font-extrabold text-black dark:text-white">
          Team
        </p>

        {/* breadcrumb */}
        <div className="flex items-center py-4">
          <FaHome size={20} className="text-gray-400 mr-2" />
          <p className="text-gray-400 text-xl"> / Team</p>
        </div>

        {/* create new user */}
        <Link href={"/create-member"} className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex flex-row items-center justify-center">
          <TiUserAdd size={20} className="text-white dark:text-black mr-2" />Add new member</Link>

        {/* handlers table */}
        <table className="w-full mt-6 border border-black dark:border-white">
          <thead>
            <tr>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Handler
              </th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Email
              </th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Total Assigned
              </th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Open
              </th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Overdue
              </th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">
                Avg Resolution (days)
              </th>
            </tr>
          </thead>

          <tbody>
            {handlers.map(handler => (
              <tr key={handler.handler_id}>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.name}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.email}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.total_assigned_incidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.total_open_incidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.total_overdue_incidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.avg_resolution_time_days ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </div>
  );
}