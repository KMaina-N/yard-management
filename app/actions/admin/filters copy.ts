"use server";
import { setHeaders } from "@/lib/set-headers";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const filterByDate = async (date: Date) => {
  const headers = await setHeaders();
  const res = await fetch(
    `${BASE_URL}/api/bookings/filter?month=${
      date.getMonth() + 1
    }&year=${date.getFullYear()}`,
    { headers }
  );
  const data = await res.json();
  return data;
};

export const filterBySearch = async (searchTerm: string) => {
  try {
    const headers = await setHeaders();
    const res = await fetch(
      `${BASE_URL}/api/bookings/filter?search=${searchTerm}`,
      { headers }
    );
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error filtering by search:", error);
    return null;
  }
};

export const filterByStatus = async (status: string) => {
  const headers = await setHeaders();
  const res = await fetch(
    `${BASE_URL}/api/bookings/filter?status=${status}`,
    { headers }
  );
  const data = await res.json();
  return data;
};
