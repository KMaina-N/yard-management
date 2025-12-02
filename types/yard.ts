// types/yard.ts
export type YardSlot = {
  id: string;
  name: string;
  type: "parking" | "gate" | "loading" | "building";
  x: number; // SVG coordinates
  y: number;
  width: number;
  height: number;
  status: "free" | "occupied" | "reserved";
};
