import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
type StatusFilterProps = {
  onFilterByStatus: (statusName: string) => void;
};

const StatusFilter: React.FC<StatusFilterProps> = ({ onFilterByStatus }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleFilterChangeQuery = (value: any) => {
    // set the query parameter for status filter
    const params = new URLSearchParams(searchParams.toString());
    if (value === "All") {
      params.delete("status");
    }
    params.set("status", value);
    console.log("params", params.toString());
    router.replace(`/admin/bookings?${params.toString()}`);
    // return params.toString();
  };
  return (
    <Select
      onValueChange={(value) => {
        // onFilterByStatus(value);
        handleFilterChangeQuery(value);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Confirmed">Confirmed</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
