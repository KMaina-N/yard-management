
"use server";
import { getSession } from "@/lib/authentication";
import { setHeaders } from "@/lib/set-headers";
import { promises as fs } from "fs";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const getCapacityConstraints = async (
  productTypeIds: any[],
  bookingData: any[],

) => {
  const session = await getSession();
  console.log("Session in getCapacityConstraints:", session);
  const userId = session?.userId;
  const headers = await setHeaders();
  const res = await fetch(`${BASE_URL}/api/availability`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productTypeIds, bookingData, userId }),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  const data = await res.json();

  await fs.writeFile("capacity-constraints.json", JSON.stringify(data, null, 2));
  return data;
};

export const getProductTypes = async () => {
  const headers = await setHeaders();
  const res = await fetch(`${BASE_URL}/api/product-types`, {
    method: "GET",
    headers,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}