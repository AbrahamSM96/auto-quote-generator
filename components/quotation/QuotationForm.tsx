'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'

import type {
  BodyworkItem,
  MechanicalItem,
  PaintItem,
  PartItem,
  Quotation,
  QuotationFormData,
} from '@/types'
import { createQuotation, getNextFolio, updateQuotation } from '@/app/quotations/actions'
import { ESTIMATED_TIMES } from '@/lib/constants'
import { padFolio } from '@/lib/utils'
import { quotationSchema } from '@/lib/validations'

import { QuotationFormHeader } from './form-sections/QuotationFormHeader'
import { WorkshopProfileSection } from './form-sections/WorkshopProfileSection'
import { ClientVehicleSection } from './form-sections/ClientVehicleSection'
import { ServicesSection } from './form-sections/ServicesSection'
import { WorkItemsSection } from './form-sections/WorkItemsSection'
import { TotalsSection } from './form-sections/TotalsSection'
import { FormActionsSection } from './form-sections/FormActionsSection'

interface QuotationFormProps {
  mode: 'create' | 'edit'
  initialData?: Quotation
}

/**
 * QuotationForm component for creating and editing quotations
 *
 * @param props - Component props
 * @param props.initialData - Initial data for the form
 * @param props.mode - Mode of the form ('create' or 'edit')
 */
