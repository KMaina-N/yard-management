"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FilterItem {
  type: string;
  label: string;
  value: string | number | null;
  category?: "status" | "date" | "search" | "warehouse" | "default";
}

interface AppliedFiltersProps {
  filters: FilterItem[];
  onRemove: (type: string) => void;
  onClearAll: () => void;
}

const getCategoryStyles = (category?: string) => {
  const styles = {
    status: {
      container: "bg-blue-50 border border-blue-200 hover:border-blue-300",
      badge: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      text: "text-blue-900",
      button: "text-blue-600 hover:text-blue-700 hover:bg-blue-100",
    },
    date: {
      container: "bg-amber-50 border border-amber-200 hover:border-amber-300",
      badge: "bg-amber-100 text-amber-700 hover:bg-amber-200",
      text: "text-amber-900",
      button: "text-amber-600 hover:text-amber-700 hover:bg-amber-100",
    },
    search: {
      container: "bg-slate-50 border border-slate-200 hover:border-slate-300",
      badge: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      text: "text-slate-900",
      button: "text-slate-600 hover:text-slate-700 hover:bg-slate-100",
    },
    warehouse: {
      container: "bg-purple-50 border border-purple-200 hover:border-purple-300",
      badge: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      text: "text-purple-900",
      button: "text-purple-600 hover:text-purple-700 hover:bg-purple-100",
    },
    default: {
      container: "bg-slate-50 border border-slate-200 hover:border-slate-300",
      badge: "bg-slate-100 text-slate-700 hover:bg-slate-200",
      text: "text-slate-900",
      button: "text-slate-600 hover:text-slate-700 hover:bg-slate-100",
    },
  };

  return styles[category as keyof typeof styles] || styles.default;
};

export function AppliedFilters({
  filters,
  onRemove,
  onClearAll,
}: AppliedFiltersProps) {
  if (!filters.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      {/* Header with summary and clear action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Active Filters
          </p>
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-slate-900 rounded-full">
            {filters.length}
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-8 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Clear All
        </Button>
      </div>

      {/* Filters Grid */}
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {filters.map((filter, index) => {
            const styles = getCategoryStyles(filter.category);

            return (
              <motion.div
                key={filter.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.02,
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
                className="flex items-center"
              >
                <div
                  className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${styles.container}`}
                >
                  {/* Icon indicator for category */}
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${filter.category === "status" ? "bg-blue-600" : filter.category === "date" ? "bg-amber-600" : filter.category === "warehouse" ? "bg-purple-600" : "bg-slate-600"}`}
                  />

                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-semibold opacity-75 ${styles.text}`}>
                      {filter.label}
                    </span>
                    <span className={`font-semibold ${styles.text}`}>
                      {String(filter.value)}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemove(filter.type)}
                    className={`flex items-center justify-center flex-shrink-0 ml-1 p-0.5 rounded transition-all duration-200 hover:scale-110 ${styles.button}`}
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Filter summary info */}
      <div className="flex items-center gap-1 text-xs text-slate-500 px-1 py-1">
        <p>
          Showing results for <span className="font-semibold text-slate-700">{filters.length}</span> active
          {filters.length === 1 ? " filter" : " filters"}
        </p>
      </div>
    </motion.div>
  );
}