import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/navbar";
import { getSession } from "@/lib/authentication";

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


  return (
    <html lang="en">
      <body
        className={` ${latoFont.variable} antialiased `}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
