"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Package, Hash } from "lucide-react";

interface ProductSummary {
  id: string;
  name: string;
  requestedQuantity: number;
}

interface SlotSummaryProps {
  selectedDate: Date | null;
  selectedTime?: string;
  productsSummary: ProductSummary[];
  onQuantityChange?: (id: string, qty: number) => void;
}

const SlotSummary: React.FC<SlotSummaryProps> = ({
  selectedDate,
  productsSummary,
  onQuantityChange,
}) => {

  const totalItems = productsSummary.reduce((acc, p) => acc + p.requestedQuantity, 0);

  return (
    <Card className="space-y-1 rounded-xl border-gray-200">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="w-5 h-5 text-primary" />
          Delivery Slot Summary
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Date:</span>
          {selectedDate ? format(selectedDate, "PPP") : <span className="text-red-500">Not selected</span>}
        </div>
      </CardContent>

      <CardContent className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Package className="w-4 h-4 text-green-600" />
          Requested Products
        </div>

        {productsSummary.map((p) => (
          <div key={p.id} className="flex justify-between items-center p-2 border rounded-md">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-gray-500" />
              {p.name}
            </div>
            {/* <Input
              type="number"
              className="w-20 text-right"
              value={p.requestedQuantity}
              onChange={(e) => onQuantityChange?.(p.id, Number(e.target.value))}
              min={0}
            /> */}
            {p.requestedQuantity}
          </div>
        ))}
      </CardContent>

      <CardContent className="flex justify-between items-center border-t pt-2">
        <span className="text-sm font-medium">Total Items:</span>
        <Badge variant="secondary" className="text-sm">{totalItems}</Badge>
      </CardContent>
    </Card>
  );
};

export default SlotSummary;
