"use client";
import BookingConfirmation from "@/app/(root)/components/booking-confirmation";
import BookingForm, {
  BookingFormData,
} from "@/app/(root)/components/booking-form";
import ScheduledDeliveries from "@/components/scheduled-deliveries";
import SlotSelector from "@/app/(root)/components/slot-selector";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Boxes } from "lucide-react";
import { getProductTypes } from "@/app/actions/root/create-boooking";
import { format } from "date-fns";
import TruckLoader from "@/components/truck-loader";

type Step = "form" | "slot" | "confirmation";
const RootClient = () => {
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBay, setSelectedBay] = useState<number>(0);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const storeSessionStorage = (key: string, value: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(key, value);
    }
  };

  const clearSessionStorage = (key: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(key);
    }
  };

  const handleFormSubmit = (data: BookingFormData) => {
    console.log("Form Submitted Data:", data);
    setBookingData(data);
    storeSessionStorage("bookingData", JSON.stringify(data));
    setCurrentStep("slot");
  };

  const handleSlotConfirm = async (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);

    const payload = {
      ...bookingData,
      bookingDate: format(date, "yyyy-MM-dd"),
      bookingTime: time,
    };

    console.log("Final Booking Payload:", payload);
    try {
      // 2️⃣ Create FormData for booking submission
      const formData = new FormData();
      formData.append("bookingDate", payload.bookingDate);
      formData.append("bookingTime", payload.bookingTime);
      formData.append("goods", JSON.stringify(payload.goods));

      if (payload.documents && payload.documents.length > 0) {
        payload.documents.forEach((file: File) => {
          formData.append("attachments", file);
        });
      }

      // console.log("Submitting Booking with FormData:", formData.getAll());

      // 3️⃣ Submit booking
      const res = await fetch("/api/bookings", {
        method: "POST",
        body: formData, // do NOT set Content-Type; browser handles multipart
      });

      if (!res.ok) {
        throw new Error(`Booking API error: ${res.statusText}`);
      }

      const result = await res.json();
      console.log("Booking Created:", result);

      // 4️⃣ Clear temporary session storage
      clearSessionStorage("bookingData");
      setCurrentStep("confirmation");

      // alert("Booking successfully created!");
      toast.success("Booking successfully created!");
    } catch (err) {
      console.error("Validation/Booking Error:", err);
      alert(
        "There was an error processing your booking. See console for details."
      );
    }
  };

  const handleNewBooking = () => {
    setCurrentStep("form");
    setBookingData(null);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedBay(0);
  };

  const [productTypes, setProductTypes] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        // const response = await fetch("/api/product-types");
        // const data = await response.json();
        const data = await getProductTypes();
        setProductTypes(data);
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProductTypes();
  }, []);
  if (!isClient) {
    return <div className="flex justify-center items-center h-[70vh]">
  <TruckLoader />
</div>

  }
  return (
    <>
      {currentStep === "form" && (
        <BookingForm onNext={handleFormSubmit} productTypes={productTypes} />
      )}
      {currentStep === "slot" && bookingData && (
        <SlotSelector
          bookingData={bookingData}
          setBookingData={setBookingData}
          onBack={() => setCurrentStep("form")}
          onConfirm={handleSlotConfirm}
          productTypeIds={productTypes}
        />
      )}
      {currentStep === "confirmation" && bookingData && selectedDate && (
        <BookingConfirmation
          bookingData={bookingData}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedBay={selectedBay}
          onNewBooking={handleNewBooking}
          productTypes={productTypes}
        />
      )}
    </>
  );
};

export default RootClient;
