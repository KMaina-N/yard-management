// app/api/check-availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export const POST = async (req: NextRequest) => {
  try {
    const { bookingData, userId } = await req.json();

    console.log("Booking Data Received:", bookingData);

    // const userId = "dadadada";

    console.log(bookingData);

    if (!bookingData?.goods || !Array.isArray(bookingData.goods)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const daysToCheck = 60;
    const today = new Date();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const supplierName = user?.company || "";

    const supplierRules = await prisma.supplierRule.findMany();


    const availability: Record<string, any[]> = {};
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Sum total requested quantities from payload
    const totalRequestedQty = bookingData.goods.reduce(
      (sum: number, item: any) => sum + (item.quantities || 0),
      0
    );

    // Collect product types from request
    const productTypes = bookingData.goods.map((item: any) => item.type);

    for (let i = 0; i < daysToCheck; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateStr = `${startOfDay.getFullYear()}-${pad(
        startOfDay.getMonth() + 1
      )}-${pad(startOfDay.getDate())}`;
      availability[dateStr] = [];

      const dayName = dayNames[d.getDay()];

      const currentSupplierRule = supplierRules.find(
        (r) => r.supplierName === supplierName && r.day === dayName
      );

      const otherSuppliersCapacity = supplierRules
        .filter((r) => r.supplierName !== supplierName && r.day === dayName)
        .reduce((sum, r) => sum + r.allocatedCapacity, 0);

      const dayRule = await prisma.deliveryRuleDay.findFirst({
        where: { date: { gte: startOfDay, lte: endOfDay } },
        include: { deliverySchedule: true },
      });

      const defaultCapacity = dayRule?.capacity ?? 0;
      const tolerance = dayRule?.deliverySchedule?.tolerance ?? 0;

      const bookedGoods = await prisma.goods.findMany({
        where: {
          booking: { bookingDate: { gte: startOfDay, lte: endOfDay } },
          typeId: { in: productTypes },
        },
        include: { booking: { select: { userId: true } } },
      });

      let maxCapacity: number;
      let bookedQtyForSupplier: number;

      if (currentSupplierRule) {
        maxCapacity = currentSupplierRule.allocatedCapacity;

        bookedQtyForSupplier = bookedGoods
          .filter((g) => g.booking.userId === userId)
          .reduce((sum, g) => sum + g.quantities, 0);
      } else {
        maxCapacity = Math.max(0, defaultCapacity - otherSuppliersCapacity);

        bookedQtyForSupplier = bookedGoods.reduce(
          (sum, g) => sum + g.quantities,
          0
        );
      }

      const remainingCapacity = Math.max(
        0,
        maxCapacity + tolerance - bookedQtyForSupplier
      );
      const isAvailable =
        totalRequestedQty <= remainingCapacity && defaultCapacity > 0;

      if (bookedGoods.length > 0) {
        availability[dateStr].push({
          requestedQty: totalRequestedQty,
          currentlyBooked: bookedGoods.reduce(
            (sum, g) => sum + g.quantities,
            0
          ),
          available: false,
          remaining: maxCapacity,
          maxCapacity: maxCapacity,
          message: "Not Available - Day already booked",
        });
        continue;
      }

      availability[dateStr].push({
        requestedQty: totalRequestedQty,
        currentlyBooked: bookedQtyForSupplier,
        available: isAvailable,
        remaining: defaultCapacity > 0 ? remainingCapacity : null,
        maxCapacity: defaultCapacity > 0 ? maxCapacity : null,
        message: isAvailable
          ? "Available"
          : `Exceeds capacity (${remainingCapacity} remaining out of ${maxCapacity})`,
      });
    }

    const response = { success: true, availability };

    // const debugFilePath = join(process.cwd(), "availability-debug.json");
    // await writeFile(debugFilePath, JSON.stringify(response, null, 2), "utf-8");

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
};
