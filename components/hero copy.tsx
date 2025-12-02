import React from "react";
import { Button } from "@/components/ui/button";
import { Truck, CalendarPlus, Clock, ArrowRight, History } from "lucide-react";
import Link from "next/link";

export default function HeroSection({ userName }: { userName: string | null }) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className=" relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Real-time dock availability</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Welcome back,
              <span className="block text-emerald-400 mt-2">
                {userName || "Supplier"}
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Schedule your deliveries seamlessly. Our smart booking system
              ensures optimal dock allocation and minimal wait times.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/create-booking">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02]"
                >
                  <CalendarPlus className="w-5 h-5 mr-2" />
                  Schedule Delivery
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/delivery-history">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white bg-black hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  <History className="w-5 h-5 mr-2" />
                  View History
                </Button>
              </Link>
            </div>
          </div>

          {/* <div className="hidden lg:block relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute top-0 right-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Available Docks</p>
                    <p className="text-2xl font-bold">4 / 4</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <CalendarPlus className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Today's Bookings</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-4 shadow-2xl">
                <p className="text-sm font-medium text-emerald-300">
                  Next available slot
                </p>
                <p className="text-xl font-bold">10:00 AM - Dock B</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
}
