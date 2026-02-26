"use client";

import Link from "next/link";

export default function Report() {
    return (
        <main className="min-h-screen w-full">
            <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
                <h1 className="text-black dark:text-white text-4xl md:text-6xl lg:text-8xl font-light">Speak Up Safely</h1>
            </section>
            <section className="flex flex-col items-start justify-center min-h-screen w-full bg-white dark:bg-black ">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center px-4 py-12 w-full">
                    <div className="flex flex-col items-center justify-between w-full md:w-1/4 border-2 border-black dark:border-white rounded-4xl p-6 h-60">
                        <div className="flex flex-col justify-center items-start space-y-2">
                            <p className="text-black dark:text-white text-xl font-extrabold">Report an incident</p>
                            <p className="text-black dark:text-white text-lg">Submit a new report about misconduct, abuse, or unethical behavior.</p>
                        </div>
                        <Link href="/report" className="flex flex-col items-center justify-center w-full px-4 py-4 bg-black rounded-full text-white dark:bg-white dark:text-black font-bold text-sm">Report</Link>
                    </div>
                    <div className="flex flex-col items-center justify-between w-full md:w-1/4 border-2 border-black dark:border-white rounded-4xl p-6 h-60">
                        <div className="flex flex-col justify-center items-start space-y-2">
                            <p className="text-black dark:text-white text-xl font-extrabold">Track an incident</p>
                            <p className="text-black dark:text-white text-lg">Check the status of a report you already submitted.</p>
                        </div>
                        <Link href="/track" className="flex flex-col items-center justify-center w-full px-4 py-4 bg-black rounded-full text-white dark:bg-white dark:text-black font-bold text-sm">Track</Link>
                    </div>
                </div>
            </section>
        </main>
    );
}