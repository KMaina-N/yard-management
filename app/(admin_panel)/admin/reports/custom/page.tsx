"use client";

import React, { useState } from "react";
import { CSVLink } from "react-csv";
import {
  Calendar,
  TrendingUp,
  Settings,
  Download,
  Cloud,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ReportState,
  ReportResponse,
  flattenReportData,
  ReportData,
} from "../daily/page";
import DatePicker from "../components/date-picker";
import { ReportsList } from "../components/reports-files";

const CustomReportPage: React.FC = () => {
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [state, setState] = useState<ReportState>({
    reportData: [],
    loading: false,
    error: null,
  });
  const [savingToCloud, setSavingToCloud] = useState<boolean>(false);

  const fetchReport = async (): Promise<void> => {
    if (!start || !end) {
      setState((s) => ({
        ...s,
        error: "Please select both start and end dates",
      }));
      return;
    }

    if (new Date(start) > new Date(end)) {
      setState((s) => ({ ...s, error: "Start date must be before end date" }));
      return;
    }

    setState({ reportData: [], loading: true, error: null });

    try {
      const res = await fetch(
        `/api/reports?type=custom&start=${start}&end=${end}`
      );
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

  function formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const HH = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");

    return `${yyyy}${MM}${dd}_${HH}${mm}${ss}`;
  }

  const handleSaveToCloud = async (): Promise<void> => {
    const confirmed = window.confirm("Save this report to cloud storage?");
    if (!confirmed || state.reportData.length === 0) return;

    setSavingToCloud(true);

    try {
      const headers = Object.keys(state.reportData[0]);
      const csvContent = [headers.join(",")]
        .concat(
          state.reportData.map((row) =>
            headers.map((h) => String(row[h as keyof ReportData])).join(",")
          )
        )
        .join("\n");
      const timestamp = formatDate(new Date());

      const res = await fetch("/api/upload-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: `report_${timestamp}.csv`,
          content: csvContent,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Report saved successfully!\nURL: ${result.url}`);
      } else {
        alert(`Failed to save: ${result.error}`);
      }
    } catch (err) {
      alert("Error saving to cloud");
    } finally {
      setSavingToCloud(false);
    }
  };

  return (
    <div className="flex">
      <Card className="w-full max-w-lg border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-muted-foreground" />
          Custom Report
        </CardTitle>
        <CardDescription>
          Download booking data for a date range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Date</label>
            {/* <Input
              type="date"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                setState((s) => ({ ...s, error: null }));
              }}
              disabled={state.loading}
            /> */}

            <DatePicker
              onChange={(date) => {
                setStart(date);
                setState((s) => ({ ...s, error: null }));
              }}
              date={start}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End Date</label>
            {/* <Input
              type="date"
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                setState((s) => ({ ...s, error: null }));
              }}
              disabled={state.loading}
            /> */}
            <DatePicker
              onChange={(date) => {
                setEnd(date);
                setState((s) => ({ ...s, error: null }));
              }}
              date={end}
            />
          </div>
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
          <div className="border-t pt-4 space-y-2">
            <p className="text-xs text-muted-foreground">
              {state.reportData.length} entries found
            </p>
            <CSVLink
              data={state.reportData}
              filename={`custom-report_${start}_to_${end}.csv`}
            >
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CSVLink>
            <Button
              onClick={handleSaveToCloud}
              disabled={savingToCloud}
              variant="secondary"
              className="w-full"
            >
              {savingToCloud ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  Save to Cloud
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    <div className="">
      <ReportsList key={savingToCloud ? "reload-" + Date.now() : "static"} />
    </div>
    </div>
  );
};

export default CustomReportPage;
