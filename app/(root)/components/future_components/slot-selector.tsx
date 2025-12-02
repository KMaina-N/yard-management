"use client";

import React, { useEffect, useState } from "react";
import {
  format,
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import CalendarDay from "./calendar-day";
import TimeSlotButton from "./time-slot-button";
import NextAvailableDay from "./next-available-day";
import { ProductAvailability, DayInfo } from "@/types/slot";
import { cn } from "@/lib/utils";
import ConfirmButton from "./confirm-button";
import SlotSummary from "./slot-summary";
import { getCapacityConstraints } from "@/app/actions/root/create-boooking";

const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
];

interface SlotSelectorProps {
  productTypeIds: any[];
  bookingData: any;
  onBack: () => void;
  onConfirm: (date: Date, time: string) => void;
}

// Mock function for slot status (replace with API call if you have time-specific data)
const getTimeSlotStatus = (
  time: string,
  date: Date
): "available" | "partial" | "full" => {
  const hour = parseInt(time.split(":")[0]);
  if (date.getDay() === 0 || date.getDay() === 6) return "available";
  if (hour < 9) return "full";
  if (hour === 10 && date.getDate() % 2 === 0) return "partial";
  return "available";
};

const SlotSelector: React.FC<SlotSelectorProps> = ({
  productTypeIds,
  bookingData,
  onBack,
  onConfirm,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarInfo, setCalendarInfo] = useState<Record<string, DayInfo>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [nextAvailableDays, setNextAvailableDays] = useState<
    { date: string; products: ProductAvailability[] }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const startDate = startOfWeek(startOfMonth(currentMonth), {
    weekStartsOn: 1,
  });
  const endDate = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Correct generateCalendar function
  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }); // Sunday
    const days: Date[] = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const isDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const info = calendarInfo[dateStr];
    const isPast = date < new Date() && !isSameDay(date, new Date());
     const isWeekend = date.getDay() === 0 || date.getDay() === 6; 
    return isPast || info?.full
  };

  const isWeekend = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  }
  const handleDateSelect = (date: Date) => {
    if (isDisabled(date)) return;
    if (selectedDate && isSameDay(selectedDate, date)) {
      setSelectedDate(null);
      setSelectedTime("");
    } else {
      setSelectedDate(date);
      setSelectedTime("");
    }
  };

  const fetchAvailability = async () => {
    setLoading(true);
    setSelectedDate(null);
    setSelectedTime("");

    try {
      // const res = await fetch("/api/bookings/daily-capacity", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ productTypeIds, bookingData }),
      // });
      // const data = await res.json();
      const data = await getCapacityConstraints(productTypeIds, bookingData);

      if (!data.success || !data.availability)
        throw new Error("Failed to fetch availability.");

      const availability: Record<string, DayInfo> = {};
      const nextDays: typeof nextAvailableDays = [];

      for (const [dateStr, products] of Object.entries(data.availability)) {
        const prods = (products as ProductAvailability[]).map((p, i) => {
          const inputProduct = productTypeIds.find(
            (item) =>
              item.id === p.productTypeName || item.name === p.productTypeName
          );
          return {
            ...p,
            productTypeName:
              inputProduct?.name || p.productTypeName || `Product ${i + 1}`,
          };
        });

        const full = prods.some((p) => !p.available);
        const messages = prods
          .filter((p) => !p.available)
          .map((p) => `${p.message} (${p.remaining}/${p.maxCapacity})`);

        availability[dateStr] = { full, messages, products: prods };
        if (!full && new Date(dateStr) >= new Date())
          nextDays.push({ date: dateStr, products: prods });
      }

      setCalendarInfo(availability);
      setNextAvailableDays(
        nextDays
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          .slice(0, 10)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [productTypeIds, bookingData]);

  const productsSummary = productTypeIds
    .filter((pt) => bookingData.goods.some((g: any) => g.type === pt.id))
    .map((pt) => {
      const matchedGood = bookingData.goods.find((g: any) => g.type === pt.id);

      // If no quantities, default to 0
      const quantity = matchedGood?.quantities ?? 0;

      return {
        id: pt.id,
        name: pt.name,
        requestedQuantity: quantity,
      };
    });
  console.log("PRODUCT TYPES in SlotSelector:", productsSummary);

  return (
    <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 mb-10 mt-10">
      <div className="lg:col-span-2 space-y-6">
        {/* Calendar */}
        <Card className="shadow-xl">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Select Delivery Date</CardTitle>
              <CardDescription>
                Availability for your selected products
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <Button
                variant="ghost"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-xl font-bold">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <Button
                variant="ghost"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            {loading ? (
              <div className="text-center py-4 flex items-center justify-center text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Checking availability...
              </div>
            ): (
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="text-center font-semibold text-sm text-gray-600"
                >
                  {d}
                </div>
              ))}
              {generateCalendar().map((date) => (
                <CalendarDay
                  key={format(date, "yyyy-MM-dd")}
                  date={date}
                  info={calendarInfo[format(date, "yyyy-MM-dd")]}
                  isSelected={
                    selectedDate ? isSameDay(selectedDate, date) : false
                  }
                  isDisabled={isDisabled(date)}
                  onSelect={handleDateSelect}
                  isWeekend={isWeekend(date)}
                />
              ))}
            </div>
          )}
          </CardContent>
        </Card>

        {/* Time Slots */}
        {/* {selectedDate && (
          <Card className="shadow-xl">
            <CardHeader><CardTitle>Select Delivery Time for {format(selectedDate,"PPP")}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {TIME_SLOTS.map(time => {
                  const status = getTimeSlotStatus(time, selectedDate);
                  return (
                    <TimeSlotButton
                      key={time}
                      time={time}
                      status={status}
                      selected={selectedTime === time}
                      onSelect={setSelectedTime}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* short summary */}
        <SlotSummary
          selectedDate={selectedDate}
          productsSummary={productsSummary}
        />

        {/* Confirm Button */}
        {selectedDate && (
          <Button
            className="w-full mt-4 p-4 text-md  text-white font-bold shadow-xl"
            onClick={() => onConfirm(selectedDate, selectedTime)}
          >
            <CheckCircle2 className="mr-3 w-6 h-6" /> Confirm Delivery Slot (
            {format(selectedDate, "MMM d")})
          </Button>
        )}
      </div>

      {/* Next Available Days Panel */}
      <div className="space-y-4">
        <Card className="lg:sticky lg:top-6 h-fit shadow-xl">
          <CardHeader>
            <CardTitle>Quick Availability Check</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4 space-y-4">
              {loading && (
                <div className="text-center py-8 flex flex-col items-center text-sm antialiased">
                  <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                  Fetching next available days...
                </div>
              )}
              {!loading && nextAvailableDays.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No near-future available days found.
                </div>
              )}
              {!loading &&
                nextAvailableDays.map((day, idx) => (
                  <NextAvailableDay
                    key={day.date}
                    date={day.date}
                    products={day.products}
                    selectedDate={selectedDate || undefined}
                    onSelect={handleDateSelect}
                    first={idx === 0}
                  />
                ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SlotSelector;
