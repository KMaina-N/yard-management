"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BookingForm, {
  BookingFormData,
} from "@/app/(root)/components/booking-form";
import ScheduledDeliveries from "@/components/scheduled-deliveries";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
// import Hero from "@/components/hero";
// import HeroSection from "@/components/hero";
import UpcomingDeliveries from "../components/upcoming-deliveries";
import RecentActivity from "../components/reent-activities";
import HeroUI from "@/components/ui/heroui";
import TruckLoader from "@/components/truck-loader";
import { getSession } from "@/lib/authentication";
import { useSession } from "../session-provider";
import { getSupplierDashboardData } from "@/app/actions/root/supplier-dashboard";
// import { HeroSection } from "@/components/hero";

type Step = "form" | "slot" | "confirmation";

const Dashboard: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState<Step>("form");
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBay, setSelectedBay] = useState<number>(0);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<any[]>([]);
  const [pendingConfirmations, setPendingConfirmations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const session = useSession();

  useEffect(() => {
    setMounted(true);
    // const fetchSession = async () => {
    //   const session = await getSession();
    //   console.log("Slot Verification Layout - Session:", session);
    // };
    // fetchSession();
  }, []);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        // const response = await fetch("/api/supplier-dashboard");
        const data = await getSupplierDashboardData()
        setUpcomingDeliveries(data.upcomingDeliveries || []);
        setPendingConfirmations(data.pendingDeliveries || []);
      } catch (error) {
        console.error("Error fetching upcoming deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Handlers
  const handleFormSubmit = (data: BookingFormData) => {
    setBookingData(data);
    setStep("slot");
  };

  const handleSlotConfirm = (date: Date, time: string, bay: number) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedBay(bay);
    setStep("confirmation");
  };

  const handleNewBooking = () => {
    setStep("form");
    setBookingData(null);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedBay(0);
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <TruckLoader />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pb-10">
      {/* <HeroSection /> */}
      <div className="relative -top-20">
        <HeroUI />
      </div>
      <div className="container mx-auto p-4 space-y-10">
        {/* Scheduled Deliveries */}
        {/* <UpcomingDeliveries deliveries={upcomingDeliveries} isLoading={loading} /> */}
        <section>
          <div className="grid lg:grid-cols-3 gap-8">
            <UpcomingDeliveries
              deliveries={upcomingDeliveries}
              isLoading={loading}
              title="Upcoming Deliveries"
            />
            <UpcomingDeliveries
              deliveries={pendingConfirmations}
              isLoading={loading}
              title="Pending Confirmations"
            />

            <RecentActivity />
          </div>
        </section>
        {/* <ScheduledDeliveries /> */}
      </div>
    </div>
  );
};

export default Dashboard;
