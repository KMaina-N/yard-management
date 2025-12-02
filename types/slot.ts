export interface ProductAvailability {
  available: boolean;
  remaining: number;
  maxCapacity: number;
  message: string;
  productTypeName: string;
  excessBy?: number;
}

export interface DayInfo {
  full: boolean;
  messages: string[];
  products: ProductAvailability[];
}
