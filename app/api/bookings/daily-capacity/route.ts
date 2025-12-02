import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { productTypeIds, bookingData } = await req.json();

    if (!Array.isArray(productTypeIds) || !bookingData?.goods) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const daysToCheck = 60; // number of days to check
    const today = new Date();
    const availability: Record<string, any[]> = {};

    for (let i = 0; i < daysToCheck; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      // Set start and end of day
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const dateStr = startOfDay.toISOString().split("T")[0];
      availability[dateStr] = [];

      for (const product of productTypeIds) {
        const requestedItem = bookingData.goods.find((g: any) => g.type === product.id);
        const requestedQty = requestedItem?.quantities || 0;

        // Fetch bookings for this product for the day
        const bookings = await prisma.booking.findMany({
          where: {
            bookingDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            goods: {
              some: { typeId: product.id },
            },
          },
          include: { goods: true },
        });

        const bookedQty = bookings.reduce((sum, b) => {
          const g = b.goods.find((x) => x.typeId === product.id);
          return sum + (g?.quantities || 0);
        }, 0);

        console.log(
          "Total booked quantity on",
          dateStr,
          "for Product ID:",
          product.id,
          "is",
          bookedQty
        );

        const maxCapacity = product.dailyCapacity + product.tolerance;
        const remainingCapacity = Math.max(0, maxCapacity - bookedQty);

        availability[dateStr].push({
          available: remainingCapacity >= requestedQty,
          remaining: remainingCapacity,
          productTypeName: product.name,
          maxCapacity,
          message:
            remainingCapacity >= requestedQty
              ? "Available"
              : `Exceeds capacity (${remainingCapacity} remaining out of ${maxCapacity})`,
        });
      }
    }

    return NextResponse.json({ success: true, availability });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
};
