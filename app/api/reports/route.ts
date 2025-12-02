import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "daily"; // daily | monthly | custom
    const dateParam = searchParams.get("date");      // YYYY-MM-DD for daily
    const monthParam = searchParams.get("month");    // YYYY-MM for monthly
    const startParam = searchParams.get("start");    // YYYY-MM-DD for custom
    const endParam = searchParams.get("end");        // YYYY-MM-DD for custom

    let startDate: Date;
    let endDate: Date;

    const today = new Date();

    // Determine date range
    switch (type) {
      case "daily":
        startDate = dateParam ? new Date(dateParam) : new Date(today);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;

      case "monthly":
        if (!monthParam) {
          return NextResponse.json({ error: "month parameter is required for monthly report" }, { status: 400 });
        }
        const [year, month] = monthParam.split("-").map(Number);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
        break;

      case "custom":
        if (!startParam || !endParam) {
          return NextResponse.json({ error: "start and end parameters are required for custom report" }, { status: 400 });
        }
        startDate = new Date(startParam);
        endDate = new Date(endParam);
        endDate.setHours(23, 59, 59, 999);
        break;

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }

    // Fetch bookings within date range
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: { gte: startDate, lte: endDate },
      },
      include: {
        goods: {
          include: {
            type: true, // product type details
          },
        },
        attachments: true,
        user: true,
        yard: true,
      },
    });

    // Summarize report data
    const totalBookings = bookings.length;
    const totalGoods = bookings.reduce((acc, booking) => {
      return acc + booking.goods.reduce((gAcc, g) => gAcc + g.quantities, 0);
    }, 0);

    // Group by product type
    const goodsByType: Record<string, { name: string; quantities: number; pallets: number }> = {};
    bookings.forEach((b) => {
      b.goods.forEach((g) => {
        if (!goodsByType[g.type.name]) {
          goodsByType[g.type.name] = { name: g.type.name, quantities: 0, pallets: 0 };
        }
        goodsByType[g.type.name].quantities += g.quantities;
        goodsByType[g.type.name].pallets += g.numberOfPallets || 0;
      });
    });

    return NextResponse.json({
      reportType: type,
      startDate,
      endDate,
      totalBookings,
      totalGoods,
      goodsByType: Object.values(goodsByType),
      bookings,
    });
  } catch (error) {
    console.error("Report generation failed:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
