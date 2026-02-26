"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")

    const handleSignIn = async (e: React.SubmitEvent) => {

        e.preventDefault();

        const response = await signIn("credentials", {
            email,
            password,
            callbackUrl: "/dashboard",
            redirect: false
        });

        console.log("Sign in response:", response);

        if(response?.error){
            setError("Invalid email or password");
            console.log("Error:", error);
            return;
        }

        router.push(response?.url || "/dashboard");
    }

    return (
        <main className="min-h-screen w-full">
            <section className="flex flex-col dark:bg-black bg-white justify-center items-center min-h-screen">
                <div className="flex flex-row items-center justify-center gap-8 p-6 w-full">

                    {/* Left Side Panel */}
                    <div className="dark:bg-white bg-black w-full lg:w-1/2 border-2 border-black dark:border-white rounded-xl hidden md:flex flex-col justify-between h-screen items-start m-10">
                        <div className="flex flex-col justify-between items-start min-h-screen p-10">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-white dark:text-black text-4xl md:text-6xl font-light">
                                    Welcome Back
                                </h1>
                                <p className="text-white/80 dark:text-black/80 text-base md:text-lg max-w-md leading-relaxed">
                                    Sign back in to continue managing whistleblowing incidents from your dashboard.
                                </p>
                            </div>

                            <h1 className="text-white dark:text-black text-xl font-light">
                                SemaFacts {new Date().getFullYear()}. All rights reserved
                            </h1>
                        </div>
                    </div>

                    {/* Right Side Form */}
                    <div className="flex flex-col w-full lg:w-1/2 justify-center items-start h-screen">
                        <div className="flex flex-col justify-start items-start w-full p-10">
                            <form onSubmit={handleSignIn} className="w-full flex flex-col gap-6 bg-gray-100 dark:bg-black p-8 rounded-xl shadow-md">

                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-semibold text-black dark:text-white">
                                        Sign In
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Enter your credentials to continue
                                    </p>
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
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
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
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Your password"
                                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                {/* Forgot password */}
                                <div className="flex justify-end text-sm">
                                    <a
                                        href="/forgot-password"
                                        className="text-black dark:text-white hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>

                                {error && (<p className="text-red-600 text-sm font-normal">{error}</p>)}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="mt-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
                                >
                                    Sign In
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}