import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export const PUT = async (req: NextRequest, { params }: { params: Params }) => {
  const { id } = await params;
  console.log("Received ID for update:", id);
  const body = await req.json();
  console.log("Updating product type ID:", id, "with data:", body);
  if (!body) {
    return NextResponse.json({ message: "No data provided" }, { status: 400 });
  }

    await prisma.productType.update({
      where: { id },
      data: { ...body },
    });

  return NextResponse.json(
    { message: `Product type ${id} updated successfully` },
    { status: 200 }
  );
};
