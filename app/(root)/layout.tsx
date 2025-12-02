import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getSession } from "@/lib/authentication";
import React from "react";
import SessionProvider from "./session-provider";

const latoFont = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SlotWise Yard Management System",
  description: "A comprehensive solution for yard management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = await getSession();
  session = JSON.parse(JSON.stringify(session));
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${latoFont.variable} antialiased `}>
        <Toaster richColors />
        <Navbar />
        {/* {children} */}
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
