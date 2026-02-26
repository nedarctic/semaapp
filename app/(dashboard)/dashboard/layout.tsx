import type { Metadata } from "next";
import { dmSans } from "@/lib/fonts";
import { Footer } from "@/components/Footer";
import { SideNav } from "@/components/SideNav";
import "../../globals.css";

export const metadata: Metadata = {
  title: "SemaFacts",
  description: "Whistleblowing Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${dmSans.className} flex h-screen w-full overflow-hidden`}>
      <div className="flex items-center w-3/12 h-screen pl-4 pt-4 pb-4">
        <SideNav />
      </div>
      <div className="flex-1 w-full overflow-y-auto">
        {children}
        <Footer />
      </div>
    </div>
  );
}