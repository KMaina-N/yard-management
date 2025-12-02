"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  format,
  addDays,
  startOfWeek,
  getISOWeek,
  getYear,
  parseISO,
} from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Check, Package, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { WeekCard } from "./week-card";

/** Types */
export type DateKey = string; // YYYY-MM-DD
export type ISOWeek = string; // YYYY-WW

export interface Week {
  isoWeek: ISOWeek;
  weekStart: Date;
  weekEnd: Date;
  days: Date[];
}

const fetchData = async () => {
  // Placeholder for data fetching logic
  const res = await fetch("/api/delivery-schedules");
  return res.json();
};

/** Mock API */
const mockApi = {
  loadInitial: async () => ({ capacities: {}, weeklyTotals: {} }),
  saveDay: async (payload: { dateKey: DateKey; value: number | null }) => ({
    ok: true,
  }),
  saveWeek: async (payload: { isoWeek: ISOWeek; total: number | null }) => ({
    ok: true,
  }),
};

/** Utils */
export const dateKey = (d: Date | string) => format(new Date(d), "yyyy-MM-dd");
export const isoWeekKey = (d: Date) =>
  `${getYear(d)}-${String(getISOWeek(d)).padStart(2, "0")}`;
export const readableDate = (d: Date) => format(d, "MMM d, yyyy");

async function fetchSchedules(): Promise<
  {
    id: string;
    week: string;
    totalCapacity: number;
    tolerance?: number;
    days: { date: string; capacity: number; isSaved: boolean }[];
  }[]
> {
  const res = await fetch("/api/delivery-schedules");
  if (!res.ok) throw new Error("Failed to fetch delivery schedules");
  return res.json();
}

/** Hook */
export function useWeeklyRules() {
  const [capacities, setCapacities] = useState<Record<DateKey, number>>({});
  const [weeklyTotals, setWeeklyTotals] = useState<Record<ISOWeek, number>>({});
  const [savedSet, setSavedSet] = useState<Record<DateKey, boolean>>({});
  const [changedCells, setChangedCells] = useState<Record<DateKey, boolean>>(
    {}
  );

  const [unSaved, setUnSaved] = useState<Record<DateKey, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const schedules = await fetchSchedules();
        const caps: Record<DateKey, number> = {};
        const saved: Record<string, boolean> = {};
        const totals: Record<string, number> = {};

        schedules.forEach((s) => {
          totals[s.week] = s.totalCapacity ?? 0;
          s.days.forEach((d) => {
            const key = dateKey(d.date); // normalize here
            caps[key] = d.capacity;
            saved[key] = d.isSaved ?? false;
          });
        });

        setCapacities(caps);
        setWeeklyTotals(totals);
        setSavedSet(saved);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const getWeekUsed = (days: Date[]) =>
    days.reduce((sum, d) => sum + (capacities[dateKey(d)] ?? 0), 0);

  const saveDay = async (dKey: DateKey, day: Date) => {
    const payload = { dateKey: dKey, value: capacities[dKey] ?? 0 };
    // const res = await fetch("/api/delivery-schedules/day", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // if (res.ok) {
    //   setSavedSet((s) => ({ ...s, [dKey]: true }));
    //   toast.success(`Saved ${day.toDateString()}`);
    // }
    // setSavedSet((s) => ({ ...s, [dKey]: true }));
    toast.success(`Saved ${day.toDateString()}`);
  };

  const saveWeekTotal = async (isoWeek: ISOWeek, total: number | null) => {
    const payload = { isoWeek, total };
    // const res = await fetch("/api/delivery-schedules/week", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });
    // if (res.ok) {
    //   setWeeklyTotals((t) => ({ ...t, [isoWeek]: total ?? 0 }));
    //   toast.success(`Saved week ${isoWeek} total`);
    // }
    setWeeklyTotals((t) => ({ ...t, [isoWeek]: total ?? 0 }));
    toast.success(`Saved week ${isoWeek} total`);
  };

  return {
    capacities,
    setCapacities,
    weeklyTotals,
    setWeeklyTotals,
    savedSet,
    setSavedSet,
    getWeekUsed,
    saveDay,
    saveWeekTotal,
    changedCells,
    setChangedCells,
    unSaved,
    setUnSaved,
  };
}

/** WeekCard */

