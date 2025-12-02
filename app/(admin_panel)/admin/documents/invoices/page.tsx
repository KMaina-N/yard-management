"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import BookingsList from "./components/booking-list";
import Search from "./components/search";

const BookingsPage = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [originalBookings, setOriginalBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings/documents");
      const data = await res.json();
      setBookings(data.bookings || []);
      setOriginalBookings(data.bookings || []); // store original list
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // ✨ Reset to original full list
      setBookings(originalBookings);
      return;
    }

    const filtered = originalBookings.filter((booking) =>
      booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setBookings(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Files</h1>
      <div className="mb-4 w-96">
        <Search onSearch={handleSearch} />
      </div>
      <BookingsList bookings={bookings} />
    </div>
  );
};

export default BookingsPage;
