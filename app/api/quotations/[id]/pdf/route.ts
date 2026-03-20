import { pdf } from '@react-pdf/renderer'
import { type NextRequest, NextResponse } from 'next/server'
import { getQuotation } from '@/app/quotations/actions'
import { QuotationPDF } from '@/components/pdf/QuotationPDF'
import { padFolio } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quotation = await getQuotation(id)

    if (!quotation) {
      return new NextResponse('Quotation not found', { status: 404 })
    }

    const pdfDoc = QuotationPDF({ quotation })
    const pdfBuffer = await pdf(pdfDoc).toBuffer()

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Cotizacion-${padFolio(quotation.folio)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return new NextResponse('Error generating PDF', { status: 500 })
  }
}
