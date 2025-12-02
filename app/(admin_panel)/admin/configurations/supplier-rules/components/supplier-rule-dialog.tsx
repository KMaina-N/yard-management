"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { SupplierRule } from "@/types/supplier-rules";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SelectSupplier from "./select-suppliers";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function SupplierRuleDialog({
  open,
  setOpen,
  form,
  setForm,
  editingRule,
  handleSave,
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingRule ? "Edit Supplier Rule" : "Add Supplier Rule"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {/* <Input placeholder="Supplier Name" value={form.supplierName} onChange={(e) => setForm({ ...form, supplierName: e.target.value })} /> */}
          <SelectSupplier
            value={form.supplierName}
            onChange={(value: string) =>
              setForm({ ...form, supplierName: value })
            }
          />
          <Input
            placeholder="Delivery Email"
            value={form.deliveryEmail}
            onChange={(e) =>
              setForm({ ...form, deliveryEmail: e.target.value })
            }
            type="email"
          />

          <Select
            value={form.day}
            onValueChange={(day) => setForm({ ...form, day })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Capacity"
            value={form.allocatedCapacity}
            onChange={(e) =>
              setForm({ ...form, allocatedCapacity: Number(e.target.value) })
            }
          />

          <Input
            type="number"
            placeholder="Tolerance"
            value={form.tolerance}
            onChange={(e) =>
              setForm({ ...form, tolerance: Number(e.target.value) })
            }
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>{editingRule ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
