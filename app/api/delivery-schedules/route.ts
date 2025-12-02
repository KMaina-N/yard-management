import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  const { week, totalCapacity, tolerance, days } = await req.json();

  try {
    // Check if schedule exists
    let schedule = await prisma.deliverySchedule.findUnique({
      where: { week },
      include: { days: true },
    });

    if (schedule) {
      // Delete existing days
      await prisma.deliveryRuleDay.deleteMany({
        where: { deliveryScheduleId: schedule.id },
      });

      // Update schedule
      schedule = await prisma.deliverySchedule.update({
        where: { id: schedule.id },
        data: {
          totalCapacity,
          tolerance,
          days: {
            create: days
              .filter(
                (d: any) => d.capacity !== undefined && d.capacity !== null
              )
              .map((d: any) => ({
                date: new Date(d.date),
                capacity: d.capacity ?? 0,
                isSaved: d.isSaved ?? false,
              })),
          },
        },
        include: { days: true },
      });
    } else {
      // Create new schedule
      schedule = await prisma.deliverySchedule.create({
        data: {
          week,
          totalCapacity,
          tolerance,
          days: {
            create: days.map((d: any) => ({
              date: new Date(d.date),
              capacity: d.capacity,
              isSaved: d.isSaved ?? false,
            })),
          },
        },
        include: { days: true },
      });
    }

    return NextResponse.json(schedule, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Failed to create schedule" },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const schedules = await prisma.deliverySchedule.findMany({
      include: { days: true },
      orderBy: { week: "asc" },
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch schedules" }, { status: 500 });
  }
};