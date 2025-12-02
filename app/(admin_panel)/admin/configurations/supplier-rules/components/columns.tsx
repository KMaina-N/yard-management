"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SupplierRule } from "@/types/supplier-rules";
import { Button } from "@/components/ui/button";

export const columns = (
  openEditDialog: (rule: SupplierRule) => void,
  handleDelete: (rule: SupplierRule) => void,
): ColumnDef<SupplierRule>[] => [
  {
    accessorKey: "supplierName",
    header: "Supplier",
  },
  {
    accessorKey: "day",
    header: "Day",
  },
  {
    accessorKey: "allocatedCapacity",
    header: "Reserved Capacity",
  },
//   {
//     accessorKey: "tolerance",
//     header: "Tolerance",
//   },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const rule = row.original;
      return (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => openEditDialog(rule)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(rule)}>Delete</Button>
        </div>
      );
    },
  },
];
