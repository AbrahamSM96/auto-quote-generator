import { z } from 'zod'

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
  vehiclePaintCode: z.string().optional(),

  // Services
  services: z.array(z.string()).min(1, 'Selecciona al menos un servicio'),
  customService: z.string().optional(),
  estimatedTime: z.string().min(1, 'Tiempo estimado requerido'),
  piecesToWork: z.coerce.number().min(1, 'Debe ser al menos 1').int(),

  // Items
  bodyworkItems: z
    .array(
      z.object({
        id: z.string(),
        description: z.string().min(3, 'Descripción requerida'),
        cost: z.coerce.number().min(0, 'Costo debe ser mayor o igual a 0'),
      })
    )
    .default([]),

  paintItems: z
    .array(
      z.object({
        id: z.string(),
        part: z.string().min(2, 'Parte requerida'),
        quantity: z.coerce
          .number()
          .min(1, 'Cantidad debe ser al menos 1')
          .int(),
        unitPrice: z.coerce
          .number()
          .min(0, 'Precio unitario debe ser mayor o igual a 0'),
        total: z.coerce.number(),
      })
    )
    .default([]),

  partItems: z
    .array(
      z.object({
        id: z.string(),
        description: z.string().min(3, 'Descripción requerida'),
        cost: z.coerce.number().min(0, 'Costo debe ser mayor o igual a 0'),
      })
    )
    .default([]),

  // Totals
  totalAmount: z.coerce.number().min(0),
  downPayment: z.coerce.number().min(0),
  remainingBalance: z.coerce.number(),
})

export type QuotationFormData = z.infer<typeof quotationSchema>
