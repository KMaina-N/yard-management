import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  // Extract filters
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");
  const searchQuery = searchParams.get("search") ?? "";
  const warehouseFilter = searchParams.get("warehouse");
  const statusFilter = searchParams.get("status");

  

  const month = monthParam ? parseInt(monthParam, 10) : undefined;
  const year = yearParam ? parseInt(yearParam, 10) : undefined;

  const dateFilter =
    month && year
      ? {
          bookingDate: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1),
          },
        }
      : {};

    if (!month || !year) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        dateFilter.bookingDate = {
            gte: new Date(currentYear, currentMonth, 1),
            lt: new Date(currentYear, currentMonth + 1, 1),
        };
    }

  // Build dynamic OR conditions for search
  const searchFilter =
    searchQuery.length > 0
      ? {
          OR: [
            {
              user: {
                company: { contains: searchQuery },
              },
            },
            { id: { contains: searchQuery } },
            {
              yard: { name: { contains: searchQuery } },
            },
            {
              goods: {
                some: {
                  typeId: {
                    equals: searchQuery, // Adjust if you want to search product names instead
                  },
                },
              },
            },
          ],
        }
      : {};

  const warehouseWhere = warehouseFilter && warehouseFilter !== "all"
    ? { yard: { name: warehouseFilter } }
    : {};

  const statusWhere = statusFilter && statusFilter !== "all"
    ? { status: statusFilter }
    : {};

  const bookings = await prisma.booking.findMany({
    where: {
      ...dateFilter,
      ...searchFilter,
      ...warehouseWhere,
      ...statusWhere,
    },
    include: {
      goods: {
        select: {
          typeId: true,
          quantities: true,
          numberOfPallets: true,
        },
      },
      yard: true,
      user: {
        select: {
          company: true,
        },
      },
    },
  });

   const productTypes = await prisma.productType.findMany();
    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      bookingDate: booking.bookingDate.toISOString(),
      productTypes: booking.goods.map((g) => productTypes.find(pt => pt.id === g.typeId)),
    }));

  return NextResponse.json(formattedBookings, { status: 200 });
};
