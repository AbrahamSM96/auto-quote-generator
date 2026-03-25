import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { JSX } from 'react'

import { formatCurrency, formatDate, formatTime, padFolio } from '@/lib/utils'
import { SERVICES } from '@/lib/constants'
import { workshopConfig } from '@/config/workshop'

import { BodyworkItem, PaintItem, PartItem, Quotation } from '../../types'

const styles = StyleSheet.create(
  {
    balanceValue: { color: '#FBBF24', fontSize: 18, fontWeight: 'bold' },
    col: { flex: 1 },
    dateTime: { color: '#6B7280', fontSize: 10, textAlign: 'right' },
    folio: { color: '#EF4444', fontSize: 28, fontWeight: 'bold' },
    folioLabel: { color: '#6B7280', fontSize: 10, marginBottom: 4 },
    grid2: { flexDirection: 'row', gap: 20 },
    header: {
      borderBottom: '2px solid #EF4444',
      marginBottom: 20,
      paddingBottom: 15,
    },
    headerRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    label: {
      color: '#6B7280',
      fontSize: 9,
      marginBottom: 2,
      textTransform: 'uppercase',
    },
    page: {
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      fontSize: 10,
      padding: 40,
    },
    section: { marginBottom: 15, marginTop: 20 },
    sectionHeader: {
      backgroundColor: '#1F2937',
      color: '#ffffff',
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 10,
      padding: 8,
    },
    serviceTag: {
      backgroundColor: '#FEE2E2',
      borderRadius: 4,
      color: '#991B1B',
      fontSize: 9,
      marginBottom: 8,
      marginRight: 8,
      padding: '4 8',
    },
    servicesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    subtitle: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },
    table: { marginTop: 10 },
    tableCol1: { flex: 3 },
    tableCol2: { flex: 1, textAlign: 'right' },
    tableRow: {
      borderBottom: '1px solid #E5E7EB',
      flexDirection: 'row',
      paddingVertical: 8,
    },
    title: {
      color: '#1F2937',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    totalItem: { alignItems: 'center' },
    totalLabel: {
      color: '#9CA3AF',
      fontSize: 8,
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    totalValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    totalsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
    totalsSection: { backgroundColor: '#1F2937', marginTop: 20, padding: 15 },
    value: { color: '#1F2937', fontSize: 11 },
  }
)

/**
 * QuotationPDF 
 *
 * @param props - Component props
 * @param props.quotation - Quotation data to generate the PDF
 */
export function QuotationPDF({ quotation }: { quotation: Quotation }): JSX.Element {
  const totalAmount = quotation.totalAmount

  const downPayment = quotation.downPayment

  const remainingBalance = quotation.remainingBalance

  const bodyworkItems = (quotation.bodyworkItems || []) as BodyworkItem[]
  const paintItems = (quotation.paintItems || []) as PaintItem[]
  const partItems = (quotation.partItems || []) as PartItem[]
  const services = (quotation.services || []) as string[]

  /**
   * getServiceLabel
   *
   * @param key - Service key to find the label
   */
  const getServiceLabel = (key: string): string => {
    const service = SERVICES.find((s) => s.key === key)
    return service ? service.label : key
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>{workshopConfig.name}</Text>
              <Text style={styles.subtitle}>{workshopConfig.subtitle}</Text>
            </View>
            <View>
              <Text style={styles.folioLabel}>FOLIO:</Text>
              <Text style={styles.folio}>#{padFolio(quotation.folio)}</Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={styles.dateTime}>
              {formatDate(quotation.createdAt)}
            </Text>
            <Text style={styles.dateTime}>
              {formatTime(quotation.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Text style={styles.label}>Encargado</Text>
              <Text style={styles.value}>{workshopConfig.manager}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{workshopConfig.phone}</Text>
            </View>
          </View>
          <View style={[styles.grid2, { marginTop: 8 }]}>
            <View style={styles.col}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{workshopConfig.email}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.value}>{workshopConfig.address}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATOS DEL CLIENTE</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Text style={styles.label}>Nombre</Text>
              <Text style={styles.value}>{quotation.clientName}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Teléfono</Text>
              <Text style={styles.value}>{quotation.clientPhone}</Text>
            </View>
          </View>
          <View style={[styles.grid2, { marginTop: 8 }]}>
            <View style={styles.col}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{quotation.clientEmail}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Dirección</Text>
              <Text style={styles.value}>{quotation.clientAddress}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>DATOS DEL VEHÍCULO</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Text style={styles.label}>Marca</Text>
              <Text style={styles.value}>{quotation.vehicleBrand}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Modelo / Año</Text>
              <Text style={styles.value}>
                {quotation.vehicleModel} {quotation.vehicleYear}
              </Text>
            </View>
          </View>
          <View style={[styles.grid2, { marginTop: 8 }]}>
            <View style={styles.col}>
              <Text style={styles.label}>Color</Text>
              <Text style={styles.value}>{quotation.vehicleColor}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Placas</Text>
              <Text style={styles.value}>{quotation.vehiclePlates}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SERVICIOS SOLICITADOS</Text>
          <View style={styles.servicesContainer}>
            {services.map((serviceKey, index) => (
              <Text key={index} style={styles.serviceTag}>
                {getServiceLabel(serviceKey)}
              </Text>
            ))}
          </View>
          {quotation.customService && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.label}>Servicio Personalizado</Text>
              <Text style={styles.value}>{quotation.customService}</Text>
            </View>
          )}
        </View>

        {bodyworkItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>HOJALATERÍA</Text>
            <View style={styles.table}>
              {bodyworkItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol1, styles.value]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.tableCol2, styles.value]}>
                    {formatCurrency(item.cost)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {paintItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>PINTURA</Text>
            <View style={styles.table}>
              {paintItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol1, styles.value]}>
                    {item.part} (x{item.quantity} ×{' '}
                    {formatCurrency(item.unitPrice)})
                  </Text>
                  <Text style={[styles.tableCol2, styles.value]}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {partItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>REPUESTOS Y ACCESORIOS</Text>
            <View style={styles.table}>
              {partItems.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCol1, styles.value]}>
                    {item.description}
                  </Text>
                  <Text style={[styles.tableCol2, styles.value]}>
                    {formatCurrency(item.cost)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.totalsSection}>
          <View style={styles.totalsGrid}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>TOTAL PRESUPUESTO</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>ANTICIPO</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(downPayment)}
              </Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>SALDO PENDIENTE</Text>
              <Text style={styles.balanceValue}>
                {formatCurrency(remainingBalance)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
