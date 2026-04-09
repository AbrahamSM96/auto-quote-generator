/* eslint-disable react/no-array-index-key */

import type { BodyworkItem, PaintItem, PartItem, Quotation } from '@/types'
import { formatCurrency, formatDate, formatTime, padFolio } from '@/lib/utils'
import { SERVICES, UI_TEXT } from '@/lib/constants'
import { workshopConfig } from '@/config/workshop'

import { Card, } from '../ui/Card'
import { CardContent, } from '../ui/CardContent'
import { CardHeader } from '../ui/CardHeader'
import { CardTitle } from '../ui/CardTitle'


interface QuotationViewProps {
  quotation: Quotation
}

/**
 * QuotationView
 *
 * @param props - The component props
 * @param props.quotation - The quotation data to display in the view
 */
export function QuotationView({ quotation }: QuotationViewProps): React.ReactElement {
  const bodyworkItems = quotation.bodyworkItems as BodyworkItem[]
  const paintItems = quotation.paintItems as PaintItem[]
  const partItems = quotation.partItems as PartItem[]
  const services = quotation.services as string[]

  /**
   * getServiceLabel
   *
   * @param key - The service key to look up
   */
  const getServiceLabel = (key: string): string => {
    const service = SERVICES.find((s) => s.key === key)
    return service ? `${service.icon} ${service.label}` : key
  }

  const totalAmount = quotation.totalAmount

  const downPayment = quotation.downPayment

  const remainingBalance = quotation.remainingBalance

  return (
    <div className="space-y-6">
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
                <span className="h-px w-8 bg-primary" />
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
                {padFolio(quotation.folio)}
              </span>
            </div>
            <p className="font-technical text-xl font-bold text-text-primary">
              {formatTime(quotation.createdAt)}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {formatDate(quotation.createdAt)}
            </p>
          </div>
        </div>
      </header>

      {/* Client and Vehicle */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl">👤</span>
            </div>
            <CardTitle>{UI_TEXT.sections.client}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-text-secondary uppercase">Nombre</p>
                <p className="text-lg font-medium text-text-primary">
                  {quotation.clientName}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary uppercase">
                  Teléfono
                </p>
                <p className="font-technical font-medium text-text-primary">
                  {quotation.clientPhone}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary uppercase">Email</p>
                <p className="font-medium text-text-primary">
                  {quotation.clientEmail}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary uppercase">
                  Dirección
                </p>
                <p className="font-medium text-text-primary">
                  {quotation.clientAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <span className="text-2xl">🚗</span>
            </div>
            <CardTitle>{UI_TEXT.sections.vehicle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary uppercase">Marca</p>
                  <p className="font-medium text-text-primary">
                    {quotation.vehicleBrand}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary uppercase">
                    Modelo
                  </p>
                  <p className="font-medium text-text-primary">
                    {quotation.vehicleModel}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary uppercase">Año</p>
                  <p className="font-technical font-medium text-text-primary">
                    {quotation.vehicleYear}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary uppercase">Color</p>
                  <p className="font-medium text-text-primary">
                    {quotation.vehicleColor}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary uppercase">
                    Placas
                  </p>
                  <p className="font-technical font-medium text-text-primary">
                    {quotation.vehiclePlates}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary uppercase">
                    Código Pintura
                  </p>
                  <p className="font-technical font-medium text-text-primary">
                    {quotation.vehiclePaintCode || 'N/A'}
                  </p>
                </div>
              </div>
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
          <div className="mb-4 flex flex-wrap gap-2">
            {services.map((serviceKey) => (
              <span
                className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 font-medium text-primary"
                key={serviceKey}
              >
                {getServiceLabel(serviceKey)}
              </span>
            ))}
          </div>
          {quotation.customService && (
            <div className="mt-4 rounded-lg bg-dark-elevated p-4">
              <p className="mb-1 text-sm text-text-secondary uppercase">
                Servicio Personalizado
              </p>
              <p className="font-medium text-text-primary">
                {quotation.customService}
              </p>
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary uppercase">
                Tiempo Estimado
              </p>
              <p className="font-medium text-text-primary">
                {quotation.estimatedTime}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary uppercase">
                Piezas a Intervenir
              </p>
              <p className="font-technical font-medium text-text-primary">
                {quotation.piecesToWork}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      {bodyworkItems?.length > 0 && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
            <h3 className="text-lg font-bold text-text-primary uppercase">
              🔨 {UI_TEXT.sections.bodywork}
            </h3>
          </div>
          <div className="space-y-2 p-6">
            {bodyworkItems.map((item, index) => (
              <div
                className="flex items-center justify-between border-b border-dark-border/30 py-3"
                key={index}
              >
                <span className="text-text-primary">{item.description}</span>
                <span className="font-technical font-bold text-primary">
                  {formatCurrency(item.cost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {paintItems?.length > 0 && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
            <h3 className="text-lg font-bold text-text-primary">🎨 PINTURA</h3>
          </div>
          <div className="space-y-2 p-6">
            {paintItems.map((item, index) => (
              <div
                className="flex items-center justify-between border-b border-dark-border/30 py-3"
                key={index}
              >
                <div>
                  <span className="text-text-primary">{item.part}</span>
                  <span className="ml-2 text-sm text-text-secondary">
                    (x{item.quantity} × {formatCurrency(item.unitPrice)})
                  </span>
                </div>
                <span className="font-technical font-bold text-primary">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {partItems?.length > 0 && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <div className="border-b border-dark-border/50 bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4">
            <h3 className="text-lg font-bold text-text-primary">
              💡 REPUESTOS Y ACCESORIOS
            </h3>
          </div>
          <div className="space-y-2 p-6">
            {partItems.map((item, index) => (
              <div
                className="flex items-center justify-between border-b border-dark-border/30 py-3"
                key={index}
              >
                <span className="text-text-primary">{item.description}</span>
                <span className="font-technical font-bold text-primary">
                  {formatCurrency(item.cost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="relative overflow-hidden rounded-2xl border border-dark-border/50 bg-gradient-to-br from-dark-elevated via-dark-surface to-dark-elevated p-8 shadow-2xl">
        <div className="grid-pattern absolute inset-0 opacity-5" />
        <div className="relative z-10 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              TOTAL PRESUPUESTO
            </p>
            <p className="font-technical text-4xl font-black text-text-primary">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              ANTICIPO
            </p>
            <p className="font-technical text-4xl font-black text-text-primary">
              {formatCurrency(downPayment)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wider text-text-secondary uppercase">
              SALDO PENDIENTE
            </p>
            <p className="drop-shadow-glow font-technical text-4xl font-black text-accent-yellow">
              {formatCurrency(remainingBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
