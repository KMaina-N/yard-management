import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Check, Package, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function DayCell({
  day,
  value,
  isSaved,
  disabled,
  invalid,
  onChange,
  onSave,
}: {
  day: Date;
  value?: number;
  isSaved?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  onChange: (val: number | null) => void;
  onSave: () => void;
}) {
  const [local, setLocal] = useState(value ?? "");

  // Keep local in sync if value prop changes
  useEffect(() => setLocal(value ?? ""), [value]);

  const commit = () => {
    const v = local === "" ? null : parseInt(String(local));
    onChange(v);
  };

  // Derived state for whether the cell was changed
  const isChanged = local !== (value ?? "");

  return (
    <div
      className={cn(
        "flex flex-col p-2 border-r border-t min-h-[110px]",
        disabled && "opacity-50 pointer-events-none",
        isSaved ? "border-green-500 bg-green-100" : "border-border bg-card",
        isChanged && "border-yellow-500 bg-yellow-100"
      )}
    >

      <div className="flex justify-center">
        <div>
        <div className="flex items-center justify-center">
            <div className="text-lg font-semibold text-center">{format(day, "d")}</div>
        </div>
          {/* <div className="text-xs text-muted-foreground">
            {format(day, "EEE")}
          </div> */}
        </div>
        {isSaved && (
          <div className="rounded-full bg-success p-1">
            <Check className="w-4 h-4 text-green-500" />
          </div>
        )}
      </div>

      <div className="justify-center items-center flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="w-3 h-3" /> Capacity
          {invalid && <Badge variant="destructive">exceeds</Badge>}
        </div>
        <div className="flex gap-2 items-center mt-1">
          <Input
            type="number"
            min={0}
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && (commit(), onSave())}
            className="h-8 text-center"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
