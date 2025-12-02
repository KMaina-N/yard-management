"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format, isSameDay, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ProductAvailability } from "@/types/slot";

interface NextAvailableDayProps {
  date: string;
  products: ProductAvailability[];
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  first?: boolean;
}

// Inside your component

const NextAvailableDay: React.FC<NextAvailableDayProps> = ({
  date,
  products,
  selectedDate,
  onSelect,
  first,
}) => {
  const dayOfWeek = getDay(new Date(date)); // 0 = Sunday, 6 = Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return null; // Skip rendering weekends
  }

  const isSelected = selectedDate && isSameDay(selectedDate, new Date(date));

  return (
    <Button
      variant="outline"
      className={cn(
        "w-full h-auto my-2 p-4 rounded-xl border-2 flex flex-col items-start justify-between shadow-lg",
        isSelected
          ? "border-blue-500 "
          : "hover:shadow-xl hover:border-blue-300"
      )}
      onClick={() => onSelect(new Date(date))}
    >
      <div className="flex w-full justify-between items-center mb-3">
        <div className="flex flex-col items-start">
          <span className="text-base font-bold">
            {format(new Date(date), "EEE, MMM d")}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), "EEEE")}
          </span>
        </div>
        {first && (
          <Badge className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold">
            First Open Slot
          </Badge>
        )}
      </div>

      <div className="w-full space-y-2">
        {products.map((p, i) => {
          const percentage =
            ((p.maxCapacity - p.remaining) / p.maxCapacity) * 100;
          return (
            <div key={i} className="flex flex-col w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium truncate">
                  {p.productTypeName}
                </span>
                <span
                  className={`text-xs font-bold ${
                    p.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.remaining}/{p.maxCapacity}
                </span>
              </div>
              <Progress
                value={Math.min(100, Math.max(0, percentage))}
                className="h-2 bg-gray-200"
              />
            </div>
          );
        })}
      </div>

      {/* <div className="mt-3 w-full flex justify-end">
        <Badge
          className={cn(
            "text-xs px-2 py-1 font-semibold",
            products.every((p) => p.available)
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          )}
        >
          {products.every((p) => p.available)
            ? "All Available"
            : "Partial Capacity"}
        </Badge>
      </div> */}
    </Button>
  );
};

export default NextAvailableDay;
