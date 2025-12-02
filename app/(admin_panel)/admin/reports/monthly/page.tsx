"use client";

import React, { useState } from "react";
import { CSVLink } from "react-csv";
import { Calendar, TrendingUp, Settings, Download, Cloud, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportState, ReportResponse, flattenReportData } from "../daily/page";

const MonthlyReportPage: React.FC = () => {
  const [month, setMonth] = useState<string>("");
  const [state, setState] = useState<ReportState>({
    reportData: [],
    loading: false,
    error: null,
  });

  const fetchReport = async (): Promise<void> => {
    if (!month) {
      setState((s) => ({ ...s, error: "Please select a month" }));
      return;
    }

    setState({ reportData: [], loading: true, error: null });

    try {
      const res = await fetch(`/api/reports?type=monthly&month=${month}`);
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
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          Monthly Report
        </CardTitle>
        <CardDescription>Download booking data for a specific month</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Month</label>
          <Input
            type="month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setState((s) => ({ ...s, error: null }));
            }}
            disabled={state.loading}
          />
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
            <CSVLink data={state.reportData} filename={`monthly-report_${month}.csv`}>
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

export default MonthlyReportPage;