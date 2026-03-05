import Link from "next/link";
import { FaHome } from "react-icons/fa";

export function BreadCrumb({crumbs}: {crumbs: Map<string, string>}) {

    const breadCrumbs = [];

    for (const [path, label] of crumbs) {
        breadCrumbs.push({path, label});
    }

    return (
        <div className="flex items-center py-4">
            <Link href={"/dashboard"}>
                <FaHome size={20} className="text-gray-400 mr-2" />
            </Link> 
            
            <p className="text-gray-400 text-xl">
            {breadCrumbs.map((crumb, index) => (
                <Link key={index} href={crumb.path}>/ {crumb.label} </Link>
            ))}
            </p>
        </div>
    );
}