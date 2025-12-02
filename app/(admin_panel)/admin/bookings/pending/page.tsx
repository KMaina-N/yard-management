"use client";
import { BOOKINGS } from "@/data";
import { faker } from "@faker-js/faker";
import React from "react";
import PendingDataTable from "./components.tsx/data-table";
import columns from "../components/columns";
import { useQuery } from "@tanstack/react-query";

const page = () => {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  const statuses = [
    { id: faker.string.uuid(), name: "Planned", color: "#6B7280" },
    { id: faker.string.uuid(), name: "In Review", color: "#FBBF24" },
    { id: faker.string.uuid(), name: "In Progress", color: "#3B82F6" },
    { id: faker.string.uuid(), name: "Done", color: "#10B981" },
  ];
  const exampleFeatures_ = Array.from({ length: 200 }).map(() => ({
    id: faker.string.uuid(),
    name: capitalize(faker.commerce.productName()),
    startAt: faker.date.between({
      from: new Date(2025, 0, 1),
      to: new Date(2025, 11, 31),
    }),
    endAt: faker.date.future({ years: 0.2 }),
    status: faker.helpers.arrayElement(statuses),
    description: faker.company.catchPhrase(),
    assignedTo: faker.person.fullName(),
  }));

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await fetch("/api/bookings?status=pending");
      const result = await response.json();
      return result;
    },
    initialData: [],
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // const [data, setData] = useState<any[]>([]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch("/api/bookings");
  //     const result = await response.json();
  //     setData(result);
  //   };
  //   fetchData();
  // }, []);

  const exampleFeatures = bookings.map((booking: any) => {
    const productType = booking.goods.reduce((acc: string[], curr: any) => {
      const product = booking.productTypes.find(
        (pt: any) => pt.id === curr.typeId
      );
      if (product) acc.push(product.name);
      return acc;
    }, []);
    const quantitiesArray = booking.goods.map((g: any) => {
      const product = booking.productTypes.find(
        (pt: any) => pt.id === g.typeId
      );
      return {
        typeId: g.typeId,
        name: product?.name || g.typeId, // fallback to typeId if name missing
        quantity: g.quantities ?? 0,
      };
    });
    const pallets = booking.goods.reduce((acc: number, curr: any) => {
      return acc + (curr.numberOfPallets || 0);
    }, 0);
    const matchedStatus = statuses.find(
      (s) => s.name.toLowerCase() === booking.status.toLowerCase()
    );
    return {
      id: booking.id,
      name: `${booking.user.company}`,
      startAt: new Date(booking.bookingDate),
      endAt: new Date(booking.bookingDate),
      status: matchedStatus
        ? matchedStatus
        : { name: booking.status, color: "#6B7280" },
      description: faker.company.catchPhrase(),
      productType,
      quantities: quantitiesArray,
      numberOfPallets: pallets ? pallets : "N/A",
      assignedTo: booking.yard ? booking.yard.name : "Unassigned Yard",
      createdOn: booking.createdAt,
    };
  });
  return (
    <div>
      <PendingDataTable columns={columns} data={exampleFeatures} />
    </div>
  );
};

export default page;
