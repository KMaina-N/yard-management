"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { Clock, Package, ArrowRight, History } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "border-amber-600 text-amber-700" },
  confirmed: {
    label: "Confirmed",
    color: "border-emerald-600 text-emerald-700",
  },
  in_progress: { label: "In Progress", color: "border-blue-600 text-blue-700" },
  completed: { label: "Completed", color: "border-slate-600 text-slate-700" },
  cancelled: { label: "Cancelled", color: "border-red-600 text-red-700" },
};

interface Delivery {
  id: string;
  bookingDate: string;
  status: string;
  goods: { typeId: string; quantities: number; numberOfPallets: number }[];
  productTypes: { id: string; name: string }[];
  user: { company: string };
}

export default function RecentActivity({
  deliveries,
  isLoading,
}: {
  deliveries: any[];
  isLoading: boolean;
}) {
  // Merge the two types but maintain separation preference: confirmed first, then pending
  const allRecent = deliveries.slice(0, 5);

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg">
              <Skeleton className="w-10 h-10 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <History className="w-5 h-5 text-white" />
            </div>
            Recent Activity
          </CardTitle>

          <Link
            href="/deliveries"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {allRecent.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No recent deliveries</p>
          </div>
        ) : (
          allRecent.map((delivery) => {
            const status = statusConfig[delivery.status] || statusConfig.pending;

            const productNames = delivery.productTypes
              .map((p) => p.name)
              .join(", ");

            const totalQuantity = delivery.goods.reduce(
              (sum, g) => sum + g.quantities,
              0
            );

            return (
              <div
                key={delivery.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 border rounded-md flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{productNames}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {delivery.user.company}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(delivery.bookingDate), "MMM d, yyyy")}
                    </span>
                    <span>{totalQuantity} items</span>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`${status.color} border rounded-full px-3`}
                >
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
