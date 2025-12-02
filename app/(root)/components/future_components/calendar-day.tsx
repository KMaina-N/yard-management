"use client";

import React from "react";
import { format, isSameDay } from "date-fns";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DayInfo, ProductAvailability } from "@/types/slot";

interface CalendarDayProps {
  date: Date;
  info?: DayInfo;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (date: Date) => void;
  isWeekend?: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  info,
  isSelected,
  isDisabled,
  onSelect,
  isWeekend,
}) => {
  const getDayColor = () => {
    if (isDisabled)
      return "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400";
    if (!info) return "bg-white border border-gray-200";
    if (info.full) return "bg-red-100 line-through text-red-800 border-red-200";

    const minRatio = Math.min(
      ...info.products.map((p) => p.remaining / p.maxCapacity)
    );
    if (minRatio > 0.66) return "bg-green-100 text-green-800 border-green-300";
    if (minRatio > 0.33)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          onClick={() => !isDisabled && onSelect(date)}
          className={cn(
            "flex flex-col items-center p-2 h-20 rounded-xl transition relative overflow-hidden",
            getDayColor(),
            isSelected ? "ring-1 ring-primary ring-offset-2 shadow-2xl" : "",
            !isDisabled ? "cursor-pointer hover:shadow-lg" : "",
            !isWeekend ? "" : "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
          )}
        >
          <span className="font-bold text-sm">{format(date, "d")}</span>
          {isWeekend ? (
            <span className="text-xs text-red-500 mt-1 text-center">
                Warehouse closed
            </span>
          ) : (
            <div className="flex space-x-0.5 mt-1">
              {info?.products.map((p, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    p.available ? "bg-green-500" : "bg-red-500",
                    p.remaining === 0 ? "bg-red-500" : "bg-green-500"
                  )}
                />
              ))}
            </div>
          )}
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-primary absolute top-1 right-1" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        className={cn(
          "p-4 rounded-xl min-w-96 shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 max-w-xs",
          isWeekend ? "hidden" : ""
        )}
      >
        {/* Date */}
        <p className="font-semibold text-lg mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {format(date, "PPP")}
        </p>

        {/* Products */}
        <div className="space-y-2">
          {info?.products.map((p: ProductAvailability, i) => {
            
            const isAvailable = p.available && p.remaining > 0;
            return (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  isAvailable
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium"
                } transition-all duration-200`}
              >
                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="truncate">{p.productTypeName}</span>
                </div>
                <span className="text-xs font-semibold bg-white dark:bg-gray-800 px-2 py-0.5 rounded-full shadow-sm">
                  {isAvailable ? "Available capacity" : "Available capacity"} (
                  {p.remaining}/{p.maxCapacity})
                </span>
              </div>
            );
          })}
        </div>

        {!info && <p className="text-gray-500">Loading capacity...</p>}
      </TooltipContent>
    </Tooltip>
  );
};

export default CalendarDay;
