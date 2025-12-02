import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { uploadToAzure } from "@/lib/azure-upload";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData(); // <-- IMPORTANT

    const session = await getSession();
    const userId = session?.userId;
    // const userId = "5486be56-718c-45ad-867a-da8a0b373a9e"
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookingDate = formData.get("bookingDate") as string;
    const bookingTime = formData.get("bookingTime") as string;
    const yardId = formData.get("yardId") as string;

    const goods = JSON.parse(formData.get("goods") as string);

    const attachments = formData.getAll("attachments") as File[];

    console.log("Received booking data:", {
      bookingDate,
      bookingTime,
    });

    // first create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        yardId,
        bookingDate: new Date(bookingDate),
        goods: {
          create: goods.map((g: any) => ({
            typeId: g.type,
            quantities: g.quantities,
            numberOfPallets: g.numberOfPallets ?? null,
          })),
        },
      },
      include: { goods: true },
    });

    // upload attachments
    const blobContainer = "yard-system";
    let uploadedAttachments = [];
    if (attachments && attachments.length > 0) {
      uploadedAttachments = [];
      for (const file of attachments) {
      const { url } = await uploadToAzure(file, blobContainer);
      const saved = await prisma.attachment.create({
        data: {
        bookingId: booking.id,
        filePath: url,
        fileType: file.type,
        },
      });
      uploadedAttachments.push(saved);
      }
    }

    return NextResponse.json(
      { message: "Booking created successfully", booking, attachments: uploadedAttachments },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { message: "Error processing booking", error: (error as Error).message },
      { status: 500 }
    );
  }
};
export const GET = async (req: NextRequest) => {
  const queryParams = req.nextUrl.searchParams;
  const statusFilter = queryParams.get("status");
  const session = await getSession();
  try {
    const bookings = await prisma.booking.findMany({
      where: statusFilter ? { status: statusFilter } : {},
      include: {
        goods: {
          select: {
            typeId: true,
            quantities: true,
            numberOfPallets: true
          }
        },
        yard: true,
        user: {
          select: {
            company: true
          }
        }
        
      },
    });

    const productTypes = await prisma.productType.findMany();
    const formattedBookings = bookings.map((booking) => ({
      ...booking,
      bookingDate: booking.bookingDate.toISOString(),
      productTypes: booking.goods.map((g) => productTypes.find(pt => pt.id === g.typeId)),
    }));
    return NextResponse.json(formattedBookings , { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Error fetching bookings", error: (error as Error).message },
      { status: 500 }
    );
  }
};
