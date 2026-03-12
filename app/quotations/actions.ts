'use server'

import { revalidatePath } from 'next/cache'
import {prisma} from '@/lib/prisma'
import { quotationSchema } from '@/lib/validations'
import type { QuotationFormData } from '@/types'
// import { PrismaClient } from "../../generated/prisma/client";

export async function createQuotation(data: QuotationFormData) {
  try {
    // Validate data on server
    const validated = quotationSchema.parse(data)

    const quotation = await prisma.quotation.create({
      data: {
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

        // Totals
        totalAmount: validated.totalAmount,
        downPayment: validated.downPayment,
        remainingBalance: validated.remainingBalance,
      }
    })

    revalidatePath('/')
    return {
      success: true,
      id: quotation.id,
      folio: quotation.folio
    }
  } catch (error) {
    console.error('Error creating quotation:', error)

    // if (error instanceof PrismaClient) {
    //   return {
    //     success: false,
    //     error: 'Error de base de datos. Intenta nuevamente.'
    //   }
    // }

    return {
      success: false,
      error: 'Error al crear cotización. Verifica los datos.'
    }
  }
}

export async function updateQuotation(id: string, data: QuotationFormData) {
  try {
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
      }
    })

    revalidatePath('/')
    revalidatePath(`/quotations/${id}`)
    return { success: true }
  } catch (error) {
    console.error('Error updating quotation:', error)
    return {
      success: false,
      error: 'Error al actualizar cotización'
    }
  }
}

export async function deleteQuotation(id: string) {
  try {
    await prisma.quotation.delete({ where: { id } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting quotation:', error)
    return {
      success: false,
      error: 'Error al eliminar cotización'
    }
  }
}

export async function getQuotation(id: string) {
  try {
    const quotation = await prisma.quotation.findUnique({ where: { id } })
    return quotation
  } catch (error) {
    console.error('Error fetching quotation:', error)
    return null
  }
}

export async function getQuotations() {
  try {
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
      }
    })
    return quotations
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return []
  }
}
