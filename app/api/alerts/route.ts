import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function GET() {
  try {
    const todayStart = startOfTodayUTC();

    // Fetch all future delivery days
    const futureDays = await prisma.deliveryRuleDay.findMany({
      where: { date: { gte: todayStart } },
      select: { date: true },
      orderBy: { date: "asc" },
    });

    if (!futureDays || futureDays.length === 0) {
      return NextResponse.json({
        level: "high",
        message: "No delivery days configured for the upcoming period.",
      });
    }

    // Check if any days exist at least 14 days from today
    const day14 = new Date(todayStart.getTime() + 14 * MS_PER_DAY);
    const day30 = new Date(todayStart.getTime() + 30 * MS_PER_DAY);

    const hasAfter14 = futureDays.some(d => d.date >= day14);
    const hasAfter30 = futureDays.some(d => d.date >= day30);

    if (!hasAfter14) {
      // No days beyond 2 weeks
      return NextResponse.json({
        level: "high",
        message: "No delivery days scheduled beyond 2 weeks — urgent.",
      });
    }

    if (!hasAfter30) {
      // Days exist beyond 2 weeks but not 30 days
      return NextResponse.json({
        level: "low",
        message: "No delivery days scheduled beyond 1 month — plan soon.",
      });
    }

    // At least one day exists beyond 30 days
    return NextResponse.json({
      level: "none",
      message: "Delivery schedule planning is sufficient.",
    });
  } catch (err) {
    console.error("delivery warning check failed:", err);
    return NextResponse.json({ error: "Failed to check schedule warnings" }, { status: 500 });
  }
}
