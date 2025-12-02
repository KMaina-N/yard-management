import { NextResponse } from "next/server";

// Mock data for yard slots
const yardSlots = [
  { id: "1", name: "Slot A1", x: 50, y: 50, width: 100, height: 50, status: "free" },
  { id: "2", name: "Slot A2", x: 200, y: 50, width: 100, height: 50, status: "occupied" },
  { id: "3", name: "Gate 1", x: 50, y: 150, width: 250, height: 50, status: "free" },
];

export async function GET() {
  return NextResponse.json(yardSlots);
}