/** WeeklyRulesTable */
export function WeeklyRulesTable({ weeks }: { weeks: Week[] }) {
  const {
    capacities,
    setCapacities,
    weeklyTotals,
    setWeeklyTotals,
    savedSet,
    setSavedSet,
    getWeekUsed,
    saveDay,
    saveWeekTotal,
    changedCells,
    setChangedCells,
  } = useWeeklyRules();

  const handleDayChange = (key: DateKey, val: number | null) => {
    setCapacities((p) => {
      const next = { ...p };
      if (val === null) delete next[key];
      else next[key] = val;
      return next;
    });
    // setSavedSet((s) => ({ ...s, [key]: false })); // mark as unsaved
    setChangedCells((c) => ({ ...c, [key]: true })); // mark as changed
  };

  /** Bulk apply */
  const handleBulkApply = () => {
    const choice = prompt(
      "Apply bulk to 'week' or 'day'? Type 'week' or 'day':"
    );
    if (!choice) return;

    if (choice === "week") {
      const val = parseInt(prompt("Enter value to apply to all weeks:") ?? "");
      if (isNaN(val)) return;
      const nextTotals: Record<string, number> = {};
      weeks.forEach((w) => (nextTotals[w.isoWeek] = val));
      setWeeklyTotals(nextTotals);
      Object.entries(nextTotals).forEach(([isoWeek, val]) =>
        saveWeekTotal(isoWeek, val)
      );
      toast.success("Applied bulk to all weeks");
    } else if (choice === "day") {
      const missing = weeks.some((w) => !weeklyTotals[w.isoWeek]);
      if (missing)
        return toast.error(
          "Set weekly totals first before applying day-level bulk."
        );

      const val = parseInt(prompt("Enter value to apply to days:") ?? "");
      if (isNaN(val)) return;
      const distribution =
        prompt("Distribute 'equal' or 'proportional'?") ?? "equal";

      const nextCaps = { ...capacities };
      const nextSaved: Record<string, boolean> = { ...savedSet };

      weeks.forEach((w) => {
        const weekTotal = weeklyTotals[w.isoWeek] ?? 0;
        if (distribution === "equal") {
          const perDay = Math.floor(val / w.days.length);
          w.days.forEach((d) => {
            const key = dateKey(d);
            nextCaps[key] = perDay;
            nextSaved[key] = true;
          });
        } else {
          const used = getWeekUsed(w.days);
          w.days.forEach((d) => {
            const key = dateKey(d);
            const current = capacities[key] ?? 0;
            nextCaps[key] = Math.round((current / used) * val) || 0;
            nextSaved[key] = true;
          });
        }
      });

      setCapacities(nextCaps);
      setSavedSet(nextSaved);
      toast.success("Applied bulk to days");
    }
  };

  /** CSV download template */
  const downloadTemplate = () => {
    const rows = [
      [
        "Year-Week",
        "Week Start",
        "Week End",
        "Date",
        "Day",
        "Daily Capacity",
        "Weekly Total",
      ],
    ];
    weeks.forEach((w) =>
      w.days.forEach((d) =>
        rows.push([
          w.isoWeek,
          format(w.weekStart, "yyyy-MM-dd"),
          format(w.weekEnd, "yyyy-MM-dd"),
          format(d, "yyyy-MM-dd"),
          format(d, "EEEE"),
          "",
          "",
        ])
      )
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "weekly_template.csv";
    a.click();
  };

  /** CSV import */
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFile = async (f?: FileList | null) => {
    const file = f?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").slice(1);
    const nextCaps: Record<DateKey, number> = { ...capacities };
    const nextSaved: Record<string, boolean> = { ...savedSet };
    lines.forEach((line) => {
      const [isoWeek, weekStart, weekEnd, dateStr, dayName, dailyCap] =
        line.split(",");
      const val = parseInt(dailyCap ?? "");
      if (!isNaN(val)) {
        nextCaps[dateStr] = val;
        nextSaved[dateStr] = true;
      }
    });
    setCapacities(nextCaps);
    setSavedSet(nextSaved);
    toast.success("CSV imported successfully");
  };

  console.log({ capacities, weeklyTotals, savedSet });

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-3 items-center mb-3">
        <Button onClick={downloadTemplate}>
          <ArrowUp className="w-4 h-4" /> Download CSV Template
        </Button>
        <Button onClick={() => fileRef.current?.click()}>
          <ArrowDown className="w-4 h-4" /> Import CSV
        </Button>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept=".csv"
          onChange={(e) => handleFile(e.target.files)}
          title="Import CSV file"
          placeholder="Choose CSV file"
        />
        <Button onClick={handleBulkApply}>
          <Plus className="w-4 h-4" /> Bulk Apply
        </Button>
      </div> */}

      <div className="grid grid-cols-1 gap-4">
        {weeks.map((w) => (
          <WeekCard
            key={w.isoWeek}
            week={w}
            capacities={capacities}
            weeklyTotal={weeklyTotals[w.isoWeek]}
            savedSet={savedSet}
            getWeekUsed={getWeekUsed}
            onChangeDay={(k, v) => handleDayChange(k, v)}
            onSaveDay={(k) => saveDay(k, parseISO(k))}
            onChangeWeekTotal={(iso, v) => saveWeekTotal(iso, v)}
          />
        ))}
      </div>
    </div>
  );
}

/** Helper: build weeks for a month using ISO week */
export function buildWeeksForMonth(monthIndex: number, year: number): Week[] {
  const first = new Date(year, monthIndex, 1);
  let weekStart = startOfWeek(first, { weekStartsOn: 1 });
  const weeks: Week[] = [];
  let count = 0;

  while (count < 10) {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const isoWeek = isoWeekKey(weekStart);
    const weekEnd = days[6];
    weeks.push({ isoWeek, weekStart, weekEnd, days });
    weekStart = addDays(weekStart, 7);
    count++;
    if (
      weekStart.getMonth() > monthIndex &&
      days.every((d) => d.getMonth() !== monthIndex)
    )
      break;
  }

  return weeks;
}
