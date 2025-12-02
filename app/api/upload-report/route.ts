import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToAzure } from "@/lib/azure-upload"; // your original helper

export async function POST(req: Request) {
  try {
    const { filename, content } = await req.json();

    if (!filename || !content) {
      return NextResponse.json(
        { error: "filename and content are required" },
        { status: 400 }
      );
    }

    // Convert CSV string to a File object
    const csvFile = new File([content], filename, { type: "text/csv" });
    const blobContainer = "yard-system";

    // Upload to Azure using your original helper
    const { url } = await uploadToAzure(csvFile, blobContainer);

    // Save record in Report table
    const report = await prisma.report.create({
      data: {
        fileName: filename,
        filePath: url,
        fileType: "csv",
      },
    });

    return NextResponse.json({ url, reportId: report.id });
  } catch (error) {
    console.error("Upload report failed:", error);
    return NextResponse.json(
      { error: "Failed to upload report" },
      { status: 500 }
    );
  }
}
