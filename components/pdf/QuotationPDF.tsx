/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { workshopConfig } from '@/config/workshop'
import { SERVICES } from '@/lib/constants'
import { formatCurrency, formatDate, formatTime, padFolio } from '@/lib/utils'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2px solid #EF4444',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: { fontSize: 12, color: '#EF4444', fontWeight: 'bold' },
  folio: { fontSize: 28, fontWeight: 'bold', color: '#EF4444' },
  folioLabel: { fontSize: 10, color: '#6B7280', marginBottom: 4 },
  dateTime: { fontSize: 10, color: '#6B7280', textAlign: 'right' },
  section: { marginTop: 20, marginBottom: 15 },
  sectionHeader: {
    backgroundColor: '#1F2937',
    color: '#ffffff',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: { fontSize: 11, color: '#1F2937' },
  grid2: { flexDirection: 'row', gap: 20 },
  col: { flex: 1 },
  serviceTag: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    marginRight: 8,
    marginBottom: 8,
  },
  servicesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  table: { marginTop: 10 },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E7EB',
    paddingVertical: 8,
  },
  tableCol1: { flex: 3 },
  tableCol2: { flex: 1, textAlign: 'right' },
  totalsSection: { marginTop: 20, backgroundColor: '#1F2937', padding: 15 },
  totalsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  totalItem: { alignItems: 'center' },
  totalLabel: {
    fontSize: 8,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  balanceValue: { fontSize: 18, fontWeight: 'bold', color: '#FBBF24' },
})

export function QuotationPDF({ quotation }: { quotation: any }) {
  const totalAmount =
    typeof quotation.totalAmount === 'object'
      ? quotation.totalAmount.toNumber()
      : Number(quotation.totalAmount)

  const downPayment =
    typeof quotation.downPayment === 'object'
      ? quotation.downPayment.toNumber()
      : Number(quotation.downPayment)

  const remainingBalance =
    typeof quotation.remainingBalance === 'object'
      ? quotation.remainingBalance.toNumber()
      : Number(quotation.remainingBalance)

  const bodyworkItems = (quotation.bodyworkItems || []) as any[]
  const paintItems = (quotation.paintItems || []) as any[]
  const partItems = (quotation.partItems || []) as any[]
  const services = (quotation.services || []) as string[]

  const getServiceLabel = (key: string) => {
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