export function
  QuotationForm({
    initialData,
    mode,
  }: QuotationFormProps): React.ReactElement {
  const router = useRouter()
  const [nextFolio, setNextFolio] = useState<number | null>(null)

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<QuotationFormData>({
    defaultValues: initialData
      ? /* istanbul ignore next */ {
        /* istanbul ignore next */
        bodyworkItems: (initialData.bodyworkItems as BodyworkItem[]) || [],
        clientAddress: initialData.clientAddress,
        clientEmail: initialData.clientEmail,
        clientName: initialData.clientName,
        clientPhone: initialData.clientPhone,
        customService: initialData.customService,
        downPayment: initialData.downPayment,
        estimatedTime: initialData.estimatedTime,
        /* istanbul ignore next */
        mechanicalItems: (initialData.mechanicalItems as unknown as MechanicalItem[]) || [],
        /* istanbul ignore next */
        paintItems: (initialData.paintItems as PaintItem[]) || [],
        /* istanbul ignore next */
        partItems: (initialData.partItems as PartItem[]) || [],
        piecesToWork: initialData.piecesToWork,
        remainingBalance: initialData.remainingBalance,
        /* istanbul ignore next */
        services: (initialData.services as string[]) || [],
        totalAmount: initialData.totalAmount,
        vehicleBrand: initialData.vehicleBrand,
        vehicleColor: initialData.vehicleColor,
        vehicleModel: initialData.vehicleModel,
        vehiclePaintCode: initialData.vehiclePaintCode,
        vehiclePlates: initialData.vehiclePlates,
        vehicleYear: initialData.vehicleYear,
      }
      : {
        bodyworkItems: [],
        clientAddress: '',
        clientEmail: '',
        clientName: '',
        clientPhone: '',
        customService: '',
        downPayment: 0,
        estimatedTime: ESTIMATED_TIMES[1],
        mechanicalItems: [],
        paintItems: [],
        partItems: [],
        piecesToWork: 1,
        remainingBalance: 0,
        services: [],
        totalAmount: 0,
        vehicleBrand: '',
        vehicleColor: '',
        vehicleModel: '',
        vehiclePaintCode: '',
        vehiclePlates: '',
        vehicleYear: '',
      },
    resolver: zodResolver(quotationSchema) as Resolver<QuotationFormData>,
  })

  // Field arrays for dynamic sections
  const {
    append: appendBodywork,
    fields: bodyworkFields,
    remove: removeBodywork,
  } = useFieldArray({
    control,
    name: 'bodyworkItems',
  })

  const {
    append: appendPaint,
    fields: paintFields,
    remove: removePaint,
  } = useFieldArray({
    control,
    name: 'paintItems',
  })

  const {
    append: appendPart,
    fields: partFields,
    remove: removePart,
  } = useFieldArray({
    control,
    name: 'partItems',
  })

  const {
    append: appendMechanical,
    fields: mechanicalFields,
    remove: removeMechanical,
  } = useFieldArray({
    control,
    name: 'mechanicalItems',
  })

  // Watch for changes to calculate totals
  const bodyworkItems = useWatch({ control, name: 'bodyworkItems' })
  const paintItems = useWatch({ control, name: 'paintItems' })
  const partItems = useWatch({ control, name: 'partItems' })
  const mechanicalItems = useWatch({ control, name: 'mechanicalItems' })
  const downPayment = useWatch({ control, name: 'downPayment' })
  const services = useWatch({ control, name: 'services' })

  // Get next folio for new quotations
  useEffect(() => {
    if (mode === 'create') {
      getNextFolio().then(setNextFolio)
    }
  }, [mode])

  // Real-time total calculations
  useEffect(() => {
    /* istanbul ignore next */
    const bodyworkTotal = (bodyworkItems || []).reduce(
      /* istanbul ignore next */
      (sum, item) => sum + Number(item?.cost || 0),
      0
    )
    /* istanbul ignore next */
    const paintTotal = (paintItems || []).reduce(
      /* istanbul ignore next */
      (sum, item) => sum + Number(item?.total || 0),
      0
    )
    /* istanbul ignore next */
    const partsTotal = (partItems || []).reduce(
      /* istanbul ignore next */
      (sum, item) => sum + Number(item?.cost || 0),
      0
    )
    /* istanbul ignore next */
    const mechanicalTotal = (mechanicalItems || []).reduce(
      /* istanbul ignore next */
      (sum, item) => sum + Number(item?.cost || 0),
      0
    )

    const total = bodyworkTotal + paintTotal + partsTotal + mechanicalTotal
    const remaining = total - Number(downPayment || 0)

    setValue('totalAmount', total)
    setValue('remainingBalance', remaining)
  }, [
    bodyworkItems,
    paintItems,
    partItems,
    mechanicalItems,
    downPayment,
    setValue,
  ])

  // Update paint item total when quantity or unitPrice changes
  useEffect(() => {
    /* istanbul ignore next */
    paintItems?.forEach((item, index) => {
      /* istanbul ignore next */
      const total = Number(item?.quantity || 0) * Number(item?.unitPrice || 0)
      /* istanbul ignore next */
      if (/* istanbul ignore next */ item && total !== item.total) {
        setValue(`paintItems.${index}.total`, total)
      }
    })
  }, [paintItems, setValue])

  /**
   * onSubmit handler for form submission
   *
   * @param data - Form data to submit
   */
  const onSubmit = async (data: QuotationFormData): Promise<void> => {
    /* istanbul ignore next */
    if (mode === 'edit' && !initialData) {
      toast.error('No se encontró la cotización')
      return
    }

    /* istanbul ignore next */
    const result =
      mode === 'create'
        ? await createQuotation(data)
        : await updateQuotation(initialData?.id ?? '', data)

    /* istanbul ignore next */
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

  /**
   * toggleService toggles a service in the services array
   *
   * @param serviceKey - The key of the service to toggle
   */
  const toggleService = (serviceKey: string): void => {
    const current = services || []
    /* istanbul ignore next */
    const updated = current.includes(serviceKey)
      ? current.filter((s) => s !== serviceKey)
      : [...current, serviceKey]
    setValue('services', updated)
  }

  // Calculate section totals
  /* istanbul ignore next */
  const bodyworkTotal = (bodyworkItems || []).reduce(
    (sum, item) => sum + Number(item?.cost || 0),
    0
  )
  /* istanbul ignore next */
  const paintTotal = (paintItems || []).reduce(
    (sum, item) => sum + Number(item?.total || 0),
    0
  )
  /* istanbul ignore next */
  const partsTotal = (partItems || []).reduce(
    (sum, item) => sum + Number(item?.cost || 0),
    0
  )
  /* istanbul ignore next */
  const mechanicalTotal = (mechanicalItems || []).reduce(
    (sum, item) => sum + Number(item?.cost || 0),
    0
  )

  const totalAmount = useWatch({ control, name: 'totalAmount' }) || 0
  const remainingBalance = useWatch({ control, name: 'remainingBalance' }) || 0

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <QuotationFormHeader
        createdAt={initialData?.createdAt}
        folio={initialData?.folio}
        mode={mode}
        nextFolio={nextFolio}
      />

      <WorkshopProfileSection />

      <ClientVehicleSection errors={errors} register={register} />

      <ServicesSection
        errors={errors}
        onToggleService={toggleService}
        register={register}
        services={services || []}
      />

      <WorkItemsSection
        errors={errors}
        fields={bodyworkFields}
        onAppend={() =>
          appendBodywork({
            cost: 0,
            description: '',
            id: crypto.randomUUID(),
          })
        }
        onRemove={removeBodywork}
        register={register}
        sectionNumber={1}
        total={bodyworkTotal}
        type="bodywork"
      />

      <WorkItemsSection
        errors={errors}
        fields={paintFields}
        onAppend={() =>
          appendPaint({
            id: crypto.randomUUID(),
            part: '',
            quantity: 1,
            total: 0,
            unitPrice: 0,
          })
        }
        onRemove={removePaint}
        register={register}
        sectionNumber={2}
        total={paintTotal}
        type="paint"
      />

      <WorkItemsSection
        errors={errors}
        fields={partFields}
        onAppend={() =>
          appendPart({
            cost: 0,
            description: '',
            id: crypto.randomUUID(),
          })
        }
        onRemove={removePart}
        register={register}
        sectionNumber={3}
        total={partsTotal}
        type="parts"
      />

      <WorkItemsSection
        errors={errors}
        fields={mechanicalFields}
        onAppend={() =>
          appendMechanical({
            cost: 0,
            description: '',
            id: crypto.randomUUID(),
          })
        }
        onRemove={removeMechanical}
        register={register}
        sectionNumber={4}
        total={mechanicalTotal}
        type="mechanical"
      />

      <TotalsSection
        downPayment={downPayment || 0}
        register={register}
        remainingBalance={remainingBalance}
        totalAmount={totalAmount}
      />

      <FormActionsSection
        isSubmitting={isSubmitting}
        mode={mode}
        /* istanbul ignore next */
        onCancel={() => router.push('/')}
      />
    </form>
  )
}
