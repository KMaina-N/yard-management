import { prisma } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/services/bookingConfirmation";
import { sendCustomerRescheduleEmail } from "@/services/rescheduleNotification";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
  const { id } = await params;
  const body = await req.json();

  const { searchParams } = new URL(req.url);
  console.log("Search Params:", searchParams.toString());
  const isReschedule = searchParams.get("reschedule");
  const isConfirmed = searchParams.get("confirmed");
  const by = searchParams.get("by");

  if (isReschedule && by === "user") {
    // notify the admin about the reschedule request
  }
  if (!body) {
    return NextResponse.json({ message: "No data provided" }, { status: 400 });
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: { ...body },
    include: {
      user: true,
      yard: true,
      goods: true,
    },
  });
  const createdBy = updatedBooking.userId;
  const user = await prisma.user.findUnique({
    where: { id: createdBy },
  });
  const email = user?.email || "";
  const userName = user?.name || "Customer";
  const formattedDate = updatedBooking.bookingDate.toISOString();
  const bookingId = updatedBooking.id.split("-")[0].toUpperCase();

  if (isReschedule && by === "admin") {
    // notify the requester about the reschedule
    await sendCustomerRescheduleEmail(
      email,
      bookingId,
      userName,
      formattedDate
    );
  }

  const productTypes = await prisma.productType.findMany();

  if (isConfirmed) {
    // Prepare goods data with product type information
    const goodsData = updatedBooking.goods.map((good) => {
      const productType = productTypes.find((pt) => pt.id === good.typeId);
      return {
        productType: {
          name: productType?.name || "",
          description: productType?.description || "",
        },
        quantities: good.quantities,
        numberOfPallets: good.numberOfPallets ?? 0,
      };
    });

    await sendBookingConfirmationEmail(
      email,
      bookingId,
      formattedDate,
      updatedBooking?.yard?.name || "",
      updatedBooking?.yard?.address || "",
      goodsData,
      userName
    );
  }

  return NextResponse.json({ message: "Booking updated successfully" });
};
