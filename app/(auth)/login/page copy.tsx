"use client";

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spotlight } from "@/components/ui/spotlight-new";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      {/* Background effect */}
      {/* <BackgroundBeamsWithCollision /> */}

      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-8 py-16 relative z-10">
        {/* Left side – Login form */}
        <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-lg p-8 rounded-xl border border-white/10">
          <h1 className="text-3xl font-bold mb-3">Welcome Back!</h1>
          <p className="text-neutral-500 mb-8">
            Sign in to manage your yard operations, streamline inbound and
            outbound logistics, and ensure timely deliveries at{" "}
            <b>Tokić d.d.</b>
          </p>

          <form className="flex flex-col space-y-6">
            <div>
              <Label htmlFor="email" className="text-neutral-500 mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                required
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-neutral-500 mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="w-full p-3 rounded-md bg-neutral-900 border border-neutral-700 focus:border-green-400 focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-green-600 hover:bg-green-500 transition font-semibold py-3 rounded-md text-white"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Right side – Spotlight Description */}
        <div className="w-full md:w-1/2 h-[36rem] relative rounded-xl overflow-hidden">
          {/* Background container */}
          <div className="h-full w-full relative flex items-center justify-center bg-black/[0.96] antialiased overflow-hidden">
            {/* Spotlight */}
            <Spotlight />

            {/* Blurred blob overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="absolute h-96 w-96 rounded-full bg-gradient-to-tr from-yellow-400/60 via-pink-400/50 to-purple-500/40 blur-3xl opacity-80  transition-all" />
            </div>

            {/* Glassy grid */}
            <div className="grid grid-cols-5 grid-rows-3 gap-4 absolute -top-36 -right-36 rotate-45 z-20">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="h-36 w-36 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-lg flex items-center justify-center"
                ></div>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-white z-30 flex flex-col items-center justify-center">
              <span>Yard Management System</span>
              <span className="text-green-400">Powered by Tokić d.d.</span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
