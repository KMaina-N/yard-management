"use client";

import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearPickerProps {
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  currentMonth,
  onMonthChange,
}) => {
  const changeMonth = (direction: "prev" | "next") => {
    onMonthChange(
      direction === "prev" ? subMonths(currentMonth, 1) : addMonths(currentMonth, 1)
    );
  };

  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm">
      {/* Previous */}
      <button
        onClick={() => changeMonth("prev")}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
        title="Previous Month"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Label */}
      <span className="font-semibold text-lg tracking-tight">
        {format(currentMonth, "MMMM yyyy")}
      </span>

      <button
        onClick={() => changeMonth("next")}
        className="p-2 rounded-lg hover:bg-gray-100 transition"
        title="Next Month"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
