import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { UI_TEXT, VEHICLE_BRANDS } from '@/lib/constants'
import { Card } from '@/components/ui/Card'
import { CardContent } from '@/components/ui/CardContent'
import { CardHeader } from '@/components/ui/CardHeader'
import { CardTitle } from '@/components/ui/CardTitle'
import { Input } from '@/components/ui/Input'
import type { QuotationFormData } from '@/types'
import { Select } from '@/components/ui/Select'

interface ClientVehicleSectionProps {
  register: UseFormRegister<QuotationFormData>
  errors: FieldErrors<QuotationFormData>
}

/**
 * ClientVehicleSection renders client and vehicle information forms
 *
 * @param props - The props for the ClientVehicleSection component, including form registration and error handling.
 * @param props.register - The register function from react-hook-form for form fields.
 * @param props.errors - The errors object from react-hook-form for form validation.
 */
export function ClientVehicleSection({
  errors,
  register,
}: ClientVehicleSectionProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Client */}
      <Card>
        <CardHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">👤</span>
          </div>
          <CardTitle>{UI_TEXT.sections.client}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            label="Nombre del Cliente"
            {...register('clientName')}
            error={errors.clientName?.message}
            placeholder={UI_TEXT.placeholders.clientName}
          />
          <Input
            label="Teléfono"
            {...register('clientPhone')}
            error={errors.clientPhone?.message}
            placeholder={UI_TEXT.placeholders.clientPhone}
          />
          <Input
            label="Email"
            type="email"
            {...register('clientEmail')}
            error={errors.clientEmail?.message}
            placeholder={UI_TEXT.placeholders.clientEmail}
          />
          <Input
            label="Dirección"
            {...register('clientAddress')}
            error={errors.clientAddress?.message}
            placeholder={UI_TEXT.placeholders.clientAddress}
          />
        </CardContent>
      </Card>

      {/* Vehicle */}
      <Card>
        <CardHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">🚗</span>
          </div>
          <CardTitle>{UI_TEXT.sections.vehicle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            label="Marca"
            {...register('vehicleBrand')}
            error={errors.vehicleBrand?.message}
            options={[
              { label: 'Seleccionar marca...', value: '' },
              ...VEHICLE_BRANDS.map((brand) => ({
                label: brand,
                value: brand,
              })),
            ]}
          />
          <Input
            label="Modelo"
            {...register('vehicleModel')}
            error={errors.vehicleModel?.message}
            placeholder={UI_TEXT.placeholders.vehicleModel}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Año"
              {...register('vehicleYear')}
              error={errors.vehicleYear?.message}
              placeholder="2024"
            />
            <Input
              label="Color"
              {...register('vehicleColor')}
              error={errors.vehicleColor?.message}
              placeholder={UI_TEXT.placeholders.vehicleColor}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Placas"
              {...register('vehiclePlates')}
              error={errors.vehiclePlates?.message}
              placeholder={UI_TEXT.placeholders.vehiclePlates}
            />
            <Input
              label="Código de Pintura"
              {...register('vehiclePaintCode')}
              error={errors.vehiclePaintCode?.message}
              placeholder={UI_TEXT.placeholders.vehiclePaintCode}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
