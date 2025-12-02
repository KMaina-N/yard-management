
"use client";

import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Calendar, TrendingUp, Settings, Download, Cloud, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DatePicker from "../components/date-picker";
import { Label } from "@/components/ui/label";

export interface ReportData {
  BookingID: string;
  BookingDate: string;
  Status: string;
  UserEmail: string;
  UserName: string;
  Yard: string;
  ProductType: string;
  Quantity: number;
  Pallets: number;
}

export interface ReportResponse {
  bookings: any[];
}

export interface ReportState {
  reportData: ReportData[];
  loading: boolean;
  error: string | null;
}

export const flattenReportData = (bookings: any[]): ReportData[] => {
  const csvRows: ReportData[] = [];
  bookings.forEach((b: any) => {
    b.goods.forEach((g: any) => {
      csvRows.push({
        BookingID: b.id,
        BookingDate: b.bookingDate,
        Status: b.status,
        UserEmail: b.user.email,
        UserName: b.user.name,
        Yard: b.yard?.name || "",
        ProductType: g.type.name,
        Quantity: g.quantities,
        Pallets: g.numberOfPallets || 0,
      });
    });
  });
  return csvRows;
};

// Daily Report Component
const DailyReportPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [state, setState] = useState<ReportState>({
    reportData: [],
    loading: false,
    error: null,
  });

  const fetchReport = async (): Promise<void> => {
    if (!date) {
      setState((s) => ({ ...s, error: "Please select a date" }));
      return;
    }

    setState({ reportData: [], loading: true, error: null });

    try {
      const res = await fetch(`/api/reports?type=daily&date=${date}`);
      const data: ReportResponse = await res.json();

      if (data.bookings) {
        setState({
          reportData: flattenReportData(data.bookings),
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      setState({
        reportData: [],
        loading: false,
        error: "Failed to fetch report",
      });
    }
  };

  return (
    <Card className="w-full max-w-lg border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Daily Report
        </CardTitle>
        <CardDescription>Download booking data for a specific day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {/* <label className="text-sm font-medium">Date</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setState((s) => ({ ...s, error: null }));
            }}
            disabled={state.loading}
          /> */}
          <Label className="text-sm font-medium">Date</Label>
          <DatePicker onChange={(date) => {
            setDate(date);
            setState((s) => ({ ...s, error: null }));
          }} date={date} />
        </div>

        {state.error && (
          <Alert variant="destructive" className="py-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={fetchReport}
          disabled={state.loading}
          className="w-full"
        >
          {state.loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>

        {state.reportData.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              {state.reportData.length} entries found
            </p>
            <CSVLink data={state.reportData} filename={`daily-report_${date}.csv`}>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CSVLink>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyReportPage;