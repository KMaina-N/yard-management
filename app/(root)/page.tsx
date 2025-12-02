import BookingForm from "@/app/(root)/components/booking-form";
// import Hero from "@/components/hero";
import YardMap from "@/components/YardMap";
import Image from "next/image";
import RootClient from "./client/root_client";


export default function Home() {

  return (
    <div className="flex flex-col items-center justify-between">
      {/* <YardMap /> */}
      {/* if not signed in, show the hero else show upcoming deliveries */}
      <RootClient />
    </div>
  );
}
