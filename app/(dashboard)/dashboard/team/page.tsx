import { FaHome } from "react-icons/fa";
import { getAllHandlersWithDetails } from "@/lib/helpers";
import Link from "next/link";
import { TiUserAdd } from "react-icons/ti";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { users, incidents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof users>

type FetchData = {
  success?: boolean;
  error?: string;
  data?: any;
};

type Incident = InferSelectModel<typeof incidents>;

export async function getCompanyId() {
  try {
    // 1. get user id from session
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    console.log("user id:", userId);

    // 2. get company user object and destructure company id
    const user = await db.select().from(users).where(eq(users.id, userId)).then(res => res[0]);
    const { companyId } = user;

    console.log("company id", companyId)

    return { success: true, data: companyId };
  } catch (error) {
    return { error: error instanceof Error ? error.message.toString() : "Unknown error" }
  }
}

async function getTeamMembers() {

  try {
    // 1. get user id from session
    const res = await getCompanyId();

    // 2. all users with the company id
    let members;

    if (res?.data) {
      const companyId = res.data;
      members = await db.select().from(users).where(eq(users.companyId, companyId));
    }

    // 3. return members
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

export async function getHandlerIncidents(id: string) {

  const handlerIncidents = await db.select().from(incidents).where(eq(incidents.assignedHandlerId, id));
  return handlerIncidents;

}

export async function getHandlerNameAndEmail(id: string) {
  const handler = await db.select().from(users).where(eq(users.id, id));
  const [{ name, email }] = handler;
  return { name, email };
}

export async function getTeamHandlersIncidentsWithDetails() {

  // 1. get handlers ids
  const teamHandlers = await getTeamHandlers();

  if (!teamHandlers?.data || teamHandlers.error) return null;
  const teamHandlersIds = teamHandlers?.data?.map((handler) => handler.id);



  // 2. create map with handler ids as keys
  const handlerDetails: Map<string, {
    name: string | null;
    email: string;
    totalAssignedIncidents: number;
    totalOpenIncidents: number;
    overdueIncidents: number;
    avgResolutionTime: number;
  }> = new Map();



  // 3. get handlers incidents
  const data = await Promise.all(
    teamHandlersIds.map(async id => {
      const incidents = await getHandlerIncidents(id);

      return { id, incidents }
    })
  );

  const handlersIncidents: Map<string, Incident[]> = new Map();

  for (const { id, incidents } of data) {
    if (incidents)
      handlersIncidents.set(id, incidents);
  }

  const closedIncidents: Map<string, Incident[]> = new Map();
  let avgResolutionTime;

  for (const [id, incidents] of handlersIncidents) {

    const { name, email } = await getHandlerNameAndEmail(id);

    handlerDetails.set(id, {
      name: name,
      email: email,
      totalAssignedIncidents: incidents.length,
      totalOpenIncidents: 0,
      overdueIncidents: 0,
      avgResolutionTime: 0,
    })

    incidents.forEach(incident => {
      if (incident.status !== "Closed") {
        handlerDetails.get(id)!.totalOpenIncidents++;

        if (!incident.deadlineAt) return false;
        if (new Date(incident.deadlineAt).getTime() < Date.now()) {
          handlerDetails.get(id)!.overdueIncidents++;
        };
      } else {
        closedIncidents.set(id, [incident]);
      }
    });
  }

  for (const [id, incidents] of closedIncidents) {
    const totalTime = incidents.reduce((acc, incident) => {
      const opened = new Date(incident.createdAt).getTime();
      const closed = new Date(incident.closedAt!).getTime();

      return acc + (closed - opened);
    }, 0);
    const timePerIncident = totalTime / incidents.length;
    avgResolutionTime = Math.round(timePerIncident / (1000 * 60 * 60 * 24))
    handlerDetails.get(id)!.avgResolutionTime = avgResolutionTime;
  }


  return handlerDetails;
  // 4. to each handler id in the map, add an object with 
  // these details - total assigned, open, overdue, avg resolution (days)

  // 5. return data
}

export default async function TeamPage() {
  const handlers = await getAllHandlersWithDetails();
  const teamMembers = await getTeamMembers();
  const teamHandlers = await getTeamHandlers();
  const teamAdmins = await getTeamAdmins();
  const teamHandlersDetails = await getTeamHandlersIncidentsWithDetails();

  if (!teamHandlersDetails) {
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

          <div className="py-8">
            <p className="text-sm font-bold">No Team Yet. Begin by creating a new member for your team.</p>
          </div>

          <Link href={"/create-member"} className="px-4 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold flex flex-row items-center justify-center">
            <TiUserAdd size={20} className="text-white dark:text-black mr-2" />Add new member</Link>

        </main>
      </div>
    );
  }

  const newHandlers = [];

  for (const [id, handler] of teamHandlersDetails) {
    newHandlers.push(handler);
  }

  if (teamHandlers?.success) console.log("Handlers", teamHandlers.data)

  if (teamAdmins?.success) console.log("Admins:", teamAdmins.data)

  if (teamMembers.success) console.log("Members:", teamMembers.data)

  console.log("Team handlers details:", teamHandlersDetails);

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
            {newHandlers.map(handler => (
              <tr key={handler.name}>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.name}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.email}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.totalAssignedIncidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.totalOpenIncidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.overdueIncidents}
                </td>
                <td className="border border-black dark:border-white px-4 py-2 text-black dark:text-white text-sm">
                  {handler.avgResolutionTime ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </div>
  );
}