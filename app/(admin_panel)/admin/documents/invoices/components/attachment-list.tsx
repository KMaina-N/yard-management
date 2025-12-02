"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, X, Grid2X2, List, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

interface Attachment {
  id: string;
  filePath: string;
  fileType?: string;
  createdAt: string;
}

interface AttachmentListProps {
  attachments: Attachment[];
}

const AttachmentList: React.FC<AttachmentListProps> = ({ attachments }) => {
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "date" | "type">("date");
  const [xlsxData, setXlsxData] = useState<any[]>([]);

  const filteredAttachments = useMemo(() => {
    return attachments
      .filter(att => att.filePath.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortKey === "date") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortKey === "name") return a.filePath.localeCompare(b.filePath);
        if (sortKey === "type") return (a.fileType || "").localeCompare(b.fileType || "");
        return 0;
      });
  }, [attachments, searchTerm, sortKey]);

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const att of filteredAttachments) {
      const response = await fetch(att.filePath);
      const blob = await response.blob();
      zip.file(att.filePath.split("/").pop() || "file", blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    saveAs(content, `yard_management-${timestamp}.zip`);
  };

  const handleXlsxPreview = async (file: Attachment) => {
    try {
    //   const response = await fetch(file.filePath);
    //   const arrayBuffer = await response.arrayBuffer();
    //   const workbook = XLSX.read(arrayBuffer, { type: "array" });
    //   const sheetName = workbook.SheetNames[0];
    //   const sheet = workbook.Sheets[sheetName];
    //   const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    //   setXlsxData(jsonData);
    //   setSelectedFile(file);
    } catch (err) {
      console.error("Error reading XLSX:", err);
      toast.error("Failed to preview XLSX file.");
    }
  };

  const renderPreview = (att: Attachment) => {
    const ext = att.fileType?.split("/")[1] || att.filePath.split(".").pop()?.toLowerCase();
    if (!ext) return <p className="text-gray-500">Preview not available</p>;

    switch (ext) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
        return <img src={att.filePath} alt={att.filePath} className="max-w-full h-auto object-contain rounded-md" />;
      case "pdf":
        return <iframe src={att.filePath} className="flex-1 w-full h-full rounded-md" title={`Preview of ${att.filePath.split("/").pop()}`} />;
      case "txt":
      case "csv":
      case "json":
        return <iframe src={att.filePath} className="w-full h-96 border rounded-md font-mono text-sm" title={`Preview of ${att.filePath.split("/").pop()}`} />;
      case "mp4":
      case "webm":
        return <video controls className="w-full h-auto rounded-md"><source src={att.filePath} type={att.fileType} /></video>;
      case "xlsx":
      case "xls":
        return (
          <div className="overflow-auto max-h-[80vh]">
            <table className="border-collapse border border-gray-300 w-full text-sm">
              <tbody>
                {xlsxData.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="border px-2 py-1">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return <p className="text-gray-500">Preview not available for this file type.</p>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button onClick={() => setViewMode("grid")}><Grid2X2 className="w-4 h-4" /> Grid</Button>
          <Button onClick={() => setViewMode("list")}><List className="w-4 h-4" /> List</Button>
        </div>
        <div className="flex gap-2 items-center">
          <input type="text" placeholder="Search files..." className="border rounded p-1 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <select
            className="border rounded p-1 text-sm"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as any)}
            aria-label="Sort attachments by"
          >
            <option value="date">Date</option>
            <option value="name">Name</option>
            <option value="type">Type</option>
          </select>
          <Button onClick={handleDownloadAll}><Download className="w-4 h-4" /> Download All</Button>
        </div>
      </div>

      {/* Files */}
      <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
        {filteredAttachments.map(att => (
          <div key={att.id} className="p-3 border rounded-lg hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium break-words">{att.filePath.split("/").pop()}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  if (att.fileType?.includes("xlsx") || att.fileType?.includes("xls")) handleXlsxPreview(att);
                  else setSelectedFile(att);
                }}><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" onClick={() => window.open(att.filePath, "_blank")}><Download className="w-4 h-4" /></Button>
              </div>
            </div>
            {viewMode === "grid" && (
              <div className="h-40 flex items-center justify-center bg-gray-50 border rounded-md overflow-hidden">
                {att.fileType?.startsWith("image") ? (
                  <img src={att.filePath} alt={att.filePath.split("/").pop() || "attachment"} className="h-full object-contain" />
                ) : att.fileType?.startsWith("video") ? (
                  <video className="h-full" src={att.filePath} />
                ) : att.fileType?.includes("xlsx") || att.fileType?.includes("xls") ? (
                  <FileSpreadsheet className="w-10 h-10 text-gray-400" />
                ) : (
                  <FileText className="w-10 h-10 text-gray-400" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Preview Overlay */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col p-4">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" onClick={() => { setSelectedFile(null); setXlsxData([]); }}><X className="w-5 h-5" /></Button>
          </div>
          <div className="flex-1 overflow-auto">
            {renderPreview(selectedFile)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentList;
