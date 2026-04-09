import type { UseFormRegister } from 'react-hook-form'

import type { QuotationFormData } from '@/types'
import { UI_TEXT } from '@/lib/constants'

interface TotalsSectionProps {
  totalAmount: number
  downPayment: number
  remainingBalance: number
  register: UseFormRegister<QuotationFormData>
}

/**
 * TotalsSection displays and manages quotation totals
 *
 * @param props - The props for the TotalsSection component, including total amount, down payment, remaining balance, and form registration.
 * @param props.totalAmount - The total amount of the quotation.
 * @param props.remainingBalance - The remaining balance amount.
 * @param props.register - The register function from react-hook-form for form fields.
 */
export function TotalsSection({
  register,
  remainingBalance,
  totalAmount,
}: TotalsSectionProps): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dark-border/50 bg-gradient-to-br from-dark-elevated via-dark-surface to-dark-elevated p-8 shadow-2xl">
      <div className="grid-pattern absolute inset-0 opacity-5" />
      <div className="relative z-10 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
            {UI_TEXT.labels.total}
          </p>
          <p className="font-technical text-4xl font-black text-text-primary">
            ${Number(totalAmount || 0).toFixed(2)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
            {UI_TEXT.labels.downPayment}
          </p>
          <input
            {...register('downPayment')}
            className="w-full rounded-xl border-2 border-primary/30 bg-dark-bg py-3 text-center font-technical text-3xl font-bold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
            {UI_TEXT.labels.balance}
          </p>
          <p className="drop-shadow-glow font-technical text-4xl font-black text-accent-yellow">
            ${Number(remainingBalance || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
