import { prisma } from "@/lib/prisma";
import { da } from "@faker-js/faker";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const productTypes = await prisma.productType.findMany({
        include: {
            yards: true,
        },
    });
    return NextResponse.json(productTypes, { status: 200 });
}

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    console.log("Received data: ", body);
    // const data = body;
    if(!body) {
        return new Response("No data provided", { status: 400 });
    }
    await prisma.productType.create({
        data: {
            name: body.name,
            dailyCapacity: body.dailyCapacity,
            tolerance: body.tolerance,
            yardId: body.yardId,
        }
    })
    return new Response("Received data: " + JSON.stringify(body), { status: 201 });
}