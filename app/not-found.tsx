"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import './globals.css'

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      
      {/* Icon */}
      <AlertCircle className="w-20 h-20 text-red-500 mb-6" />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">
        404 - Page Not Found
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 text-center mb-8">
        Oops! The page you are looking for does not exist.
      </p>

      {/* Go Home Button */}
      <Link href="/">
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          Go to Home
        </Button>
      </Link>
    </div>
  );
};

export default PageNotFound;

// import NotFound from "@/components/ui/not-found";
// import React from "react";
// import './globals.css'
// const PageNotFound = () => {
//   return (
//     <NotFound animate={true}/>
//   )
// }
// export default PageNotFound;