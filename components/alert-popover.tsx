"use client";

import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import Link from "next/link";

type AlertLevel = "high" | "low" | "none";

interface WarningResponse {
  level: AlertLevel;
  message: string;
}

interface AlertConfig {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  badge: string;
  description: string;
}

const AlertPopover: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [warning, setWarning] = useState<WarningResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarning();
  }, []);

  const fetchWarning = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/alerts");
        const data: WarningResponse = await res.json();
    //   const data: WarningResponse = {
    //     level: "low",
    //     message: "No delivery days scheduled beyond 1 month — plan soon.",
    //   };
      setWarning(data);
    } catch (err) {
      setError("Failed to fetch warning status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAlertConfig = (): AlertConfig | null => {
    if (!warning) return null;

    const configs: Record<AlertLevel, AlertConfig> = {
      high: {
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        badgeColor: "bg-red-100 text-red-800",
        badge: "Critical",
        description: "Immediate action required",
      },
      low: {
        icon: AlertTriangle,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badgeColor: "bg-amber-100 text-amber-800",
        badge: "Warning",
        description: "Action needed soon",
      },
      none: {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        badgeColor: "bg-green-100 text-green-800",
        badge: "Healthy",
        description: "Everything is good",
      },
    };

    return configs[warning.level] || configs.none;
  };

  const config = getAlertConfig();
  const Icon = config?.icon;

if (loading) {
    return (
        <div className="flex items-center gap-2 rounded-lg bg-gray-100 animate-pulse">
            <span className="h-5 w-5 border-2 border-gray-900 border-t-gray-400 rounded-full animate-spin inline-block" />
        </div>
    );
}

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        asChild
      >
        {/* <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"> */}
        {/* </button> */}
        <div className="cursor-pointer">
          {Icon && <Icon className={`h-5 w-5 ${config?.color}`} />}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className={`w-96 p-0 border-2 ${config?.borderColor} overflow-hidden shadow-lg mr-5`}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div
          className={`${config?.bgColor} border-b-2 ${config?.borderColor} p-4`}
        >
          <div className="flex items-center gap-3 mb-3">
            {Icon && <Icon className={`h-6 w-6 ${config?.color}`} />}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${config?.badgeColor}`}
            >
              {config?.badge}
            </span>
          </div>
          <h3 className={`text-lg font-bold ${config?.color} mb-1`}>
            {warning?.message}
          </h3>
          <p className="text-sm text-gray-600">{config?.description}</p>
        </div>

        <div className="p-4 space-y-3">
          {warning?.level === "high" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Zap className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Action Required
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Schedule delivery days immediately to prevent service
                    interruptions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {warning?.level === "low" && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Plan Ahead
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Add delivery days for the next 30 days to maintain optimal
                    planning.
                  </p>
                </div>
              </div>
            </div>
          )}

          {warning?.level === "none" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900">
                    All Clear
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Your delivery schedule extends 30+ days into the future.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={fetchWarning}
            className="w-full mt-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Refresh Status
          </button>
          {warning?.level === "high" && (
            <Link href="/admin/configurations/delivery-rules" className="w-full block">
              <button className="w-full mt-2 px-3 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                Schedule Delivery Days
              </button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AlertPopover;
