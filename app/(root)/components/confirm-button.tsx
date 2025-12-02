"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import React from "react";
import { format } from "date-fns";

interface ConfirmButtonProps {
  selectedDate: Date | null;
  selectedTime: string;
  onConfirm: (date: Date, time: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  selectedDate,
  selectedTime,
  onConfirm,
  loading = false,
  disabled = false,
}) => {
  const isDisabled = !selectedDate || disabled || loading;

  return (
    <Button
      onClick={() =>
        selectedDate && selectedTime && onConfirm(selectedDate, "")
      }
      disabled={isDisabled}
      variant="default" // ShadCN default variant
      className={`
        w-full py-3 flex justify-center items-center space-x-2
        rounded-lg font-semibold text-sm transition-transform duration-200
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        relative overflow-hidden
      `}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center rounded-lg z-10">
          <Loader2 className="w-5 h-5 animate-spin text-gray-700" />
        </div>
      )}

      <CheckCircle2
        className={`
          w-5 h-5 transition-transform duration-200
          ${!isDisabled && !loading ? "hover:scale-110 hover:-rotate-12" : ""}
          ${isDisabled ? "opacity-50" : "text-gray-700"}
        `}
      />
      <span className="relative z-20">
        Confirm
        {/* Optional: show date/time */}
        {/* {selectedDate && selectedTime && ` (${format(selectedDate, "MMM d")} at ${selectedTime})`} */}
      </span>
    </Button>
  );
};

export default ConfirmButton;
