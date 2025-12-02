"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  User,
  FileText,
  Warehouse,
  Box,
  Boxes,
} from "lucide-react";
import { format, set } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import UpdateBooking from "./update";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDateDDMMYYYY } from "@/lib/date";
import { ScrollArea } from "@/components/ui/scroll-area";
import RescheduleDialog from "./reschedule-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookingDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  dialogData: any;
};

const BookingDialog = ({
  dialogOpen,
  setDialogOpen,
  dialogData,
}: BookingDialogProps) => {
  if (!dialogData) return null;

  const {
    id,
    name,
    startAt,
    endAt,
    status,
    description,
    assignedTo,
    productType,
    numberOfPallets,
    quantities,
    createdOn,
  } = dialogData;

  const availabilityPayload = {
    bookingData: {
      goods: dialogData.quantities.map((good: any) => ({
        type: good.typeId,
        numberOfItems: 0, // default 0, adjust if needed
        quantities: good.quantity,
        numberOfPallets: 0, // default 0
      })),
    },
    userId: "5486be56-718c-45ad-867a-da8a0b373a9el", // include the userId
  };

  const [rescheduleOpen, setRescheduleOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (warehouseId: string) => {
      const response = await fetch(`/api/bookings/${id}?confirmed=true`, {
        method: "PUT",
        body: JSON.stringify({ status: "confirmed", yardId: warehouseId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    onSuccess: () => {
      setDialogOpen(false);
      confirmMutation.reset();
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking confirmed successfully");
    },
  });

  const confirmBooking = (warehouseId: string) => {
    confirmMutation.mutate(warehouseId);
  };

  // const handleReschedule = () => {
  //   setRescheduleOpen(true);
  // };

  const rescheduleMutation = useMutation({
    mutationKey: ["bookings"],
    mutationFn: async (newDate: string) => {
      const response = await fetch(`/api/bookings/${id}?reschedule=true&by=admin`, {
        method: "PUT",
        body: JSON.stringify({ bookingDate: newDate }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
    onSuccess: () => {
      setDialogOpen(false);
      rescheduleMutation.reset();
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking rescheduled successfully");
    },
  });
  const handleReschedule = async (newDate: any) => {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");
    const seconds = String(newDate.getSeconds()).padStart(2, "0");
    const localISOString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
    await rescheduleMutation.mutateAsync(localISOString);
  };

  const { data: warehouses } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await fetch("/api/yards");
      return response.json();
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000, // cache for 5 minutes to avoid refetching on every dialog open
  });

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("");

  // const warehouses = [
  //   { id: "wh1", name: "Main Warehouse" },
  //   { id: "wh2", name: "Secondary Warehouse" },
  // ];

  return (
    <AnimatePresence>
      <motion.div
        className="dialog-backdrop"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="md:min-w-2xl rounded-xl p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4">
                <span className="text-lg font-semibold text-foreground">
                  Booking Details — {id.split("-")[0].toUpperCase()}
                </span>
                <Badge
                  className="text-white"
                  style={{ backgroundColor: status?.color }}
                >
                  {status?.name}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Detailed summary of the booking record
              </DialogDescription>
            </DialogHeader>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase">
                  Name
                </h3>
                <p className="text-base font-semibold text-foreground">
                  {name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h4 className="text-xs text-muted-foreground">
                      Reservation Date
                    </h4>
                    <p className="text-sm font-medium text-foreground">
                      {formatDateDDMMYYYY(new Date(startAt))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <h4 className="text-xs text-muted-foreground">
                      Created On
                    </h4>
                    <p className="text-sm font-medium text-foreground">
                      {/* {format(new Date(createdOn), "PPP")} */}
                      {formatDateDDMMYYYY(new Date(createdOn))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Warehouse className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="text-xs text-muted-foreground">
                      Assigned To
                    </h4>
                    <p className="text-sm font-medium text-foreground">
                      {assignedTo}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="text-xs text-muted-foreground">
                      Goods Type
                    </h4>
                    <div className="text-sm text-foreground leading-relaxed">
                      {quantities.map((q: any) => (
                        <Badge key={q.typeId}>{q.name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Box className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <h4 className="text-xs text-muted-foreground">
                      Number of Pallets
                    </h4>
                    <p className="text-sm font-medium text-foreground">
                      {numberOfPallets}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <Boxes className="w-5 h-5 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Quantities
                    </h4>
                  </div>

                  {/* Scrollable list */}
                  <ScrollArea className="h-32">
                    <div className="flex flex-col gap-1 pr-1">
                      {quantities.map((q: any) => (
                        <div
                          key={q.typeId}
                          className="flex justify-between items-center text-sm text-foreground"
                        >
                          <span className="truncate">{q.name}</span>
                          <span className="font-semibold">{q.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div
              className={cn(
                "grid items-end gap-2",
                status?.name.toLowerCase() === "pending"
                  ? "md:grid-cols-3"
                  : "md:grid-cols-2"
              )}
            >
              {status?.name.toLowerCase() === "pending" && (
                <div className="space-y-2">
                  <UpdateBooking
                    warehouses={warehouses}
                    onConfirm={confirmBooking}
                    selectedWarehouse={selectedWarehouse}
                    setSelectedWarehouse={setSelectedWarehouse}
                  />
                  <Button
                    className="w-full"
                    onClick={() => confirmBooking(selectedWarehouse)}
                    disabled={!selectedWarehouse}
                  >
                    Confirm
                  </Button>
                </div>
              )}
              <RescheduleDialog
                bookingId={id}
                currentDate={new Date(startAt)}
                onReschedule={handleReschedule}
                payload={availabilityPayload}
              />
              <Button variant="destructive">Cancel</Button>
            </div>

            <Separator className="my-4" />

            <div className="text-xs text-muted-foreground text-center">
              Last updated on {format(new Date(), "PPpp")}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingDialog;
