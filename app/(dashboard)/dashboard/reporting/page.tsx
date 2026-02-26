import { FaHome } from "react-icons/fa";

export default function ReportingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-start justify-start p-10 bg-white dark:bg-black sm:items-start">
        
        {/* page title */}
        <p className="text-4xl font-extrabold">Reporting</p>

        {/* breadcrumb */}
        <div className="flex items-center py-4">
          <FaHome size={20} className="text-gray-400 mr-2" /><p className="text-gray-400 text-xl"> / Reporting</p>
        </div>
        
      </main>
    </div>
  );
}