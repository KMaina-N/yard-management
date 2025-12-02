import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async () => {
  try {
    const rules = await prisma.supplierRule.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rules);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching supplier rules" }, { status: 500 });
  }
};

const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

async function validateRule(day: string, allocatedCapacity: number) {
  const weekdayIndex = daysOfWeek.indexOf(day);
  if (weekdayIndex === -1) throw new Error("Invalid day value");

  // Get future delivery rule days matching weekday
  const today = new Date();
  const ruleDays = await prisma.deliveryRuleDay.findMany({
    where: {
      date: { gte: today },
    },
  });

  const matchingDays = ruleDays.filter(d => new Date(d.date).getDay() === weekdayIndex);

  if (matchingDays.length === 0) {
    return { valid: false, message: "Capacity must be set in Delivery Rules before setting a special rule for this supplier." };
  }

  // See if allocated capacity exceeds max allowed
  const maxDayCapacity = Math.max(...matchingDays.map(d => d.capacity));

  if (allocatedCapacity > maxDayCapacity) {
    return {
      valid: false,
      message: `Allocated capacity exceeds the limit. Max allowed: ${maxDayCapacity} for ${day}.`,
    };
  }

  return { valid: true };
}

export const POST = async (req: NextRequest) => {
  try {
    const { supplierName, day, allocatedCapacity, tolerance, deliveryEmail } = await req.json();
    if (!supplierName || !day || allocatedCapacity == null) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const validation = await validateRule(day, allocatedCapacity);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const newRule = await prisma.supplierRule.create({
      data: { supplierName, day, allocatedCapacity, tolerance: tolerance ?? 0, deliveryEmail },
    });

    return NextResponse.json(newRule, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error creating supplier rule" }, { status: 500 });
  }
};


export const PUT = async (req: NextRequest) => {
  try {
    const { id, supplierName, day, allocatedCapacity, tolerance, deliveryEmail } = await req.json();
    if (!id) return NextResponse.json({ message: "Missing rule ID" }, { status: 400 });

    const validation = await validateRule(day, allocatedCapacity);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const updatedRule = await prisma.supplierRule.update({
      where: { id },
      data: { supplierName, day, allocatedCapacity, tolerance: tolerance ?? 0, deliveryEmail },
    });

    return NextResponse.json(updatedRule);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating supplier rule" }, { status: 500 });
  }
};


export const DELETE = async (req: NextRequest) => {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "Missing rule ID" }, { status: 400 });

    await prisma.supplierRule.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting supplier rule" }, { status: 500 });
  }
};
