'use client'

interface PDFButtonProps {
  quotationId: string
}

/**
 * PDFButton - Client component for generating PDF
 *
 * @param props - Component props
 * @param props.quotationId - The ID of the quotation to generate PDF for
 */
export function PDFButton({ quotationId }: PDFButtonProps): React.ReactElement {
  /**
   * handleClick - Open the PDF in a new tab when the button is clicked
   */
  const handleClick = (): void => {
    window.open(`/api/quotations/${quotationId}/pdf`, '_blank')
  }

  return (
    <button
      className="rounded-xl bg-gradient-to-r from-primary to-red-600 px-6 py-3 font-bold text-white shadow-glow transition-all hover:shadow-glow-lg"
      onClick={handleClick}
      type="button"
    >
      📄 Generar PDF
    </button>
  )
}
