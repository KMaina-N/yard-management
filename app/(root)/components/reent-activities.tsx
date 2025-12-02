"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, ArrowRight, History } from "lucide-react";
import { format, parseISO } from "date-fns";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "border-amber-600 text-amber-700" },
  confirmed: { label: "Confirmed", color: "border-emerald-600 text-emerald-700" },
  in_progress: { label: "In Progress", color: "border-blue-600 text-blue-700" },
  completed: { label: "Completed", color: "border-slate-600 text-slate-700" },
  cancelled: { label: "Cancelled", color: "border-red-600 text-red-700" },
};

const deliveries = [
  {
    id: "1",
    bookingDate: "2025-11-27T09:00:00.000Z",
    status: "pending",
    user: { company: "ACME Corp" },
    activity: "Booking Created",
    productTypes: [{ id: "p1", name: "Tyres" }],
    goods: [{ typeId: "p1", quantities: 100, numberOfPallets: 2 }],
  },
  {
    id: "2",
    bookingDate: "2025-11-28T12:30:00.000Z",
    status: "confirmed",
    user: { company: "Globex Ltd" },
    activity: "Status updated to Confirmed",
    productTypes: [{ id: "p2", name: "Oil" }],
    goods: [{ typeId: "p2", quantities: 50, numberOfPallets: 1 }],
  },
  {
    id: "3",
    bookingDate: "2025-11-29T15:00:00.000Z",
    status: "in_progress",
    user: { company: "Initech" },
    activity: "Delivery started",
    productTypes: [{ id: "p3", name: "Electronic systems" }],
    goods: [{ typeId: "p3", quantities: 20, numberOfPallets: 1 }],
  },
  {
    id: "4",
    bookingDate: "2025-11-30T08:45:00.000Z",
    status: "completed",
    user: { company: "Umbrella Corp" },
    activity: "Delivery Completed",
    productTypes: [{ id: "p4", name: "Brakes" }],
    goods: [{ typeId: "p4", quantities: 10, numberOfPallets: 0 }],
  },
];

export default function RecentActivity() {
  const recentDeliveries = deliveries.slice(0, 5);

  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <History className="w-5 h-5 text-white" />
          </div>
          Recent Activity
        </CardTitle>
        <Link
          href="#"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {recentDeliveries.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No recent activity</p>
          </div>
        ) : (
          recentDeliveries.map((item) => {
            const status = statusConfig[item.status] || statusConfig.pending;
            const productNames = item.productTypes.map((p) => p.name).join(", ");
            const totalQuantity = item.goods.reduce((sum, g) => sum + g.quantities, 0);

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer w-full"
              >
                <div className="w-10 h-10 flex-shrink-0 border rounded-md flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.activity}</p>
                    {/* <p className="text-sm text-slate-500 truncate">{item.user.company}</p> */}
                    <span className="flex items-center gap-1 text-xs text-slate-500 mt-1 w-full">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(item.bookingDate), "MMM d, yyyy")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1 sm:mt-0 flex-wrap sm:flex-nowrap">
                    {/* <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(item.bookingDate), "MMM d, yyyy")}
                    </span> */}
                    <span>{totalQuantity} items</span>
                    <span className="truncate">{productNames}</span>
                  </div>
                </div>

                <Badge variant="outline" className={`${status.color} px-3 mt-2 sm:mt-0`}>
                  {status.label}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
