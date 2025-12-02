"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Warehouse {
  id: string;
  name: string;
}

interface UpdateBookingProps {
  warehouses: Warehouse[];
  selectedWarehouse?: string;
  setSelectedWarehouse?: (warehouseId: string) => void;
  onConfirm: (warehouseId: string) => void;
}

const UpdateBooking: React.FC<UpdateBookingProps> = ({ warehouses, selectedWarehouse, setSelectedWarehouse, onConfirm }) => {
  const [internalSelectedWarehouse, setInternalSelectedWarehouse] = useState<string>("");

  const handleConfirm = () => {
    if (!selectedWarehouse) return;
    onConfirm(selectedWarehouse);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase">Select Warehouse</h3>

      <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
        <SelectTrigger className="w-full bg-gray-50">
          <SelectValue placeholder="Select a warehouse" />
        </SelectTrigger>
        <SelectContent>
          {warehouses.map((w) => (
            <SelectItem key={w.id} value={w.id}>
              {w.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* <Button
        className="w-full"
        onClick={handleConfirm}
        disabled={!selectedWarehouse}
      >
        Confirm
      </Button> */}
    </div>
  );
};

export default UpdateBooking;
