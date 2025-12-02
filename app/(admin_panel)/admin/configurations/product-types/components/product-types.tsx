"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Package, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  addProductType,
  fetchProductTypes,
  fetchYards,
  updateProductType,
} from "../../../utils";

interface ProductType {
  id: string;
  name: string;
  yard: string;
  dailyCapacity: number;
  tolerance: number;
  yards: {
    id: string;
    name: string;
  };
}

const queryClient = new QueryClient();

const ProductTypesComponent = () => {
  const [yards, setYards] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    yard: "",
    dailyCapacity: "",
    tolerance: "",
  });
  useEffect(() => {
    const fetch = async () => {
      const yardsData = await fetchYards();
      setYards(yardsData);
    };
    fetch();
  }, []);

  const { data: productTypes, refetch } = useQuery<ProductType[] | undefined>({
    queryKey: ["productTypes"],
    queryFn: async () => {
      const products = await fetchProductTypes();
      return products;
    },
    initialData: [],
  });

  const addProductTypeMutation = useMutation({
    mutationFn: async (newProductType: ProductType) => {
      await addProductType(newProductType);
    },
    onSuccess: () => {
      toast.success("Product type added successfully");
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
      refetch();
    },
  });

  const updateProductTypeMutation = useMutation({
    mutationFn: async ({
      updatedProductType,
      id,
    }: {
      updatedProductType: ProductType;
      id: string;
    }) => {
      await updateProductType(updatedProductType, id);
    },
    onSuccess: () => {
      toast.success("Product type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["productTypes"] });
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // if (editingProduct) {
    //   setProductTypes(
    //     productTypes.map((p) =>
    //       p.id === editingProduct.id
    //         ? {
    //             ...editingProduct,
    //             ...formData,
    //             dailyCapacity: Number(formData.dailyCapacity),
    //             tolerance: Number(formData.tolerance),
    //           }
    //         : p
    //     )
    //   );
    //   toast("Product type updated successfully");
    // } else {
    //   const newProduct: ProductType = {
    //     id: Date.now().toString(),
    //     name: formData.name,
    //     platform: formData.platform,
    //     dailyCapacity: Number(formData.dailyCapacity),
    //     tolerance: Number(formData.tolerance),
    //   };
    // }

    if (editingProduct) {
      const productToUpdate: any = {
        name: formData.name,
        yardId: formData.yard,
        dailyCapacity: Number(formData.dailyCapacity),
        tolerance: Number(formData.tolerance),
      };
      console.log("Updating product type:", productToUpdate);
      updateProductTypeMutation.mutate({ updatedProductType: productToUpdate, id: editingProduct.id });
    } else {
      const newProduct: any = {
        id: Date.now().toString(),
        name: formData.name,
        yardId: formData.yard,
        dailyCapacity: Number(formData.dailyCapacity),
        tolerance: Number(formData.tolerance),
      };
      // setProductTypes([...productTypes, newProduct]);
      addProductTypeMutation.mutate(newProduct);
    }

    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", yard: "", dailyCapacity: "", tolerance: "" });
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      yard: product.yardId,
      dailyCapacity: product.dailyCapacity.toString(),
      tolerance: product.tolerance.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // setProductTypes(productTypes.filter((p) => p.id !== id));
    toast("Product type deleted successfully");
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({ name: "", yard: "", dailyCapacity: "", tolerance: "" });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Product Types
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Package className="h-4 w-4" />
            Manage product types and delivery rules
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openAddDialog}
              className="gradient-primary hover-lift"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product Type" : "Add Product Type"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Electronics"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yard">Assigned Platform</Label>
                <Select
                  value={formData.yard}
                  onValueChange={(value) =>
                    setFormData({ ...formData, yard: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="A-1">
                        Platform A-1 (Loading)
                      </SelectItem>
                      <SelectItem value="A-2">
                        Platform A-2 (Loading)
                      </SelectItem>
                      <SelectItem value="B-1">
                        Platform B-1 (Unloading)
                      </SelectItem>
                      <SelectItem value="B-2">
                        Platform B-2 (Unloading)
                      </SelectItem>
                      <SelectItem value="C-1">
                        Platform C-1 (Flexible)
                      </SelectItem>
                      <SelectItem value="C-2">
                        Platform C-2 (Flexible)
                      </SelectItem> */}
                    {yards.map((yard) => (
                      <SelectItem key={yard.id} value={yard.id}>
                        {yard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyCapacity">
                  Daily Capacity (units/day)
                </Label>
                <Input
                  id="dailyCapacity"
                  type="number"
                  placeholder="e.g., 50"
                  value={formData.dailyCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyCapacity: e.target.value,
                    })
                  }
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tolerance">tolerance (%)</Label>
                <Input
                  id="tolerance"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.tolerance}
                  onChange={(e) =>
                    setFormData({ ...formData, tolerance: e.target.value })
                  }
                  required
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="gradient-primary">
                  {editingProduct ? "Update" : "Add"} Product Type
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-effect hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            All Product Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Daily Capacity</TableHead>
                <TableHead>Tolerance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productTypes?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    
                      <Badge variant="outline">
                        {product?.yards?.name}
                      </Badge>
                    
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {product.dailyCapacity} units/day
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.tolerance}%</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProductTypes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductTypesComponent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default ProductTypes;
