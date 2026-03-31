/* eslint-disable sort-keys */
'use server'

import { revalidatePath } from 'next/cache'

import type {
  BodyworkItem,
  MechanicalItem,
  PaintItem,
  PartItem,
  Quotation,
  QuotationFormData,
} from '@/types'
import { getSession } from '@/lib/auth-helpers'
import { prisma } from '@/lib/prisma'
import { quotationSchema } from '@/lib/validations'

type ActionSuccess = {
  success: true
  id?: string
  folio?: number
}

type ActionError = {
  success: false
  error: string
}

type ActionResult = ActionSuccess | ActionError

/**
 * createQuotation
 *
 * @param data - Quotation form data to create a new quotation
 */
export async function createQuotation(
  data: QuotationFormData
): Promise<ActionResult> {
  try {
    // Check authentication
    const session = await getSession()
    const userId = session.user.id

    // Validate data on server
    const validated = quotationSchema.parse(data)

    const quotation = await prisma.quotation.create({
      data: {
        // User
        userId: userId,

        // Client
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        clientEmail: validated.clientEmail,
        clientAddress: validated.clientAddress,

        // Vehicle
        vehicleBrand: validated.vehicleBrand,
        vehicleModel: validated.vehicleModel,
        vehicleYear: validated.vehicleYear,
        vehicleColor: validated.vehicleColor,
        vehiclePlates: validated.vehiclePlates,
        vehiclePaintCode: validated.vehiclePaintCode || '',

        // Services
        services: validated.services,
        customService: validated.customService,
        estimatedTime: validated.estimatedTime,
        piecesToWork: validated.piecesToWork,

        // Items (JSON)
        bodyworkItems: validated.bodyworkItems,
        paintItems: validated.paintItems,
        partItems: validated.partItems,
        mechanicalItems: validated.mechanicalItems,

        // Totals
        totalAmount: validated.totalAmount,
        downPayment: validated.downPayment,
        remainingBalance: validated.remainingBalance,
      },
    })

    revalidatePath('/')
    return {
      success: true,
      id: quotation.id,
      folio: quotation.folio,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error creating quotation:', error)

    // if (error instanceof PrismaClient) {
    //   return {
    //     success: false,
    //     error: 'Error de base de datos. Intenta nuevamente.'
    //   }
    // }

    return {
      success: false,
      error: 'Error al crear cotización. Verifica los datos.',
    }
  }
}

/**
 *updateQuotation
 *
 * @param id - ID of the quotation to update
 * @param data - Updated quotation form data
 */
export async function updateQuotation(
  id: string,
  data: QuotationFormData
): Promise<ActionResult> {
  try {
    // Check authentication
    await getSession()

    const validated = quotationSchema.parse(data)

    await prisma.quotation.update({
      where: { id },
      data: {
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        clientEmail: validated.clientEmail,
        clientAddress: validated.clientAddress,
        vehicleBrand: validated.vehicleBrand,
        vehicleModel: validated.vehicleModel,
        vehicleYear: validated.vehicleYear,
        vehicleColor: validated.vehicleColor,
        vehiclePlates: validated.vehiclePlates,
        vehiclePaintCode: validated.vehiclePaintCode || '',
        services: validated.services,
        customService: validated.customService,
        estimatedTime: validated.estimatedTime,
        piecesToWork: validated.piecesToWork,
        bodyworkItems: validated.bodyworkItems,
        paintItems: validated.paintItems,
        partItems: validated.partItems,
        totalAmount: validated.totalAmount,
        downPayment: validated.downPayment,
        remainingBalance: validated.remainingBalance,
        mechanicalItems: validated.mechanicalItems,
      },
    })

    revalidatePath('/')
    revalidatePath(`/quotations/${id}`)
    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error updating quotation:', error)
    return {
      success: false,
      error: 'Error al actualizar cotización',
    }
  }
}

/**
 * deleteQuotation
 *
 * @param id - ID of the quotation to delete
 */
// oxlint-disable-next-line typescript/explicit-module-boundary-types
export async function deleteQuotation(id: string) {
  try {
    // Check authentication
    await getSession()

    await prisma.quotation.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error deleting quotation:', error)
    return {
      success: false,
      error: 'Error al eliminar cotización',
    }
  }
}

/**
 * getQuotation
 *
 * @param id - ID of the quotation to retrieve
 */
export async function getQuotation(id: string): Promise<Quotation | null> {
  try {
    // Check authentication
    await getSession()

    const quotation = await prisma.quotation.findUnique({ where: { id } })

    if (!quotation) return null

    // Convert Decimal to number and JSON to proper types for Client Components
    return {
      ...quotation,
      totalAmount: quotation.totalAmount.toNumber(),
      downPayment: quotation.downPayment.toNumber(),
      remainingBalance: quotation.remainingBalance.toNumber(),
      customService: quotation.customService ?? '',
      services: quotation.services as string[],
      bodyworkItems: quotation.bodyworkItems as unknown as BodyworkItem[],
      paintItems: quotation.paintItems as unknown as PaintItem[],
      partItems: quotation.partItems as unknown as PartItem[],
      mechanicalItems: quotation.mechanicalItems as unknown as MechanicalItem[],
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching quotation:', error)
    return null
  }
}

/**
 * getNextFolio - Get the next available folio number
 */
export async function getNextFolio(): Promise<number> {
  try {
    const lastQuotation = await prisma.quotation.findFirst({
      orderBy: { folio: 'desc' },
      select: { folio: true },
    })
    return (lastQuotation?.folio ?? 0) + 1
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching next folio:', error)
    return 1
  }
}

/**
 * getQuotations
 */
export async function getQuotations(): Promise<
  Array<{
    id: string
    folio: number
    clientName: string
    vehicleBrand: string
    vehicleModel: string
    totalAmount: number
    createdAt: Date
  }>
> {
  try {
    // Check authentication
    await getSession()

    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        folio: true,
        clientName: true,
        vehicleBrand: true,
        vehicleModel: true,
        totalAmount: true,
        createdAt: true,
      },
    })

    // Convert Decimal to number for Client Components
    return quotations.map((q) => ({
      ...q,
      totalAmount: q.totalAmount.toNumber(),
    }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error fetching quotations:', error)
    return []
  }
}
