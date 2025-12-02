import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const GET = async () => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        attachments: { some: {} },
      },
      orderBy: { createdAt: "desc" },
      include: {
        attachments: true,
      },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
};
