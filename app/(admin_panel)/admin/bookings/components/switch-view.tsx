"use client";

import dynamic from "next/dynamic";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import DataTable from "./data-table";
import columns from "./columns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarMonthPicker,
  CalendarYearPicker,
  useCalendarMonth,
  useCalendarYear,
} from "@/components/kibo-ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  filterBookings,
  filterByDate,
  filterBySearch,
  filterByStatus,
} from "@/app/actions/admin/filters";
import { getAllBookings } from "@/app/actions/admin/bookings";
import { AppliedFilters } from "./applied-filters";
import { Input } from "@/components/ui/input";
import { FilterSection } from "./filters";

const CalendarView = dynamic(() => import("./calendar-view"), { ssr: false });

const SwitchView = () => {
  const queryClient = useQueryClient();

  // --- Kibo calendar atoms ---
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [query, setQuery] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  let queryString = "";

  // Remove duplicate types in the query array before updating
  const queryGenerator = (value: any) => {
    const updatedQuery = [...query.filter((q) => q.type !== value.type), value];
    setQuery(updatedQuery);

    const vars = {
      date: updatedQuery.find((q) => q.type === "date")?.value,
      search: updatedQuery.find((q) => q.type === "search")?.value,
      status: updatedQuery.find((q) => q.type === "status")?.value,
    };

    filterGlobal.mutate(vars);
  };

  console.log(query);

  const filterGlobal = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (variables: {
      date?: any;
      search?: string;
      status?: string;
    }) => {
      const res = await filterBookings(variables);
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookings"], data);
    },
  });

  const removeFilter = (type: string) => {
    console.log("Removing filter of type:", type);
    setQuery((prev) => prev.filter((q) => q.type !== type));
    filterGlobal.mutate(
      Object.fromEntries(
        query.filter((q) => q.type !== type).map((q) => [q.type, q.value])
      )
    );
    if (type.toLowerCase() === "search") {
      setSearchValue("");
    }
  };

  const clearAll = () => {
    setQuery([]);
    setSearchValue("");
    filterGlobal.mutate({});
  };

  useEffect(() => {
    if (searchValue === "") {
      removeFilter("search");
    }
  }, [searchValue]);

  const appliedFilters = query.map((item) => ({
    type: item.type,
    label: item.type.charAt(0).toUpperCase() + item.type.slice(1),
    value:
      item.value instanceof Date
        ? item.value.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
        : item.value,
  }));

  // --- Statuses ---
  const statuses = [
    { id: faker.string.uuid(), name: "Pending", color: "#94A3B8" }, // slate-400
    { id: faker.string.uuid(), name: "In Review", color: "#FACC15" }, // yellow-400 (softened)
    { id: faker.string.uuid(), name: "In Progress", color: "#60A5FA" }, // blue-400
    { id: faker.string.uuid(), name: "Done", color: "#4ADE80" }, // green-400
    { id: faker.string.uuid(), name: "Cancelled", color: "#F87171" }, // red-400
    { id: faker.string.uuid(), name: "Confirmed", color: "#86EFAC" }, // green-300
    { id: faker.string.uuid(), name: "Completed", color: "#A78BFA" }, // violet-400
    { id: faker.string.uuid(), name: "On Hold", color: "#FB923C" }, // orange-400
    { id: faker.string.uuid(), name: "Rescheduled", color: "#64748B" }, // slate-500
  ];

  // --- Fetch all bookings ---

  const getInitialData = async () => {
    const queryies = query;
    const vars: {
      date?: any;

    } = queryies.reduce((acc: any, curr: any) => {
      acc[curr.type] = curr.value;
      return acc;
    }, {});
    
    console.log("Fetching with vars:", vars);
    const res = await filterGlobal.mutateAsync(vars);
    return res;
  }

 

  const { data: bookings = [], isLoading, refetch } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await getInitialData()
      return res;
    },
    initialData: [],
  });

  // --- Mutation to filter bookings by month/year ---
  const filterMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (date: Date) => {
      console.log("Filtering by date:", date);
      const res = await filterByDate(date);
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookings"], data);
    },
  });

  const searchMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (query: string) => {
      const res = await filterBySearch(query);
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookings"], data);
    },
  });

  const statusFilterMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (status: string) => {
      const res = await filterByStatus(status);
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bookings"], data);
    },
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // searchMutation.mutate((e.target as HTMLInputElement).value);
      queryGenerator({
        type: "search",
        value: (e.target as HTMLInputElement).value,
      });
    }
  };

  const handleStatusFilter = (status: string) => {
    // statusFilterMutation.mutate(status);
    queryGenerator({ type: "status", value: status });
  };
  // --- Automatically fetch filtered bookings when month/year changes ---
  useEffect(() => {
    const selectedDate = new Date(year, month, 1);
    // filterMutation.mutate(selectedDate);
    queryGenerator({ type: "date", value: selectedDate });
  }, [month, year]);

  // --- Transform bookings into features for Kibo ---
  const exampleFeatures = bookings.map((booking: any) => {
    const goods = booking?.goods ?? [];
    const productTypes = booking?.productTypes ?? [];

    const productType = goods.reduce((acc: string[], curr: any) => {
      const product = productTypes.find((pt: any) => pt.id === curr.typeId);
      if (product) acc.push(product.name);
      return acc;
    }, []);

    const quantitiesArray = goods.map((g: any) => {
      const product = productTypes.find((pt: any) => pt.id === g.typeId);
      return {
        typeId: g.typeId,
        name: product?.name ?? g.typeId, // fallback to typeId if name missing
        quantity: g.quantities ?? 0,
      };
    });
    const pallets = goods.reduce(
      (acc: number, curr: any) => acc + (curr.numberOfPallets ?? 0),
      0
    );

    const matchedStatus = statuses.find(
      (s) => s.name.toLowerCase() === (booking?.status ?? "").toLowerCase()
    );

    return {
      id: booking?.id,
      name: booking?.user?.company ?? "Unknown Company",
      startAt: booking?.bookingDate
        ? new Date(booking.bookingDate)
        : new Date(),
      endAt: booking?.bookingDate ? new Date(booking.bookingDate) : new Date(),
      status: matchedStatus ?? {
        name: booking?.status ?? "Unknown",
        color: "#6B7280",
      },
      description: faker.company.catchPhrase(),
      productType,
      quantities: quantitiesArray,
      numberOfPallets: pallets || "N/A",
      assignedTo: booking?.yard?.name ?? "Unassigned Yard",
      createdOn: booking?.createdAt,
    };
  });

  const featureYears = exampleFeatures.map((f: any) => f.endAt.getFullYear());
  const earliestYear = Math.min(...featureYears, new Date().getFullYear() - 1);

  // Latest year: 5 years after the latest feature or current year
  const latestYear = Math.max(...featureYears, new Date().getFullYear() + 5);

  return (
    <div className="relative w-full">
      {/* <div className="bg-white backdrop-blur-sm border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 flex-wrap shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-2 flex-wrap flex-grow">
          <Input
            type="text"
            placeholder="Search by company or booking..."
            className="flex-grow rounded-full border border-gray-100 px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
            onKeyDown={handleSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            value={searchValue}
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="font-semibold text-gray-800 text-sm tracking-wide">
            Filter Bookings
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CalendarDate>
            <CalendarDatePicker className="gap-2">
              <CalendarMonthPicker className="rounded-full border border-gray-100 px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition" />
              <CalendarYearPicker
                start={earliestYear}
                end={latestYear}
                className="rounded-full border border-gray-100 px-3 py-1 text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition"
              />
            </CalendarDatePicker>
            <CalendarDatePagination />
          </CalendarDate>
        </div>

        <Select
          defaultValue="all"
          onValueChange={(v) => console.log("Warehouse:", v)}
        >
          <SelectTrigger className="rounded-full border border-gray-100 px-4 py-2 text-sm w-44 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition">
            <SelectValue placeholder="All Warehouses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warehouses</SelectItem>
            <SelectItem value="Warehouse 1">Warehouse 1</SelectItem>
            <SelectItem value="Warehouse 2">Warehouse 2</SelectItem>
            <SelectItem value="Warehouse 3">Warehouse 3</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="all" onValueChange={(v) => handleStatusFilter(v)}>
          <SelectTrigger className="rounded-full border border-gray-100 px-4 py-2 text-sm w-44 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400 transition">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.name}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white shadow-md rounded-md p-4 my-4">
        <AppliedFilters
          filters={appliedFilters}
          onRemove={removeFilter}
          onClearAll={clearAll}
        />
      </div> */}

      <Tabs defaultValue="calendar">
        <div className="mb-8 relative bg-white">
          <div className="flex justify-between">
            <TabsList className="grid w-full max-w-[650px] grid-cols-5 rounded-2xl p-1 z-10 bg-white">
              <TabsTrigger value="calendar" className="rounded-x">
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="table" className="rounded-xl">
                Table View
              </TabsTrigger>
            </TabsList>
            <FilterSection
              appliedFilters={appliedFilters}
              onRemoveFilter={removeFilter}
              onClearAllFilters={clearAll}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onSearchSubmit={handleSearch}
              onStatusChange={handleStatusFilter}
              // onWarehouseChange={handleWarehouseFilter}
              statuses={statuses}
              earliestYear={earliestYear}
              latestYear={latestYear}
            />
          </div>

          <div className="mt-0">
            {/* --- Calendar View --- */}
            <TabsContent value="calendar" className="mt-0">
              <CalendarView
                exampleFeatures={exampleFeatures}
                selectedDate={selectedDate}
                onDateSelect={(date) => setSelectedDate(date)}
              />
            </TabsContent>

            {/* --- Table View --- */}
            <TabsContent value="table" className="mt-10">
              {exampleFeatures.length === 0 ? (
                <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed">
                  <p className="text-muted-foreground">
                    No bookings available to display.
                  </p>
                </div>
              ) : (
                <DataTable columns={columns} data={exampleFeatures} />
              )}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default SwitchView;
