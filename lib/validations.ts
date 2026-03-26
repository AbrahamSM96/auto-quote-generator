/* eslint-disable sort-keys */
import { z } from 'zod'

export type BodyworkItem = {
  id: string
  description: string
  cost: number
}

export type PaintItem = {
  id: string
  part: string
  quantity: number
  unitPrice: number
  total: number
}

export type PartItem = {
  id: string
  description: string
  cost: number
}

export type MechanicalItem = {
  id: string
  description: string
  cost: number
}

export type QuotationFormData = {
  // Client
  clientName: string
  clientPhone: string
  clientEmail: string
  clientAddress: string

  // Vehicle
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  vehicleColor: string
  vehiclePlates: string
  vehiclePaintCode: string

  // Services
  services: string[]
  customService: string
  estimatedTime: string
  piecesToWork: number

  // Items
  bodyworkItems: BodyworkItem[]
  paintItems: PaintItem[]
  partItems: PartItem[]
  mechanicalItems: MechanicalItem[]

  // Totals
  totalAmount: number
  downPayment: number
  remainingBalance: number
}

const bodyworkItemSchema = z.object({
  cost: z.coerce.number().min(0, 'Costo debe ser mayor o igual a 0'),
  description: z.string().min(3, 'Descripción requerida'),
  id: z.string(),
})

const paintItemSchema = z.object({
  id: z.string(),
  part: z.string().min(2, 'Parte requerida'),
  quantity: z.coerce.number().min(1, 'Cantidad debe ser al menos 1').int(),
  total: z.coerce.number(),
  unitPrice: z.coerce
    .number()
    .min(0, 'Precio unitario debe ser mayor o igual a 0'),
})

const partItemSchema = z.object({
  cost: z.coerce.number().min(0, 'Costo debe ser mayor o igual a 0'),
  description: z.string().min(3, 'Descripción requerida'),
  id: z.string(),
})

const mechanicalItemSchema = z.object({
  id: z.string(),
  description: z.string().min(3, 'Descripción requerida'),
  cost: z.coerce.number().min(0, 'Costo debe ser mayor o igual a 0'),
})

export const quotationSchema = z.object({
  // Client info
  clientName: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  clientPhone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos'),
  clientEmail: z.string().email('Email inválido'),
  clientAddress: z
    .string()
    .min(5, 'Dirección debe tener al menos 5 caracteres'),

  // Vehicle info
  vehicleBrand: z.string().min(2, 'Marca requerida'),
  vehicleModel: z.string().min(2, 'Modelo requerido'),
  vehicleYear: z.string().min(4, 'Año requerido'),
  vehicleColor: z.string().min(2, 'Color requerido'),
  vehiclePlates: z.string().min(5, 'Placas requeridas'),
  vehiclePaintCode: z.string(),

  // Services
  services: z.array(z.string()).min(1, 'Selecciona al menos un servicio'),
  customService: z.string(),
  estimatedTime: z.string().min(1, 'Tiempo estimado requerido'),
  piecesToWork: z.coerce.number().min(1, 'Debe ser al menos 1').int(),

  // Items
  bodyworkItems: z.array(bodyworkItemSchema),
  paintItems: z.array(paintItemSchema),
  partItems: z.array(partItemSchema),
  mechanicalItems: z.array(mechanicalItemSchema),
  // Totals
  totalAmount: z.coerce.number().min(0),
  downPayment: z.coerce.number().min(0),
  remainingBalance: z.coerce.number(),
})
