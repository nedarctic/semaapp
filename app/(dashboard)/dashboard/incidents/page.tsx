import { FaHome } from "react-icons/fa";
import { getIncidentDetails } from "@/lib/helpers";
import type { Incident } from "@/lib/types"
import { getHandler } from "@/lib/helpers";
          
export default async function IncidentPage() {

  const incidents: Incident[] = await getIncidentDetails();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start justify-start p-10 bg-white dark:bg-black sm:items-start">

        {/* page title */}
        <p className="text-4xl font-extrabold">Incidents</p>

        {/* breadcrumb */}
        <div className="flex items-center py-4">
          <FaHome size={20} className="text-gray-400 mr-2" /><p className="text-gray-400 text-xl"> / Incidents</p>
        </div>

        <table className="border border-black">
          <thead>
            <tr>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">ID</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Category</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Reporter</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Description</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Location</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Status</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Deadline</th>
              <th className="border border-white dark:border-black bg-black dark:bg-white dark:text-black text-white text-sm font-bold px-4 py-3 text-start">Created At</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(({ id, category, company_id, created_at, reporter_type, assigned_handler_user_id, description, location, status, deadline_at, closed_at }) => {
              
              return (
                <tr key={id}>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{id}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{category}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{reporter_type}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{description}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{location}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{status}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{deadline_at}</td>
                  <td className="text-black dark:text-white border border-black dark:border-white px-2 py-2 text-start text-sm">{created_at}</td>
                </tr>
              );
            })}

          </tbody>
        </table>
      </main>
    </div>
  );
}