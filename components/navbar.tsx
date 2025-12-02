import { LogIn, Shield, UserPlus, Warehouse } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import AuthButtons from "./auth-buttons";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="border-b border-border/50  backdrop-blur-md sticky top-0 z-50 shadow-[var(--shadow-card)]">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <div className="bg-gradient-to-br from-blue-500 to-green-500 via-20% p-3 rounded-xl shadow-[var(--shadow-elegant)]">
            <Warehouse className="w-7 h-7 text-primary-foreground" />
          </div> */}
          <Link href="/">
            <Image
              src="/logo_truck.png"
              alt="Logo"
              width={150}
              height={40}
              className="w-18"
            />
          </Link>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Tokić Yard Management System
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Safety in motion
            </p>
          </div>
        </div>
        <AuthButtons />
      </div>
    </header>
  );
};

export default Navbar;
