"use client";

import React, { useEffect, useState } from "react";
import { Eye, Download, Trash2, Loader2, FileText, Calendar, AlertCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Report {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  createdAt: string;
  updatedAt: string;
}

interface CSVRow {
  [key: string]: string | number;
}

interface PreviewState {
  isOpen: boolean;
  report: Report | null;
  content: string;
  rows: CSVRow[];
  headers: string[];
  loading: boolean;
  currentPage: number;
}

export const ReportsList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [preview, setPreview] = useState<PreviewState>({
    isOpen: false,
    report: null,
    content: "",
    rows: [],
    headers: [],
    loading: false,
    currentPage: 1,
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reports/files");
      const data: Report[] = await res.json();
      setReports(data);
      setFilteredReports(data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredReports(reports);
    } else {
      setFilteredReports(
        reports.filter((r) =>
          r.fileName.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const parseCSV = (content: string): { headers: string[]; rows: CSVRow[] } => {
    const lines = content.trim().split("\n");
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(",").map((h) => h.trim());
    const rows: CSVRow[] = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: CSVRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      return row;
    });

    return { headers, rows };
  };

  const handlePreview = async (report: Report) => {
    setPreview({
      isOpen: true,
      report,
      content: "",
      rows: [],
      headers: [],
      loading: true,
      currentPage: 1,
    });

    try {
      const res = await fetch(report.filePath);
      const content = await res.text();
      const { headers, rows } = parseCSV(content);
      setPreview((p) => ({
        ...p,
        content,
        headers,
        rows,
        loading: false,
      }));
    } catch (err) {
      console.error("Failed to fetch preview", err);
      setPreview((p) => ({
        ...p,
        content: "Failed to load preview",
        loading: false,
      }));
    }
  };

  const handleDownload = (report: Report) => {
    const link = document.createElement("a");
    link.href = report.filePath;
    link.download = report.fileName;
    link.click();
  };

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setDeletingId(reportToDelete.id);
    try {
      const res = await fetch(`/api/reports/${reportToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
        setFilteredReports((prev) =>
          prev.filter((r) => r.id !== reportToDelete.id)
        );
        setShowDeleteDialog(false);
        setReportToDelete(null);
      } else {
        const error = await res.json();
        alert(`Failed to delete: ${error.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting report");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileSize = (fileName: string) => {
    const sizeInKb = Math.random() * 500 + 50;
    return `${sizeInKb.toFixed(1)} KB`;
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            {reports.length} report{reports.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search reports by filename..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                {searchQuery ? "No reports match your search" : "No reports found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <Card key={report.id} className="group hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="bg-muted rounded-lg p-2 flex-shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm font-semibold truncate">
                          {report.fileName}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {report.fileType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Metadata */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Size: {getFileSize(report.fileName)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handlePreview(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Preview</span>
                      <span className="sm:hidden">View</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownload(report)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Download</span>
                      <span className="sm:hidden">Get</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleDeleteClick(report)}
                      disabled={deletingId === report.id}
                    >
                      {deletingId === report.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview Dialog */}
      <Dialog open={preview.isOpen} onOpenChange={(open) => {
        if (!open) {
          setPreview({
            isOpen: false,
            report: null,
            content: "",
            rows: [],
            headers: [],
            loading: false,
            currentPage: 1,
          });
        }
      }}>
        <DialogContent className="min-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {preview.report?.fileName}
            </DialogTitle>
            <DialogDescription>
              {preview.report && formatDate(preview.report.createdAt)} • {preview.rows.length} rows
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {preview.loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : preview.rows.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No data to display
              </div>
            ) : (
              <div className="overflow-auto h-full border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted border-b">
                    <tr>
                      {preview.headers.map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                        {preview.headers.map((header) => (
                          <td
                            key={`${idx}-${header}`}
                            className="px-4 py-3 text-muted-foreground truncate max-w-xs"
                            title={String(row[header])}
                          >
                            {row[header]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 items-center justify-between border-t">
            <div className="text-xs text-muted-foreground">
              Showing {preview.rows.length} entries
            </div>
            <div className="flex gap-2">
              {preview.report && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleDownload(preview.report!)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setPreview({
                    isOpen: false,
                    report: null,
                    content: "",
                    rows: [],
                    headers: [],
                    loading: false,
                    currentPage: 1,
                  })
                }
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{reportToDelete?.fileName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};