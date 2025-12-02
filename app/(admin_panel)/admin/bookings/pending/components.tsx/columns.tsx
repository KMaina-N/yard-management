import { TableColumnHeader } from "@/components/kibo-ui/table";
import { ColumnDef } from "@tanstack/react-table";
import { Navigation, Signpost } from "lucide-react";
import React from "react";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
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
    // cell: ({ row }) => {
    //   const date = new Date(row.original.startAt);
    //   return new Intl.DateTimeFormat("en-UK", {
    //     dateStyle: "short",
    //     timeZone: "Europe/Zagreb", // force Zagreb timezone
    //   }).format(date);
    // },
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
        {/* <GoogleNavigate address={row.original.assignedTo} /> */}
      </span>
    ),
  },
];

export default columns;
