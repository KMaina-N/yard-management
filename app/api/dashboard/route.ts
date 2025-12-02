// /app/api/dashboard/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Dashboard API
 * Query params:
 *  - date_from (ISO date string, inclusive)
 *  - date_to   (ISO date string, inclusive)
 *  - yardId
 *  - productTypeId
 *
 * Returns:
 *  - bookingsStatus (grouped by booking.status)
 *  - goodsByType (sum quantities in range / filtered)
 *  - yardUtilization (booked quantities per yard + rate using yard.capacity)
 *  - deliverySchedules (only schedules/days in range; each day is augmented with bookedQty, scheduledCapacity, difference, status)
 */

const toDate = (v?: string | null) => (v ? new Date(v) : undefined);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const dateFromRaw = searchParams.get("date_from");
    const dateToRaw = searchParams.get("date_to");
    const yardId = searchParams.get("yardId");
    const productTypeId = searchParams.get("productTypeId");

    const dateFrom = toDate(dateFromRaw);
    const dateTo = toDate(dateToRaw);

    // Build bookingDate filter
    const bookingDateFilter =
      dateFrom || dateTo
        ? {
            bookingDate: {
              ...(dateFrom ? { gte: dateFrom } : {}),
              ...(dateTo ? { lte: dateTo } : {}),
            },
          }
        : undefined;

    // --- BOOKINGS STATUS ---
    const bookingsStatus = await prisma.booking.groupBy({
      by: ["status"],
      _count: { status: true },
      where: {
        ...(bookingDateFilter ?? {}),
        ...(yardId ? { yardId } : {}),
        ...(productTypeId
          ? { goods: { some: { typeId: productTypeId } } }
          : {}),
      },
    });

    // --- GOODS BY TYPE ---
    const goodsByType = await prisma.goods.groupBy({
      by: ["typeId"],
      _sum: { quantities: true },
      where: {
        ...(productTypeId ? { typeId: productTypeId } : {}),
        ...(bookingDateFilter
          ? { booking: bookingDateFilter.bookingDate ? bookingDateFilter : {} }
          : {}),
      },
    });

    const totalGoods = goodsByType.reduce(
      (sum, g) => sum + (g._sum.quantities ?? 0),
      0
    );

    const productTypes = await prisma.productType.findMany();
    const goodsByTypeWithNames = goodsByType.map((g) => {
      const pt = productTypes.find((p) => p.id === g.typeId);
      const qty = g._sum.quantities ?? 0;
      return {
        type: { id: g.typeId, name: pt?.name ?? "Unknown" },
        _sum: { quantities: qty },
        percentOfTotal: totalGoods ? (qty / totalGoods) * 100 : 0,
      };
    });

    // --- YARD UTILIZATION ---
    const goodsInRange = await prisma.goods.findMany({
      where: {
        ...(productTypeId ? { typeId: productTypeId } : {}),
        ...(bookingDateFilter
          ? { booking: bookingDateFilter.bookingDate ? bookingDateFilter : {} }
          : {}),
      },
      include: { booking: { select: { yardId: true, bookingDate: true } } },
    });

    // Aggregate booked quantities per yard
    const bookedByYard: Record<string, number> = {};
    for (const g of goodsInRange) {
      const yard = g.booking?.yardId;
      if (!yard) continue;
      bookedByYard[yard] = (bookedByYard[yard] ?? 0) + (g.quantities ?? 0);
    }

    const yards = await prisma.yard.findMany(
      yardId ? { where: { id: yardId } } : undefined
    );

    const yardUtilizationWithRate = yards.map((y) => {
      const bookedQty = bookedByYard[y.id] ?? 0;
      const utilizationRate =
        y.capacity && y.capacity > 0 ? (bookedQty / y.capacity) * 100 : 0;
      return {
        ...y,
        booked: bookedQty,
        utilizationRate,
      };
    });

    // --- DELIVERY SCHEDULES ---
    const deliverySchedules = await prisma.deliverySchedule.findMany({
      include: { days: true },
      orderBy: { week: "asc" },
    });

    // Build date => bookedQty map
    const bookingsQtyByDate: Record<string, number> = {};
    for (const g of goodsInRange) {
      const bd = g.booking?.bookingDate;
      if (!bd) continue;
      const key = isoDate(new Date(bd));
      bookingsQtyByDate[key] = (bookingsQtyByDate[key] ?? 0) + (g.quantities ?? 0);
    }

    // Map schedules
    const filteredSchedules = deliverySchedules
      .map((s) => {
        const filteredDays = s.days
          .filter((d) => {
            if (!dateFrom && !dateTo) return true;
            const day = new Date(d.date);
            if (dateFrom && day < dateFrom) return false;
            if (dateTo && day > dateTo) return false;
            return true;
          })
          .map((d) => {
            const key = isoDate(new Date(d.date));
            const bookedQty = bookingsQtyByDate[key] ?? 0;
            const scheduledCapacity = d.capacity ?? 0;
            const diff = bookedQty - scheduledCapacity;
            const status =
              bookedQty > scheduledCapacity
                ? "OVERBOOKED"
                : bookedQty < scheduledCapacity
                ? "UNDERUTILIZED"
                : "BALANCED";
            return {
              id: d.id,
              date: d.date,
              scheduledCapacity,
              bookedQty,
              difference: diff,
              status,
              isSaved: d.isSaved,
            };
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (filteredDays.length === 0) return null;

        const totalScheduled = filteredDays.reduce(
          (sum, d) => sum + (d.scheduledCapacity ?? 0),
          0
        );
        const totalBooked = filteredDays.reduce(
          (sum, d) => sum + (d.bookedQty ?? 0),
          0
        );

        const totalCapacity_ = deliverySchedules
          .flatMap((sched) => sched.days)
          .reduce((sum, d) => sum + (d.capacity ?? 0), 0);

        console.log("Total capacity across all schedules in range:", totalCapacity_);
        
        const utilizationRate =
          totalScheduled > 0 ? (totalBooked / totalScheduled) * 100 : 0;

        return {
          ...s,
          days: filteredDays,
          totalScheduled,
          totalBooked,
          utilizationRate
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return NextResponse.json({
      bookingsStatus,
      goodsByType: goodsByTypeWithNames,
      yardUtilization: yardUtilizationWithRate,
      deliverySchedules: filteredSchedules,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
};
