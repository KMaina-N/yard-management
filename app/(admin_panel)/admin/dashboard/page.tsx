"use client";

import { useEffect, useState } from "react";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Sector,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Calendar,
  Warehouse,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Activity,
} from "lucide-react";
import { DateRangePicker } from "./components/date-range-picker";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { UtilisationCard } from "./components/utilization-card";

type DashboardData = {
  bookingsStatus: { status: string; _count: { status: number } }[];
  goodsByType: {
    type: { id: string; name: string };
    _sum: { quantities: number };
    percentOfTotal: number;
  }[];
  yardUtilization: {
    id: string;
    name: string;
    address: string;
    capacity: number | null;
    createdAt: string;
    updatedAt: string;
    bookings: any[];
    booked: number;
    utilizationRate: number;
  }[];
  deliverySchedules: {
    id: string;
    week: string;
    totalCapacity: number;
    tolerance: number | null;
    createdAt: string;
    updatedAt: string;
    days: {
      id: string;
      date: string;
      capacity: number;
      isSaved: boolean;
      deliveryScheduleId: string;
      createdAt: string;
      updatedAt: string;
    }[];
    totalBooked: number;
    utilizationRate: number;
  }[];
};


export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [yardId, setYardId] = useState<string>("");
  const [productTypeId, setProductTypeId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchDashboard = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (dateFrom) params.append("date_from", dateFrom);
    if (dateTo) params.append("date_to", dateTo);
    if (yardId) params.append("yardId", yardId);
    if (productTypeId) params.append("productTypeId", productTypeId);

    try {
      const res = await fetch(`/api/dashboard?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
  // Delivery chart data

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

  // Calculate KPIs from actual data
  const totalBookings = data.bookingsStatus.reduce(
    (acc, curr) => acc + curr._count.status,
    0
  );
  const totalGoods = data.goodsByType.reduce(
    (acc, curr) => acc + (curr._sum.quantities || 0),
    0
  );

  const yardsWithCapacity = data.yardUtilization.filter(
    (y) => y.capacity !== null && y.capacity > 0
  );
  // const avgUtilisation_ =
  //   yardsWithCapacity.length > 0
  //     ? yardsWithCapacity.reduce((acc, curr) => acc + curr.utilizationRate, 0) /
  //       yardsWithCapacity.length
  //     : 0;

  //   const avgUtilisation_ =
  //     data.yardUtilization.reduce(
  //       (sum, schedule) => sum + schedule.utilizationRate,
  //       0
  //     ) / data.yardUtilization.length;

  const totalUtilization = data.deliverySchedules.reduce(
    (sum, schedule) => sum + schedule.utilizationRate,
    0
  );

  const avgUtilisation_ = totalUtilization / data.deliverySchedules.length;
  // const avgUtilisation_ = 300

  console.log("Average Utilization Rate:", avgUtilisation_.toFixed(2) + "%");
  const activeYards = data.yardUtilization.filter((y) => y.booked > 0).length;
  const totalYards = data.yardUtilization.length;

  // Prepare delivery schedule data for charts
  const deliveryChartData = data.deliverySchedules.flatMap((s: any) =>
    s.days.map((d: any) => ({
      date: d.date,
      booked: d.bookedQty, // <- use bookedQty
      total: d.scheduledCapacity, // <- use scheduledCapacity
      utilization:
        d.scheduledCapacity > 0 ? (d.bookedQty / d.scheduledCapacity) * 100 : 0,
    }))
  );

  const allValues = data.deliverySchedules.flatMap((s: any) =>
    s.days.map((d: any) => Math.max(d.bookedQty, d.scheduledCapacity))
  );

  const maxY = Math.max(...allValues) * 1.5;

  const maxX =
    deliveryChartData.reduce((max, item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate > max ? itemDate : max;
    }, 0) +
    30 * 24 * 60 * 60 * 1000; // add 30 days in ms

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                Tokić d.d. Dashboard
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Real-time analytics
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboard}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Filters Card */}
        {showFilters && (
          <Card className="border-blue-200 shadow-lg shadow-blue-100/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filter Dashboard
              </CardTitle>
              <CardDescription>
                Customize your view with date ranges and specific filters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Start Date
                  </Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    End Date
                  </Label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="h-10"
                  />
                </div> */}
                <div className="space-y-2">
                  <DateRangePicker
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    setDateFrom={setDateFrom}
                    setDateTo={setDateTo}
                  />
                </div>
                <div className="space-y-2 ml-7">
                  <Label className="text-xs font-semibold text-slate-700">
                    Yard Location
                  </Label>
                  <Select onValueChange={setYardId} value={yardId}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="All yards" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">All yards</SelectItem> */}
                      {data.yardUtilization.map((y) => (
                        <SelectItem key={y.id} value={y.id}>
                          {y.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-700">
                    Product Type
                  </Label>
                  <Select
                    onValueChange={setProductTypeId}
                    value={productTypeId}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="">All types</SelectItem> */}
                      {data.goodsByType.map((g) => (
                        <SelectItem key={g.type.id} value={g.type.id}>
                          {g.type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={fetchDashboard}
                    className="w-full h-10"
                    disabled={isLoading}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Bookings
                </CardTitle>
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">
                  {totalBookings.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  {data.bookingsStatus
                    .map((s) => `${s.status}: ${s._count.status}`)
                    .join(", ")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-violet-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Goods
                </CardTitle>
                <Package className="w-5 h-5 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">
                  {totalGoods.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">
                  Across {data.goodsByType.length} product types
                </p>
              </div>
            </CardContent>
          </Card>

          <UtilisationCard
            avgUtilisation={avgUtilisation_}
            yardsWithCapacity={yardsWithCapacity}
          />

          <Card className="border-l-4 border-l-emerald-600 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Active Yards
                </CardTitle>
                <Warehouse className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-slate-900">
                  {activeYards} / {totalYards}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          totalYards > 0 ? (activeYards / totalYards) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {totalYards > 0
                      ? ((activeYards / totalYards) * 100).toFixed(0)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Status */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                Bookings by Status
              </CardTitle>
              <CardDescription>
                Distribution of booking statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ pie: { label: "Bookings", color: "#3b82f6" } }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={data.bookingsStatus}
                      dataKey={(d) => d._count.status}
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      paddingAngle={2}
                      innerRadius={60}
                      strokeWidth={5}
                      activeIndex={0}
                      cornerRadius={3}
                      activeShape={({
                        outerRadius = 0,
                        ...props
                      }: PieSectorDataItem) => (
                        <Sector {...props} outerRadius={outerRadius + 5} />
                      )}
                    >
                      {data.bookingsStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {data.bookingsStatus.map((status, index) => (
                  <Badge
                    key={status.status}
                    variant="outline"
                    className="gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {status.status}: {status._count.status}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goods per Type */}
          <Card className="lg:col-span-2 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                Goods per Product Type
              </CardTitle>
              <CardDescription>
                Quantity distribution across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ bar: { label: "Quantity", color: "#3b3b3b" } }}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={data.goodsByType}
                    margin={{ top: 5, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="type.name"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="_sum.quantities"
                      // fill="url(#colorGradient)"
                      fill="#2563eb"
                      name="Quantity"
                      radius={[8, 8, 0, 0]}
                    />
                    {/* <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="10%"
                        y1="0%"
                        x2="10%"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#1d1d1d"
                          stopOpacity={0.9}
                        />{" "}
                        <stop
                          offset="50%"
                          stopColor="#333333"
                          stopOpacity={0.7}
                        />{" "}
                        <stop
                          offset="100%"
                          stopColor="#000000"
                          stopOpacity={0.6}
                        />{" "}
                      </linearGradient>
                    </defs> */}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Yard Utilization */}
        {/* <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              Yard Utilization Overview
            </CardTitle>
            <CardDescription>
              Capacity vs booked space across all yards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ bar: { label: "Utilization", color: "#3b82f6" } }}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data.yardUtilization.map((yard) => ({
                    ...yard,
                    available: yard.capacity
                      ? Math.max(0, yard.capacity - yard.booked)
                      : 0,
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey="booked"
                    stackId="a"
                    fill="#3b82f6"
                    name="Booked"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="available"
                    stackId="a"
                    fill="#e2e8f0"
                    name="Available"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card> */}

        {/* Delivery Schedules */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
              Delivery Schedule Utilization
            </CardTitle>
            <CardDescription>
              Daily booking trends and capacity utilization over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="area" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                <TabsTrigger value="area">Area Chart</TabsTrigger>
                <TabsTrigger value="line">Line Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="line">
                <ChartContainer
                  config={{ line: { label: "Schedule", color: "#10b981" } }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={deliveryChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) =>
                          new Date(d).toLocaleDateString("en-UK", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        domain={[0, maxX]}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        domain={[0, maxY]}
                      />
                      <Tooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="booked"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Booked"
                        // dot={{ r: 4 }}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Total Capacity"
                        // dot={{ r: 4 }}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="area">
                <ChartContainer
                  config={{ area: { label: "Schedule", color: "#10b981" } }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                      data={deliveryChartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(d) =>
                          new Date(d).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        domain={[0, maxX]}
                      />
                      <YAxis
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        domain={[0, maxY]}
                      />
                      <Tooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(label) =>
                          new Date(label).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        }
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                        name="Total Capacity"
                      />
                      <Area
                        type="monotone"
                        dataKey="booked"
                        stackId="2"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                        name="Booked"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Delivery Schedules Summary Table */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Weekly Schedule Summary
            </CardTitle>
            <CardDescription>
              Overview of delivery schedules by week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Week
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Total Capacity
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Booked
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Utilization
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                      Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.deliverySchedules
                    .sort((a, b) => a.week.localeCompare(b.week))
                    .map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-slate-900">
                          Week {schedule.week}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {schedule.totalCapacity.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {schedule.totalBooked.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge
                            variant="outline"
                            className={`${
                              schedule.utilizationRate >= 90
                                ? "border-red-300 text-red-700 bg-red-50"
                                : schedule.utilizationRate >= 70
                                ? "border-amber-300 text-amber-700 bg-amber-50"
                                : "border-green-300 text-green-700 bg-green-50"
                            }`}
                          >
                            {schedule.utilizationRate.toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {schedule.days.length}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
