import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Lato,
  Badeen_Display,
  Karla,
} from "next/font/google";
import "../../globals.css";
import ClientAdminRoot from "./client-root"; // client wrapper for Navbar/Toaster
import { AppHeader } from "@/components/app-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const latoFont = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const karlaFont = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Admin Panel - SlotWise Yard Management System",
  description: "A comprehensive solution for yard management",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${karlaFont.className} ${geistSans.variable} ${geistMono.variable} bg-background relative min-h-screen overflow-auto antialiased`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <main className="flex-1 p-4 md:p-6"><ClientAdminRoot>{children}</ClientAdminRoot></main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
