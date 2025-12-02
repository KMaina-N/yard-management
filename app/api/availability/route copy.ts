import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

export const POST = async (req: NextRequest) => {
  try {
    const { bookingData } = await req.json();

    if (!bookingData?.goods || !Array.isArray(bookingData.goods)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const daysToCheck = 60; // check next 60 days
    const today = new Date();
    // const availability: Record<
    //   string,
    //   {
    //     date: string;
    //     goods: {
    //       type: string;
    //       requestedQty: number;
    //       bookedQty: number;
    //       remaining: number;
    //       available: boolean;
    //       maxCapacity: number;
    //     }[];
    //   }
    // > = {};

    const availability: Record<string, any[]> = {};

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

      const bookedGoods = await prisma.goods.findMany({
        where: {
          booking: {
            bookingDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          typeId: {
            in: bookingData.goods.map((item: any) => item.type), // since payload uses "type"
          },
        },
        include: {
          type: true,
        },
      });

      for (const item of bookingData.goods) {
        const requestedQty = item.quantities || 0;
        console.log(
          "requestedQty for",
          item.type,
          "on",
          dateStr,
          "is",
          requestedQty
        );

        const bookedDays = await prisma.deliveryRuleDay.findMany({
          where: {
            date: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          include: {
            deliverySchedule: true,
          },
        });

        // Sum booked quantity for this product type from Goods table for the date range
        // Sum booked quantity for this product type from bookings table for the date range
        const bookedQtyResult = await prisma.goods.aggregate({
          _sum: { quantities: true },
          where: {
            booking: {
              bookingDate: {
                gte: startOfDay,
                lte: endOfDay,
              },
            },
          },
        });

        const bookedQty = bookedQtyResult._sum.quantities ?? 0;

        const tolerance = bookedDays[0]?.deliverySchedule?.tolerance ?? 0;
        const maxCapacity = bookedDays[0]?.capacity;
        const remaining = Math.max(
          0,
          maxCapacity + tolerance - bookedQty - requestedQty
        );

        const excessBy = maxCapacity + tolerance - bookedQty - requestedQty;
        // let available = remaining >= requestedQty || requestedQty === remaining;
        let available = excessBy >= 0;

        const existingBooking = bookedGoods.find((g) => g.typeId === item.type);
        if (existingBooking) {
          available = false;
        }

        availability[dateStr].push({
          requestedQty,
          currentlyBooked: bookedQty,
          available,
          remaining,
          excessBy,
          productTypeName: item.name, // or item.type if name not available
          maxCapacity,
          message: available
            ? "Available"
            : `Exceeds capacity (${remaining} remaining out of ${maxCapacity})`,
        });
      }
    }

    const response = {
      success: true,
      availability,
    };

    // console.log(JSON.stringify(response, null, 2));

    // save the json response to a file for debugging
    const debugFilePath = join(process.cwd(), "availability-debug.json");
    await writeFile(debugFilePath, JSON.stringify(response, null, 2), "utf-8");

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
};
