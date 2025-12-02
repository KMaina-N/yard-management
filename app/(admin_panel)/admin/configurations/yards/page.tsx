"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import YardCard from "./components/yard-card";
import YardDialog from "./components/yard-dialog";

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { addYard, fetchYards } from "../../utils";
import { toast } from "sonner";
const queryClient = new QueryClient();

const YardsPage = () => {
  // const [yards, setYards] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  type Yard = {
    id: string;
    name: string;
    address: string;
    products: string[];
  };

  const {
    data: yards,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["yards"],
    queryFn: () => fetchYards(),
    initialData: [],
  });

  const addYardMutation = useMutation({
    mutationFn: async (newYard: any) => {
      await addYard(newYard);
    },
    onSuccess: () => {
      toast.success("Yard added successfully");
      refetch();
    },
  })

  const [editingYard, setEditingYard] = useState<Yard | null>(null);

  const handleSave = (yard: any) => {
    // if (editingYard) {
    //   setYards((prev) => prev.map((y) => (y.id === yard.id ? yard : y)));
    // } else {
    //   setYards((prev) => [
    //     ...prev,
    //     { ...yard, id: `Y-${Math.random().toString(36).slice(2, 6)}` },
    //   ]);
    // }
    addYardMutation.mutate(yard);
    setDialogOpen(false);
    setEditingYard(null);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Yards Overview</h1>
          <p className="text-muted-foreground text-sm">
            Manage all yard locations and their assigned product types.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Yard
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {yards.map((yard: Yard) => (
          <YardCard
            key={yard.id}
            yard={yard}
            onEdit={() => {
              setEditingYard(yard);
              setDialogOpen(true);
            }}
          />
        ))}
      </div>

      <YardDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        yard={editingYard}
      />
    </div>
  );
};

export const page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <YardsPage />
    </QueryClientProvider>
  );
};

export default page;
