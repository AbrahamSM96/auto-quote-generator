import { QuotationForm } from '@/components/quotation/QuotationForm'

export default function NewQuotationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <QuotationForm mode="create" />
      </div>
    </div>
  )
}
