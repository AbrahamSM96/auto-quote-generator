export type BodyworkItem = {
  id: string;
  description: string;
  cost: number;
}

export type PaintItem = {
  id: string;
  part: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PartItem = {
  id: string;
  description: string;
  cost: number;
}

export type QuotationFormData = {
  // Client
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;

  // Vehicle
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehiclePlates: string;
  vehiclePaintCode: string;

  // Services
  services: string[];
  customService?: string;
  estimatedTime: string;
  piecesToWork: number;

  // Items
  bodyworkItems: BodyworkItem[];
  paintItems: PaintItem[];
  partItems: PartItem[];

  // Totals
  totalAmount: number;
  downPayment: number;
  remainingBalance: number;
}
