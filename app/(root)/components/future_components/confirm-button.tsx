import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import React from "react";

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
      className={`
        w-full mt-4 p-4 text-lg font-bold text-white rounded-xl shadow-2xl
        relative overflow-hidden transform transition-all duration-300
        ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:scale-105"}
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary before:to-blue-600
        before:transition-all before:duration-500 before:opacity-70
        hover:before:opacity-100
      `}
      onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
      disabled={isDisabled}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl z-10">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        </div>
      )}

      <div className="flex items-center justify-center space-x-3 relative z-20">
        <CheckCircle2
          className={`w-6 h-6 transition-transform duration-300 ${
            !isDisabled ? "hover:rotate-12 hover:scale-110" : ""
          }`}
        />
        <span className="truncate">
          Confirm Delivery Slot{" "}
          {selectedDate && selectedTime && `(${format(selectedDate, "MMM d")} at ${selectedTime})`}
        </span>
      </div>

      {/* Subtle hover shine animation */}
      <span className="absolute -top-20 -left-40 w-40 h-40 bg-white/20 rounded-full animate-ping-slow pointer-events-none" />
    </Button>
  );
};

export default ConfirmButton;
