"use client";

import React, { useState } from "react";
import CustomDateSelector from "./capacity-calendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SlotSummary from "./slot-summary";

interface SlotSelectorProps {
  bookingData: any;
  setBookingData?: (data: any) => void;
  productTypeIds: any[];
  onBack: () => void;
  onConfirm: (date: Date, time: string) => void;
}

export default function SlotSelector({
  bookingData,
  setBookingData,
  productTypeIds,
  onBack,
  onConfirm,
}: SlotSelectorProps) {

  // const [localBookingData, setLocalBookingData] = useState(bookingData);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [version, setVersion] = useState(0); // Forcing re-render if needed

  const productsSummary = productTypeIds
    .filter((pt) => bookingData.goods.some((g: any) => g.type === pt.id))
    .map((pt) => {
      const matchedGood = bookingData.goods.find((g: any) => g.type === pt.id);
      return {
        id: pt.id,
        name: pt.name,
        requestedQuantity: matchedGood?.quantities ?? 0,
      };
    });

  const handleQuantityChange = (id: string, newQty: number) => {
    const updated = {
      ...bookingData,
      goods: bookingData.goods.map((g: any) =>
        g.type === id ? { ...g, quantities: newQty } : g
      ),
    };

    setBookingData && setBookingData(updated); // Save locally
    setVersion((v) => v + 1);

    // 🔥 Trigger availability refetch in calendar
    // Pass updated bookingData to CustomDateSelector as prop to re-run API call
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 mb-10 mt-10">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-xl">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle>Select Delivery Date</CardTitle>
              <CardDescription>Availability for your selected products</CardDescription>
            </div>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
          </CardHeader>

          <CardContent>
            <div className="flex justify-center">
              <CustomDateSelector
                goods={bookingData.goods}
                bookingData={bookingData}
                onDateSelect={(date) => handleDateSelect(date)}
                version={version}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <SlotSummary
          selectedDate={selectedDate}
          productsSummary={productsSummary}
          onQuantityChange={handleQuantityChange}
        />

        {selectedDate && (
          <Button
            className="w-full mt-4 p-4 text-md text-white font-bold shadow-xl"
            onClick={() => onConfirm(selectedDate, "")}
          >
            <CheckCircle2 className="mr-3 w-6 h-6" /> Confirm
          </Button>
        )}
      </div>
    </div>
  );
}
