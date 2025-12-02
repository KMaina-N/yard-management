"use client";

import React from "react";
import { Calendar, Clock, Warehouse, Package, Eye, Truck, Users } from "lucide-react";
import { format } from "date-fns";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";

interface Delivery {
  bookingId: string;
  supplier: string;
  goodsType: string;
  items: number;
  pallets: number;
  date: string;
  time: string;
  bay: number;
  status?: "Upcoming" | "Completed" | "Delayed";
}

const deliveries: Delivery[] = [
  {
    bookingId: "WH-123456",
    supplier: "Supplier A - Auto Parts",
    goodsType: "Car Parts",
    items: 50,
    pallets: 5,
    date: "2025-11-10T08:00:00",
    time: "08:00",
    bay: 1,
    status: "Upcoming",
  },
  {
    bookingId: "WH-234567",
    supplier: "Supplier B - Oil Solutions",
    goodsType: "Oil",
    items: 30,
    pallets: 3,
    date: "2025-11-11T10:00:00",
    time: "10:00",
    bay: 2,
    status: "Upcoming",
  },
];

const statusVariants: Record<string, string> = {
  Upcoming: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-700",
  Delayed: "bg-red-100 text-red-800",
};

const ScheduledDeliveries: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Scheduled Deliveries</h2>
        <p className="text-gray-500 text-sm">Track all upcoming warehouse deliveries at a glance</p>
      </div>

      <Separator className="my-2" />

      <Accordion type="single" collapsible className="space-y-4">
        {deliveries.map((delivery) => (
          <AccordionItem key={delivery.bookingId} value={delivery.bookingId}>
            <div className="bg-white rounded-xl shadow p-4 relative">
              {/* Status Dot */}
              <span
                className={`absolute top-4 left-4 w-3 h-3 rounded-full ${statusVariants[delivery.status || "Upcoming"]}`}
              />

              {/* Header */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-900">{format(new Date(delivery.date), "EEE, MMM d")}</span>
                  <Clock className="w-5 h-5 text-indigo-400" />
                  <span className="font-semibold text-gray-900">{delivery.time}</span>
                  <Badge className={statusVariants[delivery.status || "Upcoming"]}>{delivery.status}</Badge>
                </div>

                <AccordionTrigger className="text-sm font-semibold text-gray-700 hover:text-indigo-600">
                  View Details
                </AccordionTrigger>
              </div>

              {/* Accordion content */}
              <AccordionContent className="mt-4 grid sm:grid-cols-2 gap-4">
                <Detail icon={<Truck />} label="Goods Type" value={delivery.goodsType} />
                <Detail icon={<Warehouse />} label="Bay" value={`Bay ${delivery.bay}`} />
                <Detail icon={<Package />} label="Items" value={delivery.items} />
                <Detail icon={<Users />} label="Pallets" value={delivery.pallets} />
                <Detail label="Supplier" value={delivery.supplier} />
                <Button
                  variant="outline"
                  className="sm:col-span-2 w-full flex items-center justify-center gap-2 mt-2"
                  onClick={() => alert(`View booking ${delivery.bookingId}`)}
                >
                  <Eye className="w-4 h-4" /> View Details
                </Button>
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

const Detail: React.FC<{ icon?: React.ReactNode; label: string; value: string | number }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
    {icon && <div className="p-2 bg-white rounded">{icon}</div>}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default ScheduledDeliveries;
