import { prisma } from "@/lib/prisma";
import { sendSupplierAccountActivatedEmail } from "@/services/accounts";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
  const { id } = await params;
  const body = await req.json();
  const { searchParams } = new URL(req.url);
  const isActivate = searchParams.get("activate");
  console.log("Updating user with ID:", id);
  console.log("Request body:", body);

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return new Response("User not found", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...body },
    });
    if (isActivate) {
      await sendSupplierAccountActivatedEmail({
        to: updatedUser.email,
        userName: updatedUser.name || "User",
        userEmail: updatedUser.email,
        supportLink: "https://yard-management-system.vercel.app/login"
      });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error },
      { status: 500 }
    );
  }
};
