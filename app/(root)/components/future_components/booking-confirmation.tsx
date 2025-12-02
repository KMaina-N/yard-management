"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Package, Printer, Home } from "lucide-react";
import { BookingFormData } from "./booking-form";
import { format } from "date-fns";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BookingConfirmationProps {
  bookingData: BookingFormData;
  selectedDate: Date;
  selectedTime: string;
  selectedBay: number;
  onNewBooking: () => void;
  productTypes: any[];
}

export default function BookingConfirmation({
  bookingData,
  selectedDate,
  selectedTime,
  selectedBay,
  onNewBooking,
  productTypes,
}: BookingConfirmationProps) {
  const bookingId = `WH-${Date.now().toString().slice(-6)}`;
  const baseUrl = process.env.PRODUCTION
    ? "https://reminiscently-sarcophagous-lannie.ngrok-free.dev"
    : "http://localhost:3000";

  const qrData = `${baseUrl}/confirmation/?data=${encodeURIComponent(
    JSON.stringify({ bookingId, date: selectedDate, time: selectedTime, bay: selectedBay })
  )}`;

  return (
    <div className="w-full max-w-2xl mx-auto pt-4 animate-in fade-in duration-300">
      <Card className="border border-neutral-200 shadow-sm">
        <CardHeader className="text-center space-y-1 pb-2">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight">
            Booking Confirmed
          </CardTitle>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            Your delivery slot has been secured. Present this QR code at the warehouse.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-4">
          {/* Booking Reference + QR */}
          <div className="text-center space-y-1">
            <p className="text-[10px] uppercase font-medium text-neutral-500">Booking Reference</p>
            <p className="text-xl font-bold tracking-wider">{bookingId}</p>
            <div className="flex justify-center pt-1">
              <QRCode value={qrData} size={140} />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-700">Delivery Details</h3>

            <div className="space-y-2 divide-y divide-neutral-200">
              <DetailItem
                icon={<Calendar className="w-4 h-4 text-neutral-600" />}
                label="Date"
                value={format(selectedDate, "EEE, MMM d")}
              />

              <DetailItem
                icon={<Package className="w-4 h-4 text-neutral-600" />}
                label="Goods"
                value={
                  <div className="flex flex-wrap gap-1">
                    {bookingData.goods.map((item, idx) => {
                      const productType = productTypes.find((pt) => pt.id === item.type);
                      return (
                        <Badge key={idx} variant="secondary" className="px-1 text-xs">
                          {productType?.name || item.type}
                        </Badge>
                      );
                    })}
                  </div>
                }
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-1 border border-neutral-200 rounded-lg p-2 bg-neutral-50 text-sm">
            <SummaryRow label="Items" value={bookingData.goods.reduce((t, i) => t + i.quantities, 0)} />
            {bookingData.goods.reduce((t, i) => t + i.numberOfPallets, 0) > 0 && (
              <SummaryRow
                label="Pallets"
                value={bookingData.goods.reduce((t, i) => t + i.numberOfPallets, 0)}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button variant="outline" onClick={() => window.print()} className="flex-1 h-9 text-xs">
              <Printer className="w-3 h-3 mr-1" />
              Print
            </Button>

            <Button className="flex-1 h-9 text-xs" onClick={onNewBooking}>
              <Home className="w-3 h-3 mr-1" />
              New Booking
            </Button>

            <Link
              href={qrData}
              className="flex-1 h-9 flex items-center justify-center bg-neutral-900 text-white rounded-md text-xs hover:bg-black"
            >
              View Confirmation
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-neutral-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-neutral-500">{label}</p>
        <p className="text-sm font-medium text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
