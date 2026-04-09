import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { ESTIMATED_TIMES, SERVICES, UI_TEXT } from '@/lib/constants'
import { Card } from '@/components/ui/Card'
import { CardContent } from '@/components/ui/CardContent'
import { CardHeader } from '@/components/ui/CardHeader'
import { CardTitle } from '@/components/ui/CardTitle'
import { Input } from '@/components/ui/Input'
import type { QuotationFormData } from '@/types'
import { Select } from '@/components/ui/Select'

interface ServicesSectionProps {
  services: string[]
  register: UseFormRegister<QuotationFormData>
  errors: FieldErrors<QuotationFormData>
  onToggleService: (serviceKey: string) => void
}

/**
 * ServicesSection renders service selection and configuration
 *
 * @param props - The props for the ServicesSection component, including selected services, form registration, error handling, and service toggle handler.
 * @param props.services - The array of selected service keys.
 * @param props.register - The register function from react-hook-form for form fields.
 * @param props.errors - The errors object from react-hook-form for form validation.
 * @param props.onToggleService - The function to call when a service is toggled.
 */
export function ServicesSection({
  errors,
  onToggleService,
  register,
  services,
}: ServicesSectionProps): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <span className="text-2xl">✅</span>
        </div>
        <CardTitle>{UI_TEXT.sections.services}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <button
              className={`rounded-xl px-5 py-4 font-medium transition-all duration-200 ${(services || []).includes(service.key)
                ? 'scale-[1.02] bg-primary text-white shadow-glow-sm'
                : 'border border-dark-border bg-dark-elevated text-text-secondary hover:border-primary/50 hover:text-text-primary'
                } `}
              key={service.key}
              onClick={() => onToggleService(service.key)}
              type="button"
            >
              <span className="mr-2">{service.icon}</span>
              {service.label}
            </button>
          ))}
        </div>
        {/* istanbul ignore next */}
        {errors.services && (
          <p className="flex items-center gap-2 text-sm text-red-400">
            <span>⚠️</span>
            {errors.services.message}
          </p>
        )}
        {/* istanbul ignore next */}
        {(services || []).includes('other') && (
          <Input
            label="Especificar otro servicio"
            {...register('customService')}
            placeholder="Describe el servicio personalizado..."
          />
        )}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label={UI_TEXT.labels.estimatedTime}
            {...register('estimatedTime')}
            options={ESTIMATED_TIMES.map((time) => ({
              label: time,
              value: time,
            }))}
          />
          <Input
            label={UI_TEXT.labels.piecesToWork}
            type="number"
            {...register('piecesToWork')}
            error={errors.piecesToWork?.message}
          />
        </div>
      </CardContent>
    </Card>
  )
}
