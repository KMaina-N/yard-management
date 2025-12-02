import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
  try {
    const { bookingDate, goods } = await req.json();

    if (!bookingDate || !Array.isArray(goods)) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const date = new Date(bookingDate);
    const results: any = [];

    for (const item of goods) {
      const { type, quantities } = item;

      if (!type) {
        results.push({ type, error: "Product type is missing" });
        continue;
      }

      // Fetch total bookings for this product type on that date
      const totalBooked = await prisma.booking.findMany({
        where: {
          bookingDate: date,
          goods: {
            some: { typeId: type }, // make sure typeId matches schema
          },
        },
        include: { goods: true },
      });

      const bookedQty = totalBooked.reduce((sum, b) => {
        const g = b.goods.find((x) => x.typeId === type);
        return sum + (g?.quantities || 0);
      }, 0);

      // Get product type capacity and tolerance
      const product = await prisma.productType.findUnique({
        where: { id: type },
      });

      if (!product) {
        results.push({ type, error: "Product not found" });
        continue;
      }

      const maxCapacity = product.dailyCapacity + product.tolerance;
      const remainingCapacity = maxCapacity - bookedQty;

      // Only return a result if the requested quantity exceeds remaining capacity
      if (quantities > remainingCapacity) {
        results.push({
          type,
          productTypeName: product.name,
          requestedQuantity: quantities,
          remainingCapacity: remainingCapacity > 0 ? remainingCapacity : 0,
          maxCapacity,
          message: `exceeds available capacity of the day. Remaining ${remainingCapacity > 0 ? remainingCapacity : 0} out of ${maxCapacity}`,
        });
      }
    }

    if (results.length > 0) {
      return NextResponse.json({ success: false, results });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
};
