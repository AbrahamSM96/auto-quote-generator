/* eslint-disable no-console */
import { type NextRequest, NextResponse } from 'next/server'
import { pdf } from '@react-pdf/renderer'

import { getQuotation } from '@/app/quotations/actions'
import { padFolio } from '@/lib/utils'
import { QuotationPDF } from '@/components/pdf/QuotationPDF'

/**
 *  GET /api/quotations/[id]/pdf
 *  Generates a PDF for the specified quotation ID and returns it as a downloadable file.
 *
 * @param request - The incoming NextRequest object.
 * @param params - An object containing the route parameters.
 * @param params.params - A promise containing the route parameters, including the quotation ID.
 * @returns A NextResponse containing the PDF file or an error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params
    const quotation = await getQuotation(id)

    if (!quotation) {
      return new NextResponse('Quotation not found', { status: 404 })
    }

    const pdfDoc = QuotationPDF({ quotation })
    const pdfBuffer = await pdf(pdfDoc).toBuffer()

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        'Content-Disposition': `attachment; filename="Cotizacion-${padFolio(quotation.folio)}.pdf"`,
        'Content-Type': 'application/pdf',
      },
    })
  } catch (error) {
    console.log('Error generating PDF:', error)
    return new NextResponse('Error generating PDF', { status: 500 })
  }
}
