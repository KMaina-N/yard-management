import { getSession } from "@/lib/authentication";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const session = await getSession()
  const yards = await prisma.yard.findMany({
    include: {
        productTypes: true,
    }
  });
  return NextResponse.json(yards, { status: 200 });
};

export const POST = async (req: NextRequest) => {
  const session = await getSession();
  const body = await req.json();
  const { name, address } = body;
  const yard = await prisma.yard.create({
    data: {
      name,
      address,
    },
  });
  return NextResponse.json(yard, { status: 201 });
};
