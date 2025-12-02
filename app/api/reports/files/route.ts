import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const savedFiles = await prisma.report.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(savedFiles);
    } catch (error) {
        console.error("Error fetching report files:", error);
        return NextResponse.json(
            { message: "Error fetching report files", error: (error as Error).message },
            { status: 500 }
        );
    }
}