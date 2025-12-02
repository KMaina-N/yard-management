"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LustreText from "@/components/ui/lustretext";
import { useTheme } from "next-themes";
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";
import { ArrowRight, CalendarPlus, History } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/app/(root)/session-provider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
      duration: 0.8,
    },
  },
};

const textVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 15 },
  },
};

declare module "@/components/ui/badge" {
  interface BadgeProps {
    shiny?: boolean;
    shinySpeed?: number;
  }
}

interface HeroUIProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  features?: string[];
  className?: string;
  globeBaseColor?: {
    light: [number, number, number];
    dark: [number, number, number];
  };
  globeMarkerColor?: {
    light: [number, number, number];
    dark: [number, number, number];
  };
  globeGlowColor?: {
    light: [number, number, number];
    dark: [number, number, number];
  };
}

export default function HeroUI({
  title = "Tokic Delivery Booking",
  subtitle = "Streamline Your Warehouse Deliveries",
  badgeText = "🚚 For Tokic DD Suppliers",
  primaryCTA = "Schedule Delivery",
  secondaryCTA = "Learn More",
  features = [
    "Real-time Scheduling",
    // "Optimized Routes",
    "Instant Confirmations",
    // "Warehouse Integration",
  ],
  className = "",
  globeBaseColor = {
    light: [0.98, 0.98, 0.98],
    dark: [0.12, 0.12, 0.12],
  },
  globeMarkerColor = {
    light: [0.2, 0.5, 0.9],
    dark: [0.1, 0.8, 1],
  },
  globeGlowColor = {
    light: [0.3, 0.3, 0.3],
    dark: [1, 1, 1],
  },
}: HeroUIProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const { scrollYProgress } = useScroll(
    isReady
      ? { target: ref, offset: ["start start", "end start"] }
      : { target: undefined }
  );
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  interface Session {
    name?: string;
    // add other properties as needed
  }
  const rawSession = useSession();
  const session: Session = rawSession && typeof rawSession === "object" ? rawSession : {};

  if (!mounted) return null;

  return (
    <section
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden h-[80vh] flex items-center",
        className
      )}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]" />
        <motion.div
          className="absolute -top-10 left-1/4 w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[30rem] lg:h-[30rem] bg-gradient-to-r from-slate-500/20 to-black/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-6 sm:py-8 md:py-16 lg:py-24">
        <div className="relative min-h-[40vh] md:min-h-[60vh]">
          <motion.div
            className="absolute right-0 bottom-0 top-auto w-[70%] md:top-2 md:bottom-auto md:w-1/2 ] transition-all duration-500"
            style={{ y }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <div className="w-full h-[120px] md:h-[100px] lg:h-[100px] xl:h-[100px]">
              <Globe
                baseColor={
                  theme === "dark"
                    ? (globeBaseColor.dark as [number, number, number])
                    : (globeBaseColor.light as [number, number, number])
                }
                markerColor={
                  theme === "dark"
                    ? (globeMarkerColor.dark as [number, number, number])
                    : (globeMarkerColor.light as [number, number, number])
                }
                glowColor={
                  theme === "dark"
                    ? (globeGlowColor.dark as [number, number, number])
                    : (globeGlowColor.light as [number, number, number])
                }
              />
            </div>
          </motion.div>

          <motion.div
            className="relative z-20 w-full md:w-7/12 lg:w-1/2 pt-6 sm:pt-8 md:pt-16 lg:pt-24 md:ml-8 lg:ml-16 md:-mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Badge
              variant="destructive"
              className="w-fit mb-4 text-white"
              // shiny
              // shinySpeed={3}
            >
              {badgeText}
            </Badge>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              variants={textVariants}
            >
              <span className="block bg-gradient-to-r from-blue-500 via-indigo-800 to-violet-900 bg-clip-text text-transparent">
                {title}
              </span>
              {/* <span className="text-foreground mt-2 block">{subtitle}</span> */}
              <span className="text-4xl">Welcome back,<span className="text-orange-500"> {session?.name || ""}</span></span>
            </motion.h1>

            {/* <motion.div
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mt-4"
              variants={textVariants}
            >
              Simplify delivery management with instant scheduling, real-time
              tracking, and seamless warehouse integration—all designed for
              supplier efficiency.
            </motion.div> */}

            <motion.div
              className="flex gap-4 mt-6 max-[375px]:flex-col max-[375px]:w-full max-[375px]:gap-3"
              variants={textVariants}
            >
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
            </motion.div>

            <motion.div
              className="flex items-center gap-8 mt-12 opacity-70"
              variants={textVariants}
            >
              <div className="flex gap-4 flex-wrap">
                {features.map((text) => (
                  <Badge
                    key={text}
                    variant="outline"
                    className="py-1.5 px-3 text-sm border-muted-foreground/30 bg-background/50"
                  >
                    {text}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
