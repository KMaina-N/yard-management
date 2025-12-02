'use client'
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateRangePickerProps {
  dateFrom: string | null;
  dateTo: string | null;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
}

export function DateRangePicker({ dateFrom, dateTo, setDateFrom, setDateTo }: DateRangePickerProps) {
  return (
    <div className="flex gap-4">
      {/* Start Date */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700">Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-36 text-left">
              {dateFrom ? format(new Date(dateFrom), "MMM dd, yyyy") : "Select start date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateFrom ? new Date(dateFrom) : undefined}
              onSelect={(date) => {
                if (date) setDateFrom(date.toISOString());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-700">End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-36 text-left">
              {dateTo ? format(new Date(dateTo), "MMM dd, yyyy") : "Select end date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateTo ? new Date(dateTo) : undefined}
              onSelect={(date) => {
                if (date) setDateTo(date.toISOString());
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
