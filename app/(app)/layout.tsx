import type { Metadata } from "next";
import { dmSans } from "@/lib/fonts";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "../globals.css";

export const metadata: Metadata = {
  title: "SemaFacts",
  description: "whistleblowing Management Platform",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${dmSans.className}`}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
