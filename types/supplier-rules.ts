export interface SupplierRule {
  id: string;
  supplierName: string;
  day: string;
  allocatedCapacity: number;
  tolerance: number;
  deliveryEmail: string;
}
