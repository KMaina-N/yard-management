"use client";

import { useState } from "react";
import { faker } from "@faker-js/faker";
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import BookingDialog from "./booking-dialog";
import { bg } from "date-fns/locale";
import { MonthYearPicker } from "./calendar-date-picker";

const statuses = [
  { id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
  { id: faker.string.uuid(), name: "In Review", color: "#FBBF24" },
  { id: faker.string.uuid(), name: "In Progress", color: "#3B82F6" },
  { id: faker.string.uuid(), name: "Done", color: "#10B981" },
];

const featuresBackgroundColors = [
  "bg-red-100/50",
  "bg-green-100/50",
  "bg-blue-100/50",
  "bg-yellow-100/50",
  "bg-purple-100/50",
  "bg-pink-100/50",
  "bg-indigo-100/50",
  "bg-gray-100/50",
  "bg-teal-100/50",
  "bg-cyan-100/50",
  "bg-slate-100/50",
];

const statusBgMap: Record<string, string> = {
  Pending: "bg-orange-300",
  "In Review": "bg-indigo-400",
  "In Progress": "bg-blue-400",
  Done: "bg-green-400",
  Cancelled: "bg-red-500",
  Confirmed: "bg-green-500",
  Completed: "bg-purple-500",
  "On Hold": "bg-orange-500",
  Rescheduled: "bg-gray-700",
};

interface CalendarViewProps {
  exampleFeatures: any[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

const CalendarView = ({
  exampleFeatures,
  selectedDate,
  onDateSelect,
}: CalendarViewProps) => {
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  console.log("SELECTED DATE IN CALENDAR VIEW:", selectedDate);

  return (
    <div className="w-full  mx-auto">
      {/* Header */}
      <div className="mb-1">
        {/* <h1 className="text-2xl font-bold text-gray-900">Bookings Calendar</h1>
        <p className="text-gray-600 mt-1">
          Overview of all bookings in a calendar view
        </p> */}
        {/* Collapsible Legend */}
        <details className="mt-1">
          <summary className="cursor-pointer font-medium text-gray-800 flex items-center gap-2">
            <span>Legend</span>
            <span className="text-xs text-gray-500">(Status Colors)</span>
          </summary>
          <div className="mt-0 grid grid-cols-2 gap-2">
            {Object.entries(statusBgMap).map(([status, bg]) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block w-4 h-4 rounded-full border border-gray-300",
                    bg
                  )}
                />
                <span className="text-sm text-gray-700">{status}</span>
              </div>
            ))}
          </div>
        </details>
      </div>
      {/* Calendar */}
      <div className="rounded-2xl border  border-gray-200 bg-white/70 backdrop-blur-lg shadow-sm transition hover:shadow-md">
        <CalendarProvider>
          <div className="flex flex-col md:flex-row justify-between items-center px-4 border-b border-gray-100 bg-gray-50/60">
            
            {/* <MonthYearPicker
              currentMonth={currentMonth}
              onMonthChange={(m) => {
                setCurrentMonth(m); // update the state in SwitchView
                onDateSelect(m); // trigger fetch/filter
              }}
            /> */}
            {/* {selectedDate} */}
          </div>

          <div className="px-4 py-2">
            <CalendarHeader className="text-sm text-gray-500 font-medium" />
          </div>

          <CalendarBody features={exampleFeatures}>
            {({ feature }) => (
              <div className="space-y-1 mb-2" key={feature.id}>
                <AnimatePresence>
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100/50",
                      statusBgMap[feature.status.name] || "bg-gray-200"
                    )}
                    onClick={() => setSelectedFeature(feature)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs  text-gray-800  group-hover:text-indigo-600">
                        {feature.name}
                      </h3>
                      {/* <Badge
                        variant="outline"
                        style={{
                          borderColor: feature.status.color,
                          color: feature.status.color,
                        }}
                        className="text-[10px] font-medium"
                      >
                        {feature.status.name}
                      </Badge> */}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </CalendarBody>
        </CalendarProvider>
      </div>

      <BookingDialog
        dialogOpen={!!selectedFeature}
        setDialogOpen={() => setSelectedFeature(null)}
        dialogData={selectedFeature}
      />
    </div>
  );
};

export default CalendarView;
