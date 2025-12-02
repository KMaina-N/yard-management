"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, Edit } from "lucide-react";
import ProductsPopup from "./products-popup";

export default function YardCard({
  yard,
  onEdit,
}: {
  yard: any;
  onEdit: () => void;
}) {
  return (
    <Card className="shadow-sm border hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{yard.name}</span>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          {yard.address}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-medium text-sm">
            {yard.productTypes.length} Product Types
          </span>
          <ProductsPopup products={yard.productTypes}>
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4" />
            </Button>
          </ProductsPopup>
        </div>
      </CardContent>
    </Card>
  );
}
