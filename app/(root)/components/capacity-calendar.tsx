"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isBefore,
  startOfDay,
  addDays,
  getDay,
} from "date-fns";
import clsx from "clsx";
import { getCapacityConstraints } from "@/app/actions/root/create-boooking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getSession } from "@/lib/authentication";

interface GoodsItem {
  type: string;
  quantities: number;
}

interface AvailabilityInfo {
  requestedQty: number;
  currentlyBooked: number;
  available: boolean;
  remaining: number | null;
  maxCapacity?: number | null;
  message?: string;
}

interface CustomDateSelectorProps {
  goods: GoodsItem[];
  bookingData: any[];
  onDateSelect: (date: Date, availability: AvailabilityInfo | null) => void;
  onBack?: () => void;
  version?: number;
}

export default function CustomDateSelector({
  goods,
  bookingData,
  onDateSelect,
  onBack,
  version
}: CustomDateSelectorProps) {
  const today = startOfDay(new Date());
  const maxFutureDate = addDays(today, 60);

  const [currentMonth, setCurrentMonth] = useState(today);
  const [availability, setAvailability] = useState<
    Record<string, AvailabilityInfo[]>
  >({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const productTypeIds = goods.map((g) => g.type);
      const data = await getCapacityConstraints(productTypeIds, bookingData);
      setAvailability(data.availability || {});
    } catch (err) {
      console.error("Error fetching availability:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchAvailability();
}, [currentMonth, version]);

  const daysInMonth = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth]
  );

  const isWeekend = (date: Date) => {
    const dayOfWeek = getDay(date);
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isSelectable = (date: Date) => {
    const iso = format(date, "yyyy-MM-dd");
    const info = availability[iso]?.[0] || null;

    if (!info || info.remaining === null) return false;
    if (isBefore(date, today) || isBefore(maxFutureDate, date)) return false;
    if (isWeekend(date)) return false;

    // return info.available || (info.remaining !== null && info.remaining > 0);
    return info.available;
  };

  const getStatusIcon = (
    info: AvailabilityInfo | null,
    isSelected: boolean,
    isPast: boolean
  ) => {
    const iconClass = isSelected ? "text-white h-5 w-5" : "h-5 w-5";

    if (isPast || !info || info.remaining === null) {
      // Past or unscheduled → show MinusCircle
      return <MinusCircle className={clsx(iconClass, "text-gray-300")} />;
    }

    if (!info.available)
      return <XCircle className={clsx(iconClass, "text-red-500")} />;

    return <CheckCircle className={clsx(iconClass, "text-green-500")} />;
  };

  const handleSelect = (date: Date) => {
    if (!isSelectable(date)) return;
    setSelectedDate(date);
    const iso = format(date, "yyyy-MM-dd");
    onDateSelect(date, availability[iso]?.[0] || null);
  };

  const leadingEmptyDays = useMemo(() => {
    const firstDayOfMonth = getDay(startOfMonth(currentMonth));
    return Array.from({ length: firstDayOfMonth });
  }, [currentMonth]);

  return (
    <div className="p-6 rounded-xl w-full max-w-3xl bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {onBack ? (
          <Button size="icon" variant="outline" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10" />
        )}
        <div className="flex justify-between items-center mb-2 w-full">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-bold text-lg text-gray-700">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="w-10" />
      </div>

      <div className="border">
        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold border-b py-2 text-gray-500">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 mt-2">
          {leadingEmptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}

          {daysInMonth.map((day) => {
            const iso = format(day, "yyyy-MM-dd");
            const info = availability[iso]?.[0] || null;

            const isPast = isBefore(day, today); // yesterday and before
            const isBeyondMax = isBefore(maxFutureDate, day);
            const isWeekendDay = isWeekend(day);
            const isUnscheduled = !info || info.remaining === null;

            const selectable = isSelectable(day);
            const isSelected =
              selectedDate && format(selectedDate, "yyyy-MM-dd") === iso;

            const disabled =
              !selectable || isBeyondMax || isUnscheduled || isPast;

            let capacityPercent = 100;

            if (info?.maxCapacity && info.remaining !== null) {
              capacityPercent =
                ((info.requestedQty + info.currentlyBooked) /
                  info.maxCapacity) *
                100;
              if (!info.available) {
                capacityPercent = 100; // Force full if unavailable
              } else {
                capacityPercent = Math.min(100, capacityPercent);
              }
            } else {
              capacityPercent = 100;
            }

            console.log("capacity percentage: ", iso, capacityPercent);
            // Badge text for past dates is same as unscheduled
            let availableText = "Unavailable";
            if (!isPast) {
              if (isUnscheduled) availableText = "Unscheduled";
              else if (!info.available) availableText = "Fully Booked";
              else if (info.available) availableText = "Available";
            }

            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(day)}
                className={clsx(
                  "p-3 flex flex-col items-center rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2",
                  disabled
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-green-600 text-white"
                    : "bg-green-100 hover:bg-green-200 text-green-900"
                )}
              >
                <div className="flex items-center gap-1 font-semibold text-sm">
                  <span>{format(day, "d")}</span>
                  {!isWeekendDay && getStatusIcon(info, !!isSelected, isPast)}
                </div>

                {isWeekendDay && (
                  <Badge
                    variant="destructive"
                    className="text-[10px] mt-1 px-2 py-0.5 text-white"
                  >
                    Closed
                  </Badge>
                )}

                {!isWeekendDay && availableText && (
                  <Badge
                    className={clsx(
                      "text-[10px] mt-1 px-1 py-0.5 pointer-events-none",
                      isPast || isUnscheduled
                        ? "bg-gray-400 text-white"
                        : !info.available
                        ? "bg-red-600 text-white"
                        : "bg-green-500 text-white"
                    )}
                  >
                    {availableText}
                  </Badge>
                )}

               

              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <p className="text-sm text-gray-500 mt-4 animate-pulse">
          Loading availability...
        </p>
      )}
    </div>
  );
}
