"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Package, AlertCircle, Boxes, Clock, MapPin } from "lucide-react";

type DeliveryStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

const statusConfig: Record<
  DeliveryStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
  },
  confirmed: {
    label: "Confirmed",
    variant: "default",
  },
  in_progress: {
    label: "In Progress",
    variant: "default",
  },
  completed: {
    label: "Completed",
    variant: "outline",
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive",
  },
};

interface ProductType {
  id: string;
  name: string;
  quantity: number;
  numberOfPallets: number;
}

interface Booking {
  id: string;
  status: DeliveryStatus;
  bookingDate: string;
  productTypes: ProductType[];
  yard?: { name: string; address: string } | null;
}

function DeliveryCard({ delivery }: { delivery: Booking }) {
  const statusInfo = statusConfig[delivery.status];

  const palletsTotal = delivery.productTypes.reduce(
    (acc, p) => acc + p.numberOfPallets,
    0
  );

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group relative border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition-all duration-200 bg-white">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <Badge variant={statusInfo.variant} className="text-xs font-medium">
              {statusInfo.label}
            </Badge>
          </div>
          <div className="min-w-0 flex-1">
            {delivery.yard && (
              <p className="text-sm font-semibold text-slate-900 truncate">
                {delivery.yard.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {delivery.yard && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600">{delivery.yard.address}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <p className="text-sm font-medium text-slate-700">
            {getDateLabel(delivery.bookingDate)}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="space-y-2">
            {delivery.productTypes.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 truncate">
                    {product.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-900 flex-shrink-0">
                  {product.quantity}x
                </span>
              </div>
            ))}
          </div>

          {palletsTotal > 0 && (
            <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-600">Total Pallets</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {palletsTotal}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-slate-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-5 w-40 rounded" />
          </div>
          <Skeleton className="h-4 w-64 rounded" />
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-4 w-56 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface UpcomingDeliveriesProps {
  deliveries?: Booking[];
  isLoading: boolean;
  title: string;
}

export default function UpcomingDeliveries({
  deliveries,
  isLoading,
  title,
}: UpcomingDeliveriesProps) {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardHeader className="pb-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-slate-900">
              {title}
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              {deliveries?.length ?? 0}{" "}
              {deliveries?.length === 1 ? "delivery" : "deliveries"} scheduled
            </p>
          </div>
          <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : deliveries?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 mb-4">
              <AlertCircle className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900">
              No upcoming deliveries
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Schedule your first delivery to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliveries?.map((d) => (
              <DeliveryCard key={d.id} delivery={d} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}