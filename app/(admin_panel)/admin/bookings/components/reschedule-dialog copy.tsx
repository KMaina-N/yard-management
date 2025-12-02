"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format, isBefore, startOfDay, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface RescheduleDialogProps {
  bookingId: string;
  currentDate: Date;
  onReschedule?: (date: Date) => Promise<void>;
  minDate?: Date;
  disabled?: boolean;
  payload?: any;
}

interface AvailabilityEntry {
  requestedQty: number;
  currentlyBooked: number;
  available: boolean;
  remaining: number | null;
  maxCapacity: number | null;
  message: string;
}

export const RescheduleDialog = ({
  bookingId,
  currentDate,
  onReschedule,
  minDate,
  disabled = false,
  payload,
}: RescheduleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availability, setAvailability] = useState<
    Record<string, AvailabilityEntry[]>
  >({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const minBookingDate = minDate || startOfDay(new Date());

  // Fetch availability from API
  useEffect(() => {
    if (!open || !payload) return;

    const fetchAvailability = async () => {
      try {
        setIsLoadingAvailability(true);
        setError(null);
        const res = await fetch("/api/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.availability) {
          setAvailability(data.availability);
        } else {
          setError("Failed to load availability data");
        }
      } catch (err) {
        console.error("Failed to fetch availability", err);
        setError("Unable to fetch availability. Please try again.");
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [open, payload]);

  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const apiEntry = availability[dateStr];
    return (
      isBefore(date, minBookingDate) ||
      (apiEntry ? apiEntry.some((a) => !a.available) : isLoadingAvailability)
    );
  };

  const handleReschedule = async () => {
    if (!selectedDate) {
      setError("Please select a date");
      return;
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const apiEntry = availability[dateStr];
    if (apiEntry && apiEntry.some((a) => !a.available)) {
      setError(apiEntry.map((a) => a.message).join(", "));
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (onReschedule) await onReschedule(selectedDate);
      setSuccessMessage(`Booking rescheduled to ${format(selectedDate, "MMM d, yyyy")}`);
      setTimeout(() => {
        setOpen(false);
        setSelectedDate(undefined);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reschedule booking"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    selectedDate && selectedDate.getTime() !== currentDate.getTime();

  const getAvailabilityStats = () => {
    const entries = Object.values(availability).flat();
    const available = entries.filter((a) => a.available).length;
    const total = Object.keys(availability).length;
    return { available, total };
  };

  const stats = getAvailabilityStats();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
        >
          <Clock className="h-4 w-4" />
          Reschedule
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl rounded-lg p-0 overflow-hidden shadow-xl border border-gray-200">
        <DialogHeader className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900">
                  Reschedule Booking
                </DialogTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Current: {format(currentDate, "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Availability Loading State */}
          {isLoadingAvailability && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Fetching availability...
                </p>
                <p className="text-xs text-blue-700">
                  Checking dates and capacity
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-lg border border-green-100 bg-green-50 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-900">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-100 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Availability Stats */}
          {!isLoadingAvailability && stats.total > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Available Dates
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.available}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  out of {stats.total} dates
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Booking
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {format(currentDate, "MMM d")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(currentDate, { addSuffix: true })}
                </p>
              </div>
            </div>
          )}

          {/* Calendar */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">
              Select New Date
            </Label>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              {isLoadingAvailability ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Loading calendar...</p>
                  </div>
                </div>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date) {
                      setError("Date not available");
                      return;
                    }
                    const dateStr = format(date, "yyyy-MM-dd");
                    const apiEntry = availability[dateStr];
                    if (!apiEntry || apiEntry.some((a) => !a.available)) {
                      setError(
                        apiEntry?.map((a) => a.message).join(", ") ||
                          "Date not available"
                      );
                      return;
                    }
                    setError(null);
                    setSelectedDate(date);
                  }}
                  disabled={isDateDisabled || isLoadingAvailability}
                  modifiers={{
                    unavailable: Object.keys(availability)
                      .map((dateStr) => {
                        const entries = availability[dateStr];
                        return entries.some((a) => !a.available)
                          ? new Date(dateStr)
                          : null;
                      })
                      .filter(Boolean) as Date[],
                    available: Object.keys(availability)
                      .map((dateStr) => {
                        const entries = availability[dateStr];
                        return entries.every((a) => a.available)
                          ? new Date(dateStr)
                          : null;
                      })
                      .filter(Boolean) as Date[],
                    disabled: Object.keys(availability)
                      .map((dateStr) => new Date(dateStr))
                      .filter((d) => isBefore(d, minBookingDate)) as Date[],
                    missing: Array.from({ length: 365 })
                      .map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const dateStr = format(d, "yyyy-MM-dd");
                        return availability[dateStr] ? null : d;
                      })
                      .filter(Boolean) as Date[],
                  }}
                  modifiersClassNames={{
                    unavailable:
                      "bg-red-100 text-red-600 line-through cursor-not-allowed rounded-lg hover:bg-red-200",
                    disabled:
                      "bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg",
                    missing:
                      "bg-gray-50 text-gray-300 cursor-not-allowed rounded-lg",
                    available:
                      "bg-gradient-to-b from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600",
                  }}
                  className="w-full"
                  // disabled={isLoadingAvailability}
                />
              )}
            </div>
          </div>

          {/* Changes Preview */}
          {hasChanges && !isLoadingAvailability && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-3">
                    Changes Preview
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">Current Date</span>
                      <span className="text-sm font-semibold text-blue-900">
                        {format(currentDate, "EEEE, MMM d")}
                      </span>
                    </div>
                    <div className="h-px bg-blue-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-800">New Date</span>
                      <span className="text-sm font-semibold text-blue-900">
                        {selectedDate
                          ? format(selectedDate, "EEEE, MMM d")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend */}
          {!isLoadingAvailability && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Legend
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-b from-blue-400 to-blue-500" />
                  <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-100 border border-red-300 line-through" />
                  <span className="text-gray-600">Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-100" />
                  <span className="text-gray-600">No data</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedDate(undefined);
              setError(null);
            }}
            disabled={isLoading || isLoadingAvailability}
            className="text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={!hasChanges || isLoading || isLoadingAvailability}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Rescheduling...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Confirm Reschedule
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleDialog;