"use server";
import {setHeaders} from '@/lib/set-headers';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getAllBookings = async (month: any, year: any) => {
  const headers = await setHeaders();
  const res = await fetch(
    `${BASE_URL}/api/bookings/filter?month=${month}&year=${year}`,
    { headers }
  );
  const data = await res.json();
  return data;
};
