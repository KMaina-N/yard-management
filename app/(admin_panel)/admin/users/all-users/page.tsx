"use client";
import React, { useState, useEffect } from "react";
import columns, { User } from "./components/columns";
import { UsersDataTable } from "./components/data-table";
import { getAllUsers } from "@/app/actions/admin/users";
import { useQuery } from "@tanstack/react-query";

export default function UsersPage() {
  // const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUsers = async() => {
  //     const users = await getAllUsers();
  //     setUsers(users);
  //     setLoading(false);
  //   }
  //   fetchUsers();
  // }, []);

  const {data: users, isLoading, isError, refetch} = useQuery({
    queryKey: ['users'],
    queryFn: async() => await getAllUsers(),
    // initialData: [],
    // onSuccess: () => setLoading(false),
  })

  return (
    <div className="container mx-auto ">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage and view all users in the system
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          </div>
        ) : (
          <UsersDataTable columns={columns} data={users} />
        )}
      </div>
    </div>
  );
}
