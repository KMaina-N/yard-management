import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const users = await prisma.user.findMany({
        select: {
            email: true,
            id: true,
            role: true,
            name: true,
            company: true,
            lastLogin: true,
            createdAt: true,
            accountActive: true,
        }
    });
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
};
