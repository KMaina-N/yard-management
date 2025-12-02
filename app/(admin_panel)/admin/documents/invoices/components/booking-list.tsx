"use client";

import React, { useState } from "react";
import AttachmentList from "./attachment-list";
import { Button } from "@/components/ui/button";

interface Booking {
  id: string;
  bookingDate: string;
  yard?: { name: string };
  goods: any[];
  attachments: any[];
}

interface BookingsListProps {
  bookings: Booking[];
}

const BookingsList: React.FC<BookingsListProps> = ({ bookings }) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      {/* <h2 className="text-xl font-bold">Bookings</h2> */}

      <div className="grid gap-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className={
              selectedBooking?.id === b.id
                ? "p-4 border-2 border-gray-900 rounded-lg cursor-pointer bg-blue-50"
                : "p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            }
            onClick={() => setSelectedBooking(b)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800 ">Booking ID: <span className="font-semibold uppercase">{b.id.split("-")[0]}</span></p>
                <p className="text-gray-500">Yard: {b.yard?.name || "N/A"}</p>
                <p className="text-gray-500">
                  Date: {new Date(b.bookingDate).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBooking(b);
                }}
              >
                View Attachments
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedBooking && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">
            Attachments for Booking: {selectedBooking.id}
          </h3>
          <AttachmentList attachments={selectedBooking.attachments} />
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => setSelectedBooking(null)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
