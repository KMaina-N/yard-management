"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TimeSlotButtonProps {
  time: string;
  status: "available" | "partial" | "full";
  selected: boolean;
  onSelect: (time: string) => void;
}

const TimeSlotButton: React.FC<TimeSlotButtonProps> = ({ time, status, selected, onSelect }) => {
  const getStatusColor = (status: "available" | "partial" | "full") => {
    switch (status) {
      case "full": return "bg-red-50 hover:bg-red-100 border-red-300 text-red-700";
      case "partial": return "bg-yellow-50 hover:bg-yellow-100 border-yellow-300 text-yellow-700";
      case "available": default: return "bg-green-50 hover:bg-green-100 border-green-300 text-green-700";
    }
  };

  return (
    <button
      onClick={() => status !== "full" && onSelect(time)}
      disabled={status === "full"}
      className={cn(
        "p-3 rounded-xl border-2 flex flex-col items-center justify-center min-h-[60px] transition font-semibold",
        getStatusColor(status),
        selected ? "ring-4 ring-primary ring-offset-2 scale-105 shadow-md" : "",
        status === "full" ? "opacity-50 cursor-not-allowed line-through" : "cursor-pointer"
      )}
    >
      <Clock className="w-4 h-4 mb-1" /> {time}
      <Badge variant="outline" className={cn("mt-1 text-xs px-2 py-0.5",
        status === "full" ? "bg-red-400 text-white" :
        status === "partial" ? "bg-yellow-400 text-black" :
        "bg-green-400 text-white"
      )}>
        {status === "full" ? "Full" : status === "partial" ? "Partial" : "Open"}
      </Badge>
    </button>
  );
};

export default TimeSlotButton;
