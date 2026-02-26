import type { Metadata } from "next";
import { dmSans } from "@/lib/fonts";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SemaFacts",
  description: "whistleblowing Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} antialiased`}
      >
        <Providers>
        {children}
        </Providers>
      </body>
    </html>
  );
}
