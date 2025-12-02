import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
type Params = Promise<{ week: string }>;

export const GET =async (req: NextRequest, { params }: { params: Params })  => {
  const { week } = await params;
  console.log("Fetching schedule for week:", week);
  try {
    const schedule = await prisma.deliverySchedule.findUnique({
      where: { week },
      include: { days: true },
    });
    // if (!schedule) {
    //   return NextResponse.json(
    //     { error: "Schedule not found" },
    //     { status: 404 }
    //   );
    // }
    return NextResponse.json(schedule, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch schedule" },
      { status: 500 }
    );
  }
};
