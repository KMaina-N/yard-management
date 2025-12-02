import { getSession } from "@/lib/authentication";
import { prisma } from "@/lib/prisma";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  
  try {
    const session = await getSession();

    if(!session?.isLoggedIn) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // check if admin and set a where clause for bookings
    let whereClause = {};
    if (session.role !== "admin") {
      whereClause = { userId: session.userId };
    }
    const statuses = ["confirmed", "pending"];
    const today = new Date();

    const productTypes = await prisma.productType.findMany();
    const bookings = await prisma.booking.findMany({
      where: {
        status: { in: statuses },
        bookingDate: { gte: today },
        ...whereClause,
      },
      include: {
        goods: true,
        yard: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      orderBy: { bookingDate: "asc" },
    });

    const formattedDeliveries = bookings.map((delivery) => {
      const { goods, ...rest } = delivery;
      return {
        ...rest,
        bookingDate: delivery.bookingDate.toISOString(),
        productTypes: goods.map((g) => {
          const productType = productTypes.find((pt) => pt.id === g.typeId);
          return {
            id: g.typeId,
            name: productType?.name ?? "Unknown",
            quantity: g.quantities, // uses the correct property from goods table
            numberOfPallets: g.numberOfPallets,
          };
        }),
      };
    });
    const pendingDeliveries = formattedDeliveries.filter(
      (d) => d.status === "pending"
    );
    const upcomingDeliveries = formattedDeliveries.filter(
      (d) => d.status !== "pending"
    );
    return NextResponse.json({ upcomingDeliveries, pendingDeliveries });
  } catch (error) {
    console.error("Error fetching supplier dashboard data:", error);
    return NextResponse.json(
      {
        message: "Error fetching supplier dashboard data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
