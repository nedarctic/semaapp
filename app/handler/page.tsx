"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function HandlerLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("handler-access", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      // Intentionally vague for security
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Successful login → redirect to tracking page
    window.location.href = "/handler/incidents";
  }

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* Header */}
        <header className="space-y-4">
          <h1 className="text-black dark:text-white text-3xl md:text-5xl font-light">
            Manage an incident
          </h1>
          <p className="text-black/70 dark:text-white/70 text-base leading-relaxed">
            Enter your email and password to continue managing your assigned report.
          </p>
        </header>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. you@email.com"
              required
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-black dark:text-white font-semibold text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full border-2 border-black dark:border-white rounded-xl px-4 py-3 bg-transparent text-black dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}