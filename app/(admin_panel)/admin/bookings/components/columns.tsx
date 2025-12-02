"use client";
// import { TableColumnHeader } from '@/components/kibo-ui/table'
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  Navigation,
  Signpost,
} from "lucide-react";
import React, { useCallback } from "react";
import { GoogleNavigate } from "./actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateDDMMYYYY } from "@/lib/date";

function TableColumnHeader<TData, TValue>({ column, title, className }: any) {
  // Extract inline event handlers to prevent unnecessary re-renders
  const handleSortAsc = useCallback(() => {
    column.toggleSorting(false);
  }, [column]);

  const handleSortDesc = useCallback(() => {
    column.toggleSorting(true);
  }, [column]);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="-ml-3 h-8 data-[state=open]:bg-accent"
            size="sm"
            variant="ghost"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleSortAsc}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSortDesc}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Booking ID" />
    ),
    cell: ({ row }) => row.original.id.split("-")[0].toUpperCase(),
  },
  {
    accessorKey: "name",
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "startAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Reservation Date" />
    ),
    cell: ({ row }) => {
      let date = row.original.startAt ? new Date(row.original.startAt) : null;
      // const fmtDate = date?.toISOString().split("T")[0]
      const fmtDate = formatDateDDMMYYYY(date)
      return date && !isNaN(date.getTime())
        ? fmtDate
        : "Invalid date";
    },
  },
  //   {
  //     accessorKey: 'endAt',
  //     header: ({column}) => (
  //          <TableColumnHeader column={column} title="End Date" />
  //     )
  //   },
  {
    accessorKey: "status.name",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Off Loading Bay" />
    ),
    cell: ({ row }) => (
      <span>
        {row.original.assignedTo}
        <GoogleNavigate address={row.original.assignedTo} />
      </span>
    ),
  },
];

export default columns;
