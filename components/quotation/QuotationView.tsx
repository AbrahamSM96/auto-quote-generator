'use client'

import { formatDate, formatTime, formatCurrency, padFolio } from '@/lib/utils'
import { workshopConfig } from '@/config/workshop'
import { SERVICES, UI_TEXT } from '@/lib/constants'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

interface QuotationViewProps {
  quotation: any
}

export function QuotationView({ quotation }: QuotationViewProps) {
  const bodyworkItems = quotation.bodyworkItems as any[]
  const paintItems = quotation.paintItems as any[]
  const partItems = quotation.partItems as any[]
  const services = quotation.services as string[]

  const getServiceLabel = (key: string) => {
    const service = SERVICES.find(s => s.key === key)
    return service ? `${service.icon} ${service.label}` : key
  }

  const totalAmount = typeof quotation.totalAmount === 'object'
    ? quotation.totalAmount.toNumber()
    : Number(quotation.totalAmount)

  const downPayment = typeof quotation.downPayment === 'object'
    ? quotation.downPayment.toNumber()
    : Number(quotation.downPayment)

  const remainingBalance = typeof quotation.remainingBalance === 'object'
    ? quotation.remainingBalance.toNumber()
    : Number(quotation.remainingBalance)

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="glass-card rounded-2xl p-8 shadow-2xl border border-dark-border/50">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative z-10 w-24 h-24 rounded-full bg-dark-elevated border-2 border-primary/30 flex items-center justify-center">
                <span className="text-4xl">🔧</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-gradient">
                {workshopConfig.name}
              </h1>
              <p className="text-primary font-semibold tracking-wider mt-1 flex items-center gap-2">
                <span className="w-8 h-px bg-primary"></span>
                {workshopConfig.subtitle}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-3 bg-dark-elevated px-6 py-3 rounded-xl mb-3 border border-dark-border/50">
              <span className="text-text-secondary text-sm font-medium">FOLIO</span>
              <span className="text-primary font-black text-3xl font-technical">
                {padFolio(quotation.folio)}
              </span>
            </div>
            <p className="text-xl font-bold text-text-primary font-technical">
              {formatTime(quotation.createdAt)}
            </p>
            <p className="text-text-secondary text-sm mt-1">
              {formatDate(quotation.createdAt)}
            </p>
          </div>
        </div>
      </header>

      {/* Client and Vehicle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <CardTitle>{UI_TEXT.sections.client}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-text-secondary text-sm uppercase">Nombre</p>
                <p className="text-text-primary font-medium text-lg">{quotation.clientName}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase">Teléfono</p>
                <p className="text-text-primary font-medium font-technical">{quotation.clientPhone}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase">Email</p>
                <p className="text-text-primary font-medium">{quotation.clientEmail}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm uppercase">Dirección</p>
                <p className="text-text-primary font-medium">{quotation.clientAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
            <CardTitle>{UI_TEXT.sections.vehicle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-sm uppercase">Marca</p>
                  <p className="text-text-primary font-medium">{quotation.vehicleBrand}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm uppercase">Modelo</p>
                  <p className="text-text-primary font-medium">{quotation.vehicleModel}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-sm uppercase">Año</p>
                  <p className="text-text-primary font-medium font-technical">{quotation.vehicleYear}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm uppercase">Color</p>
                  <p className="text-text-primary font-medium">{quotation.vehicleColor}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-text-secondary text-sm uppercase">Placas</p>
                  <p className="text-text-primary font-medium font-technical">{quotation.vehiclePlates}</p>
                </div>
                <div>
                  <p className="text-text-secondary text-sm uppercase">Código Pintura</p>
                  <p className="text-text-primary font-medium font-technical">{quotation.vehiclePaintCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <Card>
        <CardHeader>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <CardTitle>{UI_TEXT.sections.services}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {services.map(serviceKey => (
              <span
                key={serviceKey}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium border border-primary/30"
              >
                {getServiceLabel(serviceKey)}
              </span>
            ))}
          </div>
          {quotation.customService && (
            <div className="mt-4 p-4 bg-dark-elevated rounded-lg">
              <p className="text-text-secondary text-sm uppercase mb-1">Servicio Personalizado</p>
              <p className="text-text-primary font-medium">{quotation.customService}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-text-secondary text-sm uppercase">Tiempo Estimado</p>
              <p className="text-text-primary font-medium">{quotation.estimatedTime}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm uppercase">Piezas a Intervenir</p>
              <p className="text-text-primary font-medium font-technical">{quotation.piecesToWork}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      {bodyworkItems?.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4 border-b border-dark-border/50">
            <h3 className="text-lg font-bold text-text-primary">🔨 HOJALATERÍA</h3>
          </div>
          <div className="p-6 space-y-2">
            {bodyworkItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-dark-border/30">
                <span className="text-text-primary">{item.description}</span>
                <span className="text-primary font-bold font-technical">{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {paintItems?.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4 border-b border-dark-border/50">
            <h3 className="text-lg font-bold text-text-primary">🎨 PINTURA</h3>
          </div>
          <div className="p-6 space-y-2">
            {paintItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-dark-border/30">
                <div>
                  <span className="text-text-primary">{item.part}</span>
                  <span className="text-text-secondary text-sm ml-2">
                    (x{item.quantity} × {formatCurrency(item.unitPrice)})
                  </span>
                </div>
                <span className="text-primary font-bold font-technical">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {partItems?.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-dark-elevated to-dark-surface px-6 py-4 border-b border-dark-border/50">
            <h3 className="text-lg font-bold text-text-primary">💡 REPUESTOS Y ACCESORIOS</h3>
          </div>
          <div className="p-6 space-y-2">
            {partItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-dark-border/30">
                <span className="text-text-primary">{item.description}</span>
                <span className="text-primary font-bold font-technical">{formatCurrency(item.cost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Totals */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-elevated via-dark-surface to-dark-elevated p-8 border border-dark-border/50 shadow-2xl">
        <div className="absolute inset-0 grid-pattern opacity-5" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
              TOTAL PRESUPUESTO
            </p>
            <p className="text-text-primary text-4xl font-black font-technical">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
              ANTICIPO
            </p>
            <p className="text-text-primary text-4xl font-black font-technical">
              {formatCurrency(downPayment)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
              SALDO PENDIENTE
            </p>
            <p className="text-accent-yellow text-4xl font-black font-technical drop-shadow-glow">
              {formatCurrency(remainingBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
