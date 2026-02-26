"use client";

import { FaHome } from "react-icons/fa";
import { MdOutlineReportProblem } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { NavItem } from "@/types/NavItem";
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// top sidenav items
const top_sidenav_items: NavItem[] = [
    { label: "Home", href: "/dashboard", Logo: FaHome },
    { label: "Incidents", href: "/dashboard/incidents", Logo: MdOutlineReportProblem },
    { label: "Team", href: "/dashboard/team", Logo: MdGroups },
    { label: "Reporting", href: "/dashboard/reporting", Logo: TbMessageReport },
];

// bottom sidenav items
const bottom_sidenav_items: NavItem[] = [
    { label: "Account Settings", href: "/dashboard/settings", Logo: IoSettingsOutline },
    { label: "Logout", href: "/", Logo: FiLogOut },
];

export function SideNav() {

    const pathname = usePathname();

    return (
        <div className="flex flex-col items-center justify-between bg-black dark:bg-white h-full p-6 w-full rounded-2xl">
            <div className="flex flex-col items-center justify-start space-y-2 w-full">

                {/* logo */}
                <h1 className="text-white dark:text-black text-2xl font-extrabold py-2 px-2 self-start">SemaFacts</h1>

                {/* top header items */}
                {top_sidenav_items.map(({ label, href, Logo }) => {
                    const isActive = pathname === href;

                    return (
                        <Link href={href} className={`flex items-center ${isActive ? `bg-white dark:bg-black text-black dark:text-white` : `bg-neutral-600 dark:bg-neutral-300 text-white dark:text-black`} hover:bg-white hover:text-black rounded-3xl px-6 py-3 w-full`} key={href}>
                            <Logo size={20} className={`hover:text-black hover:bg-white mr-2`} /> {label}
                        </Link>
                    );
                })}
            </div>
            <div className="flex flex-col items-start justify-start space-y-2 w-full">

                {/* bottom sidenav items */}
                {bottom_sidenav_items.map(({ label, href, Logo }) => (
                    label === "Logout" ? <button className="flex items-center text-white dark:text-black w-full px-4 py-2 hover:text-yellow-400" key={href} onClick={() => signOut({ callbackUrl: "/signin" })}>
                        <Logo size={20} className="text-white dark:text-black mr-2" /> {label}
                    </button> : <Link href={href} className="flex items-center text-white dark:text-black w-full px-4 py-2 hover:text-yellow-400" key={href}>
                        <Logo size={20} className="text-white dark:text-black mr-2" /> {label}
                    </Link>
                ))}
            </div>
        </div>
    )
}