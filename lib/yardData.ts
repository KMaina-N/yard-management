// lib/yardData.ts
import { YardSlot } from "@/types/yard";

export const yardSlots: YardSlot[] = [
  { id: "1", name: "Gate 1", type: "gate", x: 50, y: 50, width: 100, height: 50, status: "free" },
  { id: "2", name: "Parking A1", type: "parking", x: 200, y: 50, width: 100, height: 50, status: "occupied" },
  { id: "3", name: "Loading Dock 1", type: "loading", x: 50, y: 150, width: 250, height: 60, status: "reserved" },
  { id: "4", name: "Warehouse", type: "building", x: 50, y: 250, width: 300, height: 150, status: "free" },
];
