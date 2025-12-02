"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  Heart,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  apps,
  communityPosts,
  platformStatus,
  projects,
  recentBookings,
  recentFiles,
  stats,
} from "./data";
import { cn } from "@/lib/utils";

export function HomeContent() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      {/* <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <Badge className="rounded-xl bg-white/20 text-white hover:bg-white/30">
                Premium
              </Badge>
              <h2 className="text-3xl font-bold">Welcome to SlotWise</h2>
              <p className="max-w-[600px] text-white/80">
                Elevate your delivery management with SlotWise by Tokić d.d.
                Schedule your deliveries to our warehouse with ease and
                efficiency.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                  Explore Documentation
                </Button>
                <Button
                  variant="outline"
                  className="rounded-2xl border-white bg-transparent text-white hover:bg-white/10"
                >
                  Take a Tour
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 50,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="relative h-40 w-40"
              >
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                <div className="absolute inset-4 rounded-full bg-white/20" />
                <div className="absolute inset-8 rounded-full bg-white/30" />
                <div className="absolute inset-12 rounded-full bg-white/40" />
                <div className="absolute inset-16 rounded-full bg-white/50" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section> */}

      {/* Recent Apps */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Overview</h2>
          <Button variant="ghost" className="rounded-2xl">
            Live Stats
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="hover:-translate-y-2 overflow-hidden border-border/50 shadow-medium hover:shadow-large transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={cn("p-2 rounded-xl bg-muted", stat.color)}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-medium">
                    <ArrowUpRight className="h-3 w-3" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Files and Projects */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <section className="space-y-4 shadow-md p-2 rounded-md">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-400 animate-pulse rounded-full"></div>
              Recent Bookings
            </div>
            <Button variant="ghost" className="rounded-2xl">
              View All
            </Button>
          </div>
          <div className="">
            <div className="grid grid-cols-1 divide-y space-y-2">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="group flex items-center justify-between rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/50 p-4 transition-all hover:shadow-medium hover:border-primary/30"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">
                        {booking.company}
                      </p>
                      {booking.priority === "high" && (
                        <Badge
                          variant="destructive"
                          className="text-xs text-white"
                        >
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.id} • Platform {booking.platform}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {booking.time}
                    </p>
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="transition-transform group-hover:scale-105"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recent Files</h2>
            <Button variant="ghost" className="rounded-2xl">
              View All
            </Button>
          </div>
          <div className="rounded-3xl border">
            <div className="grid grid-cols-1 divide-y">
              {recentFiles.slice(0, 3).map((file) => (
                <motion.div
                  key={file.name}
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-2xl">
                      {file.icon}
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {file.app} • {file.modified}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.shared && (
                      <Badge variant="outline" className="rounded-xl">
                        <Users className="mr-1 h-3 w-3" />
                        {file.collaborators}
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="rounded-xl">
                      Open
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}
        <section className="space-y-4 shadow-md p-2 rounded-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Platform Status</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {platformStatus.map((platform) => (
              <div
                key={platform.name}
                className={cn(
                  "group relative rounded-xl border-2 p-4 transition-all duration-300 hover:shadow-medium cursor-pointer",
                  platform.status === "occupied"
                    ? "border-red-200 bg-gradient-to-br from-red-200 to-red-100 hover:border-red-300"
                    : platform.status === "reserved"
                    ? "border-warning/50 bg-gradient-to-br from-orange-300 to-orange-100 hover:border-warning"
                    : "border-green-300 bg-gradient-to-br from-green-300 to-success/5 hover:border-green-400"
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg text-foreground">
                      {platform.name}
                    </p>
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full transition-all group-hover:scale-125",
                        platform.status === "occupied"
                          ? "bg-destructive animate-pulse-glow"
                          : platform.status === "reserved"
                          ? "bg-warning animate-pulse-glow"
                          : "bg-success"
                      )}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground capitalize font-medium">
                    {platform.status}
                  </p>
                  {platform.booking && (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {platform.booking}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Utilization
                          </span>
                          <span className="font-semibold">
                            {platform.utilization}%
                          </span>
                        </div>
                        <Progress
                          value={platform.utilization}
                          className="h-1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

     <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-medium border-border/50 hover-lift">
          <CardHeader>
            <CardTitle className="text-base">Today's Efficiency</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">On-Time Arrivals</span>
                <span className="font-semibold">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Speed</span>
                <span className="font-semibold">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Platform Turnover</span>
                <span className="font-semibold">76%</span>
              </div>
              <Progress value={76} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-border/50 hover-lift">
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Avg. Wait Time</span>
              <span className="font-semibold">12 min</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Avg. Processing</span>
              <span className="font-semibold">45 min</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Peak Hours</span>
              <span className="font-semibold">10AM - 2PM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-border/50 hover-lift bg-gradient-to-br from-primary/10 via-card to-card">
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm text-muted-foreground">Database</span>
              </div>
              <span className="text-xs font-semibold text-success">Operational</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm text-muted-foreground">API Services</span>
              </div>
              <span className="text-xs font-semibold text-success">Operational</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-sm text-muted-foreground">Real-time Sync</span>
              </div>
              <span className="text-xs font-semibold text-success">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
