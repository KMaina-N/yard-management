"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "./actions";
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type User = {
  id: string;
  email: string;
  name?: string | null;
  password: string;
  role: string; 
  company?: string | null;
  lastLogin?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  accountActive: boolean;
  bookings?: any[]; 
};

 
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "accountActive",
    header: "Status",
    cell: info => {
      const isActive = info.getValue() as boolean;
      return (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: info => <span className="text-sm text-gray-800">{String(info.getValue())}</span>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: info => {
      const value = info.getValue();
      return <span className="text-sm">{value !== null && value !== undefined ? String(value) : "—"}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: info => {
      const role = info.getValue() as string;
      const roleColors: Record<string, string> = {
        admin: "bg-purple-100 text-purple-800",
        user: "bg-blue-100 text-blue-800",
        supplier: "bg-orange-100 text-orange-800",
      };
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[role.toLocaleLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
          {role === "USER" ? "Supplier" : role === "ADMIN" ? "Admin" : role === "SUPPLIER" ? "Supplier" : role}
        </span>
      );
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: info => {
      const value = info.getValue();
      return <span className="text-sm">{value !== null && value !== undefined ? String(value) : "—"}</span>;
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
    cell: info => {
      const date = info.getValue() as Date;
      return <span className="text-sm text-gray-600">{date ? new Date(date).toLocaleDateString() : "Never"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: info => <span className="text-sm text-gray-600">{new Date(info.getValue() as Date).toLocaleDateString()}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ActionsCell
        user={row.original}
        onToggleActive={(user) => console.log('Toggle active:', user)}
        onDelete={(user) => console.log('Delete user:', user)}
      />
    ),
  },
];

export default columns;