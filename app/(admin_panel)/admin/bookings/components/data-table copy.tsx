"use client";

import React, { useState } from "react";
// import type { ColumnDef } from "@/components/kibo-ui/table";
// import {
//   TableBody,
//   TableCell,
//   TableColumnHeader,
//   TableHead,
//   TableHeader,
//   TableHeaderGroup,
//   TableProvider,
//   TableRow,
// } from "@/components/kibo-ui/table";


import columns from "./columns";

import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/kibo-ui/calendar";
import StatusFilter from "./status-filter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useReactTable } from "@tanstack/react-table";

type StatusFilterProps = {
  onFilterByStatus: (statusName: string) => void;
};

const DataTable = ({ bookings }: any) => {
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [data, setData] = useState(bookings);
  const earliestYear =
    bookings
      .map((feature: any) => feature.startAt.getFullYear())
      .sort()
      .at(0) ?? new Date().getFullYear();

  const latestYear =
    bookings
      .map((feature: any) => feature.endAt.getFullYear())
      .sort()
      .at(-1) ?? new Date().getFullYear();

  const handleFilterByStatus = (statusName: string) => {
    console.log("Filtering by status:", statusName);
    if (statusName === "All") {
      setData(bookings);
    } else {
      setData(
        bookings.filter((booking: any) => booking.status.name === statusName)
      );
    }
  };

  const table = useReactTable({
    data,
    columns
  });

  const handleDialog = (feature: any) => {
    // setSelectedFeature(feature);
    console.log("Selected Feature:", feature);
  };

  return (
    <>
      <CalendarProvider>
        <div className="flex flex-col md:flex-row justify-between items-center px-4 border-b border-gray-100 bg-gray-50/60">
          <CalendarDate>
            <CalendarDatePicker>
              <CalendarMonthPicker />
              <CalendarYearPicker end={latestYear} start={earliestYear} />
            </CalendarDatePicker>
            <CalendarDatePagination />
          </CalendarDate>
          <StatusFilter onFilterByStatus={handleFilterByStatus} />
        </div>
      </CalendarProvider>
      {/* <TableProvider columns={columns} data={data}>
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
              {({ header }) => <TableHead header={header} key={header.id} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => (
              <TableRow key={row.id} row={row} onClick={() => handleDialog(row.original)}>
                {({ cell }) => <TableCell cell={cell} key={cell.id} />}
              </TableRow>

          )}
        </TableBody>
      </TableProvider> */}

<Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </>
  );
};

export default DataTable;

const DialogFeatureDetails = ({
  feature,
  isOpen,
  onClose,
}: {
  feature: any;
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Feature Details</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
