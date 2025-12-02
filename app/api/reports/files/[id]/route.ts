import { deleteFromAzure } from "@/lib/azure-upload";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


type Params = Promise<{ id: string }>;
export const DELETE = async (req: NextRequest, { params }: { params: Params }) => {
    try {
      const { id } = await params;
      if (!id) return NextResponse.json({ message: "Missing rule ID" }, { status: 400 });
        const reportToDelete = await prisma.report.findUnique({ where: { id } });
        if (!reportToDelete) {
            return NextResponse.json({ message: "Report not found" }, { status: 404 });
        }
        await prisma.report.delete({ where: { id } });
        await deleteFromAzure(reportToDelete.filePath, "yard-system", reportToDelete.fileName);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting report file:", error);
        return NextResponse.json(
            { message: "Error deleting report file", error: (error as Error).message },
            { status: 500 }
        );
    }
}