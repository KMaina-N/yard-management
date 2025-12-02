import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { DayCell } from "./day-cell";
import {
  DateKey,
  Week,
  ISOWeek,
  dateKey,
  useWeeklyRules,
} from "./weekly-rules-table";
import { cn } from "@/lib/utils";

export function WeekCard({
  week,
  capacities,
  weeklyTotal,
  getWeekUsed,
  savedSet,
  onChangeDay,
  onSaveDay,
  onChangeWeekTotal,
}: {
  week: Week;
  capacities: Record<DateKey, number>;
  weeklyTotal?: number;
  savedSet: Record<DateKey, boolean>;
  getWeekUsed: (days: Date[]) => number;
  onChangeDay: (dateKey: DateKey, value: number | null) => void;
  onSaveDay: (dateKey: DateKey) => void;
  onChangeWeekTotal: (isoWeek: ISOWeek, value: number | null) => void;
}) {
  const used = getWeekUsed(week.days);
  const { changedCells, setChangedCells, unSaved, setUnSaved } =
    useWeeklyRules();

  const remaining = (weeklyTotal ?? 0) - used;
  const handleSaveWeek = async () => {
    console.log("Week Data:", {
      isoWeek: week.isoWeek,
      weekStart: week.weekStart,
      weekEnd: week.weekEnd,
      days: week.days.map((d) => ({
        date: d,
        capacity: capacities[dateKey(d)],
      })),
      weeklyTotal,
    });

    const payload = {
      week: week.isoWeek,
      totalCapacity: weeklyTotal,
      days: week.days.map((d) => ({
        date: d,
        capacity: capacities[dateKey(d)],
        isSaved: savedSet[dateKey(d)] ?? false,
      })),
    };

    // only send payload whose days.capacity is defined
    payload.days = payload.days.filter(day => day.capacity !== undefined && day.capacity !== null);

    const response = await fetch("/api/delivery-schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      console.log("Week saved successfully");
    }
  };

  return (
    <div className="rounded border shadow-sm bg-white overflow-hidden">
      <div className="p-4 border-b flex justify-between items-start gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Week</div>
          <div className="text-2xl font-bold">{week.isoWeek.split("-")[1]}</div>
          <div className="text-xs text-muted-foreground">
            {format(week.weekStart, "MMM d")} -{" "}
            {format(week.weekEnd, "MMM d, yyyy")}
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Used</div>
            <div className="text-lg font-semibold">{used}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Remaining</div>
            <div className="text-lg font-semibold">{remaining}</div>
          </div>
          <Input
            type="number"
            min={0}
            value={weeklyTotal ?? undefined}
            placeholder="Weekly total"
            onChange={(e) => {
              const val =
                e.target.value === "" ? null : parseInt(e.target.value);
              onChangeWeekTotal(week.isoWeek, val);
            }}
            className="w-28 h-9"
          />
        </div>
      </div>

      <div className="flex">
        <div className=" grid grid-cols-1 sm:grid-cols-7 gap-0">
          {week.days.map((d) => {
            const key = dateKey(d);
            const day = d;
            const today = new Date();

            return (
                <div
                key={key}
                className={cn(
                  "justify-center p-2 border-r",
                  format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-black text-white"
                )}
                >
                <div className="text-center text-sm font-medium mb-1">
                  {format(day, "EEE")}
                </div>
                </div>
            );
          })}
          {week.days.map((d) => {
            const key = dateKey(d);
            const val = capacities[key];

            const exceeds =
              weeklyTotal !== undefined &&
              val + used - (capacities[key] ?? 0) > weeklyTotal;
            return (
              <DayCell
                key={key}
                day={d}
                value={val}
                disabled={!weeklyTotal}
                invalid={exceeds}
                isSaved={savedSet[key]}
                onChange={(v) => onChangeDay(key, v)}
                onSave={() => onSaveDay(key)}
              />
            );
          })}
        </div>
        <div className="justify-end items-center flex">
          <div className="text-xs text-muted-foreground p-4">
            <p>* Click below to save the entire week</p>
            <Button
              disabled={!weeklyTotal}
              onClick={handleSaveWeek}
              id={week.isoWeek}
            >
              Save Week
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
