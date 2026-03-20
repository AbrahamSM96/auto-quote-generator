'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { createQuotation, updateQuotation } from '@/app/quotations/actions'
import { workshopConfig } from '@/config/workshop'
import {
  ESTIMATED_TIMES,
  SERVICES,
  UI_TEXT,
  VEHICLE_BRANDS,
} from '@/lib/constants'
import { formatDate, formatTime, padFolio } from '@/lib/utils'
import { quotationSchema } from '@/lib/validations'
import type { QuotationFormData } from '@/types'
import { Button } from '../ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

interface QuotationFormProps {
  mode: 'create' | 'edit'
  initialData?: any
}

export function QuotationForm({ mode, initialData }: QuotationFormProps) {
  const router = useRouter()
  const now = new Date()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: initialData || {
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      clientAddress: '',
      vehicleBrand: '',
      vehicleModel: '',
      vehicleYear: '',
      vehicleColor: '',
      vehiclePlates: '',
      vehiclePaintCode: '',
      services: [],
      customService: '',
      estimatedTime: ESTIMATED_TIMES[1],
      piecesToWork: 1,
      bodyworkItems: [],
      paintItems: [],
      partItems: [],
      totalAmount: 0,
      downPayment: 0,
      remainingBalance: 0,
    },
  })

  // Field arrays for dynamic sections
  const {
    fields: bodyworkFields,
    append: appendBodywork,
    remove: removeBodywork,
  } = useFieldArray({
    control,
    name: 'bodyworkItems',
  })

  const {
    fields: paintFields,
    append: appendPaint,
    remove: removePaint,
  } = useFieldArray({
    control,
    name: 'paintItems',
  })

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({
    control,
    name: 'partItems',
  })

  // Watch for changes to calculate totals
  const bodyworkItems = useWatch({ control, name: 'bodyworkItems' })
  const paintItems = useWatch({ control, name: 'paintItems' })
  const partItems = useWatch({ control, name: 'partItems' })
  const downPayment = useWatch({ control, name: 'downPayment' })
  const services = useWatch({ control, name: 'services' })

  // Real-time total calculations
  useEffect(() => {
    const bodyworkTotal = (bodyworkItems || []).reduce(
      (sum, item) => sum + Number(item?.cost || 0),
      0
    )
    const paintTotal = (paintItems || []).reduce(
      (sum, item) => sum + Number(item?.total || 0),
      0
    )
    const partsTotal = (partItems || []).reduce(
      (sum, item) => sum + Number(item?.cost || 0),
      0
    )

    const total = bodyworkTotal + paintTotal + partsTotal
    const remaining = total - Number(downPayment || 0)

    setValue('totalAmount', total)
    setValue('remainingBalance', remaining)
  }, [bodyworkItems, paintItems, partItems, downPayment, setValue])

  // Update paint item total when quantity or unitPrice changes
  useEffect(() => {
    paintItems?.forEach((item, index) => {
      const total = Number(item?.quantity || 0) * Number(item?.unitPrice || 0)
      if (item && total !== item.total) {
        setValue(`paintItems.${index}.total`, total)
      }
    })
  }, [paintItems, setValue])

  const onSubmit = async (data: QuotationFormData) => {
    const result =
      mode === 'create'
        ? await createQuotation(data)
        : await updateQuotation(initialData.id, data)

    if (result.success) {
      toast.success(
        mode === 'create'
          ? `Cotización #${result.folio ? padFolio(result.folio) : ''} creada exitosamente`
          : 'Cotización actualizada exitosamente'
      )
      router.push('/')
    } else {
      toast.error(result.error || 'Error al guardar cotización')
    }
  }

  const toggleService = (serviceKey: string) => {
    const current = services || []
    const updated = current.includes(serviceKey)
      ? current.filter((s) => s !== serviceKey)
      : [...current, serviceKey]
    setValue('services', updated)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <header className="glass-card rounded-2xl border border-dark-border/50 p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
              <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30 bg-dark-elevated">
                <span className="text-4xl">🔧</span>
              </div>
            </div>
            <div>
              <h1 className="text-gradient text-4xl font-black tracking-tight">
                {workshopConfig.name}
              </h1>
              <p className="mt-1 flex items-center gap-2 font-semibold tracking-wider text-primary">
                <span className="h-px w-8 bg-primary"></span>
                {workshopConfig.subtitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-3 inline-flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated px-6 py-3">
              <span className="text-sm font-medium text-text-secondary">
                FOLIO
              </span>
              <span className="font-technical text-3xl font-black text-primary">
                {mode === 'edit' ? padFolio(initialData?.folio || 0) : '---'}
              </span>
            </div>
            <p className="font-technical text-xl font-bold text-text-primary">
              {formatTime(now)}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {formatDate(now)}
            </p>
          </div>
        </div>
      </header>

      {/* Workshop Profile (read-only) */}
      <Card>
        <CardHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-2xl">🏢</span>
          </div>
          <CardTitle>{UI_TEXT.sections.workshop}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm tracking-wide text-text-secondary uppercase">
                Encargado
              </p>
              <p className="font-medium text-text-primary">
                {workshopConfig.manager}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm tracking-wide text-text-secondary uppercase">
                Teléfono
              </p>
              <p className="font-technical font-medium text-text-primary">
                {workshopConfig.phone}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm tracking-wide text-text-secondary uppercase">
                Email
              </p>
              <p className="font-medium text-text-primary">
                {workshopConfig.email}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm tracking-wide text-text-secondary uppercase">
                Dirección
              </p>
              <p className="font-medium text-text-primary">
                {workshopConfig.address}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client and Vehicle Info */}
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
                { value: '', label: 'Seleccionar marca...' },
                ...VEHICLE_BRANDS.map((brand) => ({
                  value: brand,
                  label: brand,
                })),
              ]}
            />
            <Input
              label="Modelo / Año"
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

      {/* Services */}
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
                key={service.key}
                type="button"
                onClick={() => toggleService(service.key)}
                className={`rounded-xl px-5 py-4 font-medium transition-all duration-200 ${
                  (services || []).includes(service.key)
                    ? 'scale-[1.02] bg-primary text-white shadow-glow-sm'
                    : 'border border-dark-border bg-dark-elevated text-text-secondary hover:border-primary/50 hover:text-text-primary'
                } `}
              >
                <span className="mr-2">{service.icon}</span>
                {service.label}
              </button>
            ))}
          </div>
          {errors.services && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <span>⚠️</span>
              {errors.services.message}
            </p>
          )}
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
                value: time,
                label: time,
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

      {/* Bodywork Section */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
              1
            </div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <span className="text-xl">🔨</span>
              {UI_TEXT.sections.bodywork.toUpperCase()}
            </h3>
          </div>
          <span className="font-technical text-2xl font-bold text-primary">
            $
            {(bodyworkItems || [])
              .reduce((sum, item) => sum + Number(item?.cost || 0), 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="space-y-3 p-6">
          {bodyworkFields.map((field, index) => (
            <div
              key={field.id}
              className="group flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated p-4 transition-colors hover:border-primary/30"
            >
              <Input
                {...register(`bodyworkItems.${index}.description`)}
                placeholder={UI_TEXT.placeholders.bodyworkDescription}
                className="flex-1"
                error={errors.bodyworkItems?.[index]?.description?.message}
              />
              <Input
                {...register(`bodyworkItems.${index}.cost`)}
                type="number"
                step="0.01"
                placeholder="$0.00"
                className="w-32 text-right font-technical"
                error={errors.bodyworkItems?.[index]?.cost?.message}
              />
              <button
                type="button"
                onClick={() => removeBodywork(index)}
                className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendBodywork({
                id: crypto.randomUUID(),
                description: '',
                cost: 0,
              })
            }
            className="w-full rounded-xl border-2 border-dashed border-dark-border py-4 font-medium text-text-secondary transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            {UI_TEXT.buttons.addBodywork}
          </button>
        </div>
      </div>

      {/* Paint Section */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
              2
            </div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary">
              <span className="text-xl">🎨</span>
              {UI_TEXT.sections.paint.toUpperCase()}
            </h3>
          </div>
          <span className="font-technical text-2xl font-bold text-primary">
            $
            {(paintItems || [])
              .reduce((sum, item) => sum + Number(item?.total || 0), 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="space-y-3 p-6">
          {paintFields.map((field, index) => (
            <div
              key={field.id}
              className="group flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated p-4 transition-colors hover:border-primary/30"
            >
              <Input
                {...register(`paintItems.${index}.part`)}
                placeholder={UI_TEXT.placeholders.paintPart}
                className="flex-1"
                error={errors.paintItems?.[index]?.part?.message}
              />
              <Input
                {...register(`paintItems.${index}.quantity`)}
                type="number"
                placeholder="Cant."
                className="w-20 text-center font-technical"
                error={errors.paintItems?.[index]?.quantity?.message}
              />
              <Input
                {...register(`paintItems.${index}.unitPrice`)}
                type="number"
                step="0.01"
                placeholder="P. Unit."
                className="w-28 text-right font-technical"
                error={errors.paintItems?.[index]?.unitPrice?.message}
              />
              <Input
                {...register(`paintItems.${index}.total`)}
                type="number"
                step="0.01"
                placeholder="$0.00"
                className="w-32 bg-dark-bg text-right font-technical"
                readOnly
              />
              <button
                type="button"
                onClick={() => removePaint(index)}
                className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendPaint({
                id: crypto.randomUUID(),
                part: '',
                quantity: 1,
                unitPrice: 0,
                total: 0,
              })
            }
            className="w-full rounded-xl border-2 border-dashed border-dark-border py-4 font-medium text-text-secondary transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            {UI_TEXT.buttons.addPaint}
          </button>
        </div>
      </div>

      {/* Parts Section */}
      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-white">
              3
            </div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-text-primary uppercase">
              <span className="text-xl">💡</span>
              {UI_TEXT.sections.parts}
            </h3>
          </div>
          <span className="font-technical text-2xl font-bold text-primary">
            $
            {(partItems || [])
              .reduce((sum, item) => sum + Number(item?.cost || 0), 0)
              .toFixed(2)}
          </span>
        </div>
        <div className="space-y-3 p-6">
          {partFields.map((field, index) => (
            <div
              key={field.id}
              className="group flex items-center gap-3 rounded-xl border border-dark-border/50 bg-dark-elevated p-4 transition-colors hover:border-primary/30"
            >
              <Input
                {...register(`partItems.${index}.description`)}
                placeholder={UI_TEXT.placeholders.partDescription}
                className="flex-1"
                error={errors.partItems?.[index]?.description?.message}
              />
              <Input
                {...register(`partItems.${index}.cost`)}
                type="number"
                step="0.01"
                placeholder="$0.00"
                className="w-32 text-right font-technical"
                error={errors.partItems?.[index]?.cost?.message}
              />
              <button
                type="button"
                onClick={() => removePart(index)}
                className="h-10 w-10 rounded-lg bg-red-500/10 text-red-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500/20"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendPart({ id: crypto.randomUUID(), description: '', cost: 0 })
            }
            className="w-full rounded-xl border-2 border-dashed border-dark-border py-4 font-medium text-text-secondary transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            {UI_TEXT.buttons.addPart}
          </button>
        </div>
      </div>

      {/* Totals Section */}
      <div className="relative overflow-hidden rounded-2xl border border-dark-border/50 bg-gradient-to-br from-dark-elevated via-dark-surface to-dark-elevated p-8 shadow-2xl">
        <div className="grid-pattern absolute inset-0 opacity-5" />
        <div className="relative z-10 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              {UI_TEXT.labels.total}
            </p>
            <p className="font-technical text-4xl font-black text-text-primary">
              $
              {Number(useWatch({ control, name: 'totalAmount' }) || 0).toFixed(
                2
              )}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              {UI_TEXT.labels.downPayment}
            </p>
            <input
              {...register('downPayment')}
              type="number"
              step="0.01"
              className="w-full rounded-xl border-2 border-primary/30 bg-dark-bg py-3 text-center font-technical text-3xl font-bold text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              {UI_TEXT.labels.balance}
            </p>
            <p className="drop-shadow-glow font-technical text-4xl font-black text-accent-yellow">
              $
              {Number(
                useWatch({ control, name: 'remainingBalance' }) || 0
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/')}
          disabled={isSubmitting}
        >
          {UI_TEXT.buttons.cancel}
        </Button>
        <Button
          type="submit"
          className="flex-1"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === 'create' ? UI_TEXT.buttons.save : UI_TEXT.buttons.update}
        </Button>
      </div>
    </form>
  )
}
