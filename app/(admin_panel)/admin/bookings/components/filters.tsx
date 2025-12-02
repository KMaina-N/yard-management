"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Filter,
  Check,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import { AppliedFilters } from "./applied-filters";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface FilterItem {
  type: string;
  label: string;
  value: string | number | null;
  category?: "status" | "date" | "search" | "warehouse" | "default";
}

interface FilterSectionProps {
  appliedFilters: FilterItem[];
  onRemoveFilter: (type: string) => void;
  onClearAllFilters: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onStatusChange: (status: string) => void;
  onWarehouseChange?: (warehouse: string) => void;
  statuses: Array<{ id: string; name: string; color: string }>;
  earliestYear: number;
  latestYear: number;
  selectedStatus?: string;
  selectedWarehouse?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case "status":
      return <Tag className="w-3.5 h-3.5" />;
    case "date":
      return <Clock className="w-3.5 h-3.5" />;
    case "warehouse":
      return <MapPin className="w-3.5 h-3.5" />;
    default:
      return <Filter className="w-3.5 h-3.5" />;
  }
};

export function FilterSection({
  appliedFilters,
  onRemoveFilter,
  onClearAllFilters,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onStatusChange,
  onWarehouseChange,
  statuses,
  earliestYear,
  latestYear,
  selectedStatus = "all",
  selectedWarehouse = "all",
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  const hasActiveFilters = appliedFilters.length > 0;
  const filterStats = useMemo(() => {
    return {
      total: appliedFilters.length,
      byCategory: appliedFilters.reduce((acc, f) => {
        acc[f.category || "default"] = (acc[f.category || "default"] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [appliedFilters]);

  return (
    <div className="space-y-3 flex gap-4">
      {/* Main Search Bar with Advanced Filter Trigger */}
      <motion.div
        layout
        className="transition-all duration-300 overflow-hidden relative"
      >
        {/* Animated gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-50/50 group-hover:via-transparent group-hover:to-blue-50/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />

        <div className="relative flex items-center gap-3">
          {/* Enhanced Search Input */}
          {/* <motion.div
            className="flex-1 relative"
            animate={{ scale: focusedInput ? 1.01 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search companies, bookings, references..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200 bg-white/80 hover:bg-white"
              onKeyDown={onSearchSubmit}
              onChange={(e) => onSearchChange(e.target.value)}
              value={searchValue}
              onFocus={() => setFocusedInput(true)}
              onBlur={() => setFocusedInput(false)}
            />
            {searchValue && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </motion.button>
            )}
          </motion.div> */}

          {/* Advanced Filter Trigger Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative w-full inline-flex items-center gap-2.5 px-4 py-1 rounded-md cursor-pointer font-semibold text-sm whitespace-nowrap transition-all duration-300 border overflow-hidden",
                  hasActiveFilters
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-600 shadow-lg shadow-gray-600/30 "
                    : "bg-gradient-to-br from-slate-100 to-slate-50 text-slate-700 border-slate-300 hover:from-slate-200 hover:to-slate-100"
                )}
              >
                {/* Animated background glow */}
                {hasActiveFilters && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                )}

                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </motion.div>

                <span className="relative z-10">Filters</span>

                {/* Animated badge */}
                {hasActiveFilters && (
                  <motion.div
                    layoutId="filterBadge"
                    className="relative z-10 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-white/20 text-white rounded-full text-xs font-bold backdrop-blur-sm"
                  >
                    {filterStats.total}
                  </motion.div>
                )}
              </motion.button>
            </SheetTrigger>

            {/* Advanced Filter Sheet */}
            <SheetContent
              side="right"
              className="w-full md:min-w-[30%] !p-0 bg-gradient-to-br from-white via-slate-50 to-white"
            >
              {/* Gradient Header */}
              <div className="sticky top-0 z-10  px-6 py-6">
                <div className="flex items-center justify-between mb-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <SheetTitle className="text-xl font-bold flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg  border border-slate-400 flex items-center justify-center">
                        <Filter className="w-4 h-4 text-slate-600" />
                      </div>
                      Filters
                    </SheetTitle>
                  </motion.div>
                  <SheetClose asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 absolute top-1 right-1 rounded-lg bg-black transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </SheetClose>
                </div>

                {hasActiveFilters && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-600 mt-2 flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-green-400" />
                    {filterStats.total} filter
                    {filterStats.total !== 1 ? "s" : ""} applied
                  </motion.p>
                )}
              </div>

              <Separator />
              {/* Scrollable Content */}
              <div className="h-[calc(100vh-180px)] overflow-y-auto">
                <motion.div
                  className="space-y-6 p-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Search Filter */}
                  <motion.div className="space-y-3" variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Search
                      </label>
                    </div>
                    <Input
                      type="text"
                      placeholder="Search companies, bookings..."
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all bg-white"
                      onKeyDown={onSearchSubmit}
                      onChange={(e) => onSearchChange(e.target.value)}
                      value={searchValue}
                    />
                  </motion.div>

                  {/* Date Range Filter */}
                  <motion.div className="space-y-3" variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Date Range
                      </label>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200/50">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CalendarDate>
                          <CalendarDatePicker className="gap-2">
                            <CalendarMonthPicker className="rounded-lg border border-amber-200 px-3 py-2 text-sm hover:bg-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition bg-white/80" />
                            <CalendarYearPicker
                              start={earliestYear}
                              end={latestYear}
                              className="rounded-lg border border-amber-200 px-3 py-2 text-sm hover:bg-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition bg-white/80"
                            />
                          </CalendarDatePicker>
                          <CalendarDatePagination />
                        </CalendarDate>
                      </div>
                    </div>
                  </motion.div>

                  {/* Warehouse Filter */}
                  <motion.div className="space-y-3" variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Warehouse
                      </label>
                    </div>
                    <Select
                      value={selectedWarehouse}
                      onValueChange={(v) => onWarehouseChange?.(v)}
                    >
                      <SelectTrigger className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            All Warehouses
                          </span>
                        </SelectItem>
                        <SelectItem value="Warehouse 1">Warehouse 1</SelectItem>
                        <SelectItem value="Warehouse 2">Warehouse 2</SelectItem>
                        <SelectItem value="Warehouse 3">Warehouse 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Status Filter */}
                  <motion.div className="space-y-3" variants={itemVariants}>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Status
                      </label>
                    </div>
                    <Select
                      value={selectedStatus}
                      onValueChange={onStatusChange}
                    >
                      <SelectTrigger className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status.id} value={status.name}>
                            <span className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                              {status.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Applied Filters Summary */}
                  {hasActiveFilters && (
                    <motion.div
                      className="pt-6 border-t border-slate-200"
                      variants={itemVariants}
                    >
                      <div className="mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                          Active Filters
                        </label>
                      </div>
                      <AppliedFilters
                        filters={appliedFilters}
                        onRemove={onRemoveFilter}
                        onClearAll={onClearAllFilters}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.div>

      {/* Quick Stats Bar (when filters active) */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200/50 rounded-md h-8 p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <Filter className="w-4 h-4" />
              <span className="font-semibold">
                {filterStats.total} filter{filterStats.total !== 1 ? "s" : ""}{" "}
                applied
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onClearAllFilters}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors ml-2 cursor-pointer "
            >
              Clear all
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
