"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Package, FileText, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";


export interface GoodsItem {
  type: string;
  numberOfItems: number;
  productLines?: number;
  quantities: number;
  numberOfPallets: number;
}

export interface BookingFormData {
  goods: GoodsItem[];
  documents: File[];
  invoiceNumber?: string[];
  packagedInPallets: boolean;
}

const BookingForm = ({
  onNext,
  productTypes,
}: {
  onNext: (data: any) => void;
  productTypes: any[];
}) => {
  const getSessionData = (): BookingFormData | null => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem("bookingData");
    return data ? JSON.parse(data) : null;
  };

  const initialGoods = (): any[] => {
    const session = getSessionData();
    const firstGood = session?.goods?.[0];
    return [
      {
        type: firstGood?.type || "",
        numberOfItems: firstGood?.numberOfItems || 0,
        productLines: firstGood?.productLines || 0,
        quantities: firstGood?.quantities || 0,
        numberOfPallets: firstGood?.numberOfPallets || 0,
      },
    ];
  };

  const session = getSessionData();

  const [formData, setFormData] = useState<BookingFormData>({
    goods: initialGoods(),
    documents: [],
    invoiceNumber: [],
    packagedInPallets: session?.packagedInPallets || false,
  });

  const [invoiceInput, setInvoiceInput] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, documents: Array.from(e.target.files) });
      toast(`Documents uploaded: ${e.target.files.length} file(s) selected`);
    }
  };

  // Invoice input changes
  const handleInvoiceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.endsWith(",") || value.endsWith(" ")) {
      processInvoices(value);
    } else {
      setInvoiceInput(value);
    }
  };

  const processInvoices = (input: string) => {
    const invoicesArray = input
      .split(/[\s,]+/)
      .map((inv) => inv.trim())
      .filter((inv) => inv.length > 0);

    if (invoicesArray.length > 0) {
      const existingInvoices = new Set(formData.invoiceNumber || []);
      const newInvoices = invoicesArray.filter(
        (inv) => !existingInvoices.has(inv)
      );

      if (newInvoices.length > 0) {
        setFormData({
          ...formData,
          invoiceNumber: [...(formData.invoiceNumber ?? []), ...newInvoices],
        });
      }
    }

    setInvoiceInput("");
  };

  const removeInvoice = (index: number) => {
    const updated = [...(formData.invoiceNumber || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, invoiceNumber: updated });
  };

  const addGoodsRow = () => {
    setFormData({
      ...formData,
      goods: [
        ...formData.goods,
        { type: "", numberOfItems: 0, quantities: 0, numberOfPallets: 0 },
      ],
    });
  };

  const removeGoodsRow = (index: number) => {
    const updated = [...formData.goods];
    updated.splice(index, 1);
    setFormData({ ...formData, goods: updated });
  };

  const updateGoodsField = <K extends keyof GoodsItem>(
    index: number,
    field: K,
    value: GoodsItem[K]
  ) => {
    const updated = [...formData.goods];
    updated[index][field] = value;
    setFormData({ ...formData, goods: updated });
    // if (field === "quantities") {
    //   const product = productTypes.find((p) => p.id === updated[index].type);
    //   if (product) {
    //     const maxAllowed = product.dailyCapacity + (product.tolerance || 0);
    //     // TODO: check total quantities booked for the day from backend
    //     if ((value as number) > maxAllowed) {
    //       toast.warning(
    //         `${product.name}: quantity exceeds daily capacity (${maxAllowed}). `
    //       );
    //     }
    //   }
    // }
  };

  const validateData = () => {
    let isValid = true;

    if (
      formData.packagedInPallets &&
      formData.goods.reduce((sum, g) => sum + (g.numberOfPallets || 0), 0) === 0
    ) {
      isValid = false;
      toast.error("Please specify number of pallets for the goods.");
    }

    if (formData.goods.reduce((sum, g) => sum + (g.quantities || 0), 0) === 0) {
      isValid = false;
      toast.error("Please specify quantities for the goods.");
    }

    if (formData.goods.some((g) => !g.type)) {
      isValid = false;
      toast.error("Please select goods type for all goods entries.");
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) return;

    onNext(formData);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-white shadow-lg border border-gray-200 overflow-hidden pt-0">
      <div className="h-2 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900"></div>

      <CardHeader className="space-y-2 pb-6 pt-8">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-black bg-clip-text text-transparent">
          Delivery Booking
        </CardTitle>
        <CardDescription className="text-base text-gray-500">
          Complete the form below to schedule your warehouse delivery slot
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Supplier */}
          {/* <div className="space-y-2">
            <Label className="font-semibold">Supplier Name *</Label>
            <Select
              value={formData.supplierName}
              onValueChange={(value) =>
                setFormData({ ...formData, supplierName: value })
              }
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {SUPPLIERS.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* Invoice numbers */}
          <div className="space-y-2">
            <Label>Invoice Number(s)</Label>
            <Input
              type="text"
              placeholder="Type and press space or comma"
              className="bg-gray-50"
              value={invoiceInput}
              onChange={handleInvoiceInputChange}
              onBlur={() =>
                invoiceInput.trim() && processInvoices(invoiceInput)
              }
            />

            {formData.invoiceNumber && formData.invoiceNumber.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.invoiceNumber.map((inv, i) => (
                  <Badge
                    key={i}
                    className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {inv}
                    <button
                      type="button"
                      className="ml-1 font-bold text-blue-600"
                      onClick={() => removeInvoice(i)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Packaged in Pallets */}
          <div className="space-y-2">
            <Label className="font-semibold">Packaged in pallets?</Label>
            <Select
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  packagedInPallets: value === "true",
                })
              }
              // defaultValue={formData.packagedInPallets}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Goods Rows */}
          <div className="space-y-6">
            {formData.goods.map((good, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 items-start border rounded-lg p-4"
              >
                {/* Goods Type */}
                <div className="flex flex-col space-y-1">
                  <Label>Goods Type *</Label>
                  <Select
                    value={good.type} // store the ID here
                    onValueChange={(value) =>
                      updateGoodsField(index, "type", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-50 h-10 flex items-center w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantities */}
                <div className="flex flex-col space-y-1">
                  <Label>Quantities</Label>
                  <Input
                    type="number"
                    min="0"
                    className="bg-gray-50"
                    value={good.quantities || ""}
                    onChange={(e) =>
                      updateGoodsField(
                        index,
                        "quantities",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label>Product Lines</Label>
                  <Input
                    type="number"
                    min="0"
                    className="bg-gray-50"
                    value={good.productLines || ""}
                    onChange={(e) =>
                      updateGoodsField(
                        index,
                        "productLines",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Pallets (optional) */}
                {formData.packagedInPallets && (
                  <div className="flex flex-col space-y-1">
                    <Label>Pallets</Label>
                    <Input
                      type="number"
                      min="0"
                      className="bg-gray-50"
                      value={good.numberOfPallets || ""}
                      onChange={(e) =>
                        updateGoodsField(
                          index,
                          "numberOfPallets",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                )}

                {/* Remove button */}
                <div className="flex items-center justify-center mt-4">
                  <Button
                    variant="destructive"
                    type="button"
                    className="flex items-center gap-2"
                    onClick={() => removeGoodsRow(index)}
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="flex gap-2"
              onClick={addGoodsRow}
            >
              <Plus size={18} /> Add Goods Type
            </Button>
          </div>

          {/* Documents */}
          <div className="space-y-2">
            <Label>Upload Documents</Label>
            <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50 cursor-pointer">
              <label
                htmlFor="documents"
                className="flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {formData.documents.length
                    ? `${formData.documents.length} file(s) selected`
                    : "Click to upload packing list or invoice"}
                </span>
                <Input
                  id="documents"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full h-12">
            <FileText className="w-5 h-5 mr-2" />
            Continue to Slot Selection
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
