"use client";

import { useActionState } from "react";
import { CreateMemberAction } from '@/actions/CreateMemberAction';

export default function CreateMmeber() {

    const initialState = {
        success: false,
        error: undefined
    };

    const [state, formAction, pending] = useActionState(CreateMemberAction, initialState);

    return (
        <main className="min-h-screen w-full">
            <section className="flex flex-col dark:bg-black bg-white justify-center items-center min-h-screen">
                <div className="flex flex-row items-stretch justify-center gap-8 p-6 w-full h-full">

                    {/* Left Side Form */}
                    <div className="flex-1 flex-col w-full lg:w-1/2 justify-center items-start">
                        <div className="flex flex-col justify-start items-start w-full p-10">
                            <form action={formAction} className="w-full flex flex-col gap-6 bg-white dark:bg-black p-8 rounded-xl shadow-md  border-2 border-black dark:border-white">

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-semibold text-black dark:text-white">
                                        Create Member Account
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Fill in member&apos;s details to get started
                                    </p>
                                </div>

                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium text-black dark:text-white"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        placeholder="Member's full name"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="email"
                                        className="text-sm font-medium text-black dark:text-white"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="member@example.com"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="role"
                                        className="text-sm font-medium text-black dark:text-white"
                                    >
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        required
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    >
                                        <option className="text-black font-bold" value="">Select the team member's role</option>
                                        <option className="text-black">Admin</option>
                                        <option className="text-black">Handler</option>
                                    </select>
                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-black dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="Create a password"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium text-black dark:text-white"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        placeholder="Repeat password"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {state?.error && (<p className="text-red-600 text-sm font-normal">{state?.error}</p>)}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="mt-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
                                >
                                    {pending ? "Creating..." : "Create Member"}
                                </button>

                            </form>
                        </div>
                    </div>

                    {/* Right Side Panel */}
                    <div className="flex-1 dark:bg-white bg-black w-full lg:w-1/2 border-2 border-black dark:border-white rounded-xl hidden md:flex flex-col justify-between min-h-screen items-start m-10">
                        <div className="flex flex-col justify-between items-start h-full p-10">
                            <h1 className="text-white dark:text-black text-4xl md:text-6xl font-light">Add a New Member to Your Team
                            </h1>
                            <h1 className="text-white dark:text-black text-xl font-light">
                                &copy; SemaFacts {new Date().getFullYear()}. All rights reserved
                            </h1>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    )
}