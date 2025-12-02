"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Hammer } from "lucide-react";
import Link from "next/link";

const UnderConstruction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[86vh] bg-gray-50 p-6">
      
      {/* Icon */}
      <Hammer className="w-20 h-20 text-yellow-500 mb-6 animate-bounce" />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">
        Under Construction
      </h1>

      {/* Subtitle */}
      <p className="text-lg text-gray-600 text-center mb-8">
        This page is coming soon! Stay tuned.
      </p>

      {/* Go Home Button */}
      {/* <Link href="/">
        <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white">
          Go to Home
        </Button>
      </Link> */}
    </div>
  );
};

export default UnderConstruction;
