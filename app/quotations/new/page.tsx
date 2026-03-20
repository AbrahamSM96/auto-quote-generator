import { QuotationForm } from '@/components/quotation/QuotationForm'

export default function NewQuotationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-surface">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <QuotationForm mode="create" />
      </div>
    </div>
  )
}
