import type {
  BodyworkItem,
  MechanicalItem,
  PaintItem,
  PartItem,
  QuotationFormData,
} from '@/lib/validations'

// Re-export types from validations (single source of truth)
export type {
  BodyworkItem,
  PaintItem,
  PartItem,
  QuotationFormData,
  MechanicalItem,
}

// Quotation from database (includes metadata)
export type Quotation = QuotationFormData & {
  id: string
  folio: number
  createdAt: Date
  updatedAt: Date
}
