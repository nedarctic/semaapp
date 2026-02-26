"use client";

import Link from "next/link";
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold">
          SemaFacts
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-blue-400 font-medium transition">
            Home
          </Link>

          {session && (
            <Link
              href="/dashboard"
              className="hover:text-blue-400 font-medium transition"
            >
              Dashboard
            </Link>
          )}

          {!session && (
            <Link
              href="/signin"
              className="hover:text-blue-400 font-medium transition"
            >
              Sign In
            </Link>
          )}

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="px-4 py-2 bg-dark dark:bg-white text-white dark:text-black font-bold text-sm rounded-full flex flex-col items-center justify-center"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-800 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-black px-6 pb-4 flex flex-col space-y-2">
          <Link
            href="/"
            className="hover:text-blue-400 font-medium transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {session && (
            <Link
              href="/dashboard"
              className="hover:text-blue-400 font-medium transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {!session && (
            <Link
              href="/signin"
              className="hover:text-blue-400 font-medium transition"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}

          {session && (
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut({ callbackUrl: "/signin" });
              }}
              className="text-left hover:text-yellow-400 font-medium transition"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}