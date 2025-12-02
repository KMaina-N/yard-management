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

interface BookingFilters {
  date?: Date;      // filter by month/year
  search?: string;  // search term
  status?: string;  // booking status
}

export const filterBookings = async (filters: BookingFilters = {}) => {
  try {
    const headers = await setHeaders();
    const params = new URLSearchParams();

    // Add date filter (month/year)
    if (filters.date) {
      params.set("month", (filters.date.getMonth() + 1).toString());
      params.set("year", filters.date.getFullYear().toString());
    }

    // Add search filter
    if (filters.search) {
      params.set("search", filters.search);
    }

    // Add status filter
    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    const res = await fetch(`${BASE_URL}/api/bookings/filter?${params.toString()}`, {
      headers,
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error filtering bookings:", error);
    return null;
  }
};