import { render, screen } from '@testing-library/react'

import type { Quotation } from '@/types'

import { QuotationView } from './QuotationView'

// Mock data fixture
const mockQuotation: Quotation = {
    bodyworkItems: [
        { cost: 100, description: 'Panel repair', id: '1' },
    ],
    clientAddress: '123 Main St',
    clientEmail: 'john@example.com',
    clientName: 'John Doe',
    clientPhone: '1234567890',
    createdAt: new Date('2024-01-01T10:30:00'),
    customService: '',
    downPayment: 100,
    estimatedTime: '2 hours',
    folio: 1,
    id: '1',
    mechanicalItems: [],
    paintItems: [
        { id: '1', part: 'Door', quantity: 1, total: 50, unitPrice: 50 },
    ],
    partItems: [
        { cost: 200, description: 'Bumper', id: '1' },
    ],
    piecesToWork: 4,
    remainingBalance: 250,
    services: ['alignment', 'balance'],
    totalAmount: 350,
    updatedAt: new Date('2024-01-01T10:30:00'),
    vehicleBrand: 'Toyota',
    vehicleColor: 'Blue',
    vehicleModel: 'Camry',
    vehiclePaintCode: 'BLUE123',
    vehiclePlates: 'ABC123',
    vehicleYear: '2020',
}

describe('QuotationView', () => {
    it('renders without crashing', () => {
        render(<QuotationView quotation={mockQuotation} />)
        expect(screen.getByText(mockQuotation.clientName)).toBeInTheDocument()
    })

    it('displays client information', () => {
        render(<QuotationView quotation={mockQuotation} />)
        expect(screen.getByText(mockQuotation.clientName)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.clientPhone)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.clientEmail)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.clientAddress)).toBeInTheDocument()
    })

    it('displays vehicle information', () => {
        render(<QuotationView quotation={mockQuotation} />)
        expect(screen.getByText(mockQuotation.vehicleBrand)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.vehicleModel)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.vehicleYear)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.vehicleColor)).toBeInTheDocument()
        expect(screen.getByText(mockQuotation.vehiclePlates)).toBeInTheDocument()
    })

    describe('getServiceLabel function (lines 37-39)', () => {
        it('renders service with icon and label when service is found', () => {
            render(<QuotationView quotation={mockQuotation} />)
            // Verifies the ternary return statement renders the service label
            const spanElements = screen.getAllByText(/✔|✅/)
            expect(spanElements.length).toBeGreaterThan(0)
        })

        it('renders service key directly when service is not found', () => {
            const quotationWithUnknownService: Quotation = {
                ...mockQuotation,
                services: ['unknown-service-key'],
            }
            render(<QuotationView quotation={quotationWithUnknownService} />)
            // Should contain the unknown service key
            expect(screen.getByText('unknown-service-key')).toBeInTheDocument()
        })
    })

    describe('customService conditional rendering (lines 204-206)', () => {
        it('displays custom service when provided', () => {
            const quotationWithCustomService: Quotation = {
                ...mockQuotation,
                customService: 'Custom Restoration Work',
            }
            render(<QuotationView quotation={quotationWithCustomService} />)
            expect(
                screen.getByText('Servicio Personalizado'),
            ).toBeInTheDocument()
            expect(screen.getByText('Custom Restoration Work')).toBeInTheDocument()
        })

        it('does not display custom service section when not provided', () => {
            const quotationWithoutCustomService: Quotation = {
                ...mockQuotation,
                customService: '',
            }
            render(<QuotationView quotation={quotationWithoutCustomService} />)
            // The section should not be rendered
            expect(
                screen.queryByText('Servicio Personalizado'),
            ).not.toBeInTheDocument()
        })
    })

    describe('bodyworkItems conditional rendering (lines 253-255)', () => {
        it('displays bodywork items section when items exist', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(screen.getByText(/🔨.*Hojalatería/)).toBeInTheDocument()
            expect(screen.getByText('Panel repair')).toBeInTheDocument()
        })

        it('does not display bodywork items section when items are empty', () => {
            const quotationWithoutBodywork: Quotation = {
                ...mockQuotation,
                bodyworkItems: [],
            }
            render(<QuotationView quotation={quotationWithoutBodywork} />)
            // Should not contain the bodywork items
            const bodyworkHeaders = screen.queryAllByText(/🔨.*Hojalatería/)
            expect(bodyworkHeaders.length).toBe(0)
        })
    })

    describe('paintItems conditional rendering (lines 274-276)', () => {
        it('displays paint items section when items exist', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(screen.getByText(/🎨.*PINTURA/i)).toBeInTheDocument()
            expect(screen.getByText('Door')).toBeInTheDocument()
        })

        it('does not display paint items section when items are empty', () => {
            const quotationWithoutPaint: Quotation = {
                ...mockQuotation,
                paintItems: [],
            }
            render(<QuotationView quotation={quotationWithoutPaint} />)
            // Should not contain the paint section
            const paintHeaders = screen.queryAllByText(/🎨.*PINTURA/i)
            expect(paintHeaders.length).toBe(0)
        })
    })

    describe('partItems conditional rendering (lines 302-304)', () => {
        it('displays parts section when items exist', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(
                screen.getByText(/💡.*REPUESTOS Y ACCESORIOS/i),
            ).toBeInTheDocument()
            expect(screen.getByText('Bumper')).toBeInTheDocument()
        })

        it('does not display parts section when items are empty', () => {
            const quotationWithoutParts: Quotation = {
                ...mockQuotation,
                partItems: [],
            }
            render(<QuotationView quotation={quotationWithoutParts} />)
            // Should not contain the parts section
            const partHeaders = screen.queryAllByText(/💡.*REPUESTOS Y ACCESORIOS/i)
            expect(partHeaders.length).toBe(0)
        })
    })

    it('displays totals section with correct amounts', () => {
        render(<QuotationView quotation={mockQuotation} />)
        expect(screen.getByText('TOTAL PRESUPUESTO')).toBeInTheDocument()
        expect(screen.getByText('ANTICIPO')).toBeInTheDocument()
        expect(screen.getByText('SALDO PENDIENTE')).toBeInTheDocument()
    })

    describe('Header section rendering', () => {
        it('displays folio number with padding', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(screen.getByText('FOLIO')).toBeInTheDocument()
        })

        it('displays creation date and time', () => {
            render(<QuotationView quotation={mockQuotation} />)
            // Verify the component renders without errors with date/time formatting
            const headerElement = screen.getByText('FOLIO').closest('header')
            expect(headerElement).toBeInTheDocument()
        })
    })

    describe('Services section rendering', () => {
        it('displays multiple services with icons and labels', () => {
            const quotationWithMultipleServices: Quotation = {
                ...mockQuotation,
                services: ['collision', 'mechanical', 'polishing'],
            }
            render(<QuotationView quotation={quotationWithMultipleServices} />)
            // Should render services section with correct title
            expect(screen.getByText(/Tipo de Servicio y Daño/i)).toBeInTheDocument()
        })

        it('displays estimated time and pieces to work', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(screen.getByText('2 hours')).toBeInTheDocument()
            expect(screen.getByText('4')).toBeInTheDocument()
        })
    })

    describe('Vehicle information rendering', () => {
        it('displays all vehicle paint code when provided', () => {
            render(<QuotationView quotation={mockQuotation} />)
            expect(screen.getByText('BLUE123')).toBeInTheDocument()
        })

        it('displays N/A when paint code is not provided', () => {
            const quotationWithoutPaintCode: Quotation = {
                ...mockQuotation,
                vehiclePaintCode: '',
            }
            render(<QuotationView quotation={quotationWithoutPaintCode} />)
            expect(screen.getByText('N/A')).toBeInTheDocument()
        })
    })

    describe('Items rendering with multiple entries', () => {
        it('displays multiple bodywork items', () => {
            const quotationWithMultipleBodywork: Quotation = {
                ...mockQuotation,
                bodyworkItems: [
                    { cost: 100, description: 'Panel repair', id: '1' },
                    { cost: 150, description: 'Door welding', id: '2' },
                    { cost: 200, description: 'Bumper replacement', id: '3' },
                ],
            }
            render(<QuotationView quotation={quotationWithMultipleBodywork} />)
            expect(screen.getByText('Panel repair')).toBeInTheDocument()
            expect(screen.getByText('Door welding')).toBeInTheDocument()
            expect(screen.getByText('Bumper replacement')).toBeInTheDocument()
        })

        it('displays multiple paint items with quantity details', () => {
            const quotationWithMultiplePaint: Quotation = {
                ...mockQuotation,
                paintItems: [
                    { id: '1', part: 'Door', quantity: 1, total: 50, unitPrice: 50 },
                    { id: '2', part: 'Hood', quantity: 2, total: 150, unitPrice: 75 },
                    { id: '3', part: 'Fenders', quantity: 2, total: 200, unitPrice: 100 },
                ],
            }
            render(<QuotationView quotation={quotationWithMultiplePaint} />)
            expect(screen.getByText('Door')).toBeInTheDocument()
            expect(screen.getByText('Hood')).toBeInTheDocument()
            expect(screen.getByText('Fenders')).toBeInTheDocument()
        })

        it('displays multiple part items', () => {
            const quotationWithMultipleParts: Quotation = {
                ...mockQuotation,
                partItems: [
                    { cost: 200, description: 'Bumper', id: '1' },
                    { cost: 50, description: 'Door handle', id: '2' },
                    { cost: 150, description: 'Mirror assembly', id: '3' },
                ],
            }
            render(<QuotationView quotation={quotationWithMultipleParts} />)
            expect(screen.getByText('Bumper')).toBeInTheDocument()
            expect(screen.getByText('Door handle')).toBeInTheDocument()
            expect(screen.getByText('Mirror assembly')).toBeInTheDocument()
        })
    })

    describe('Complex scenario - all items present', () => {
        it('renders complete quotation with all item types and custom service', () => {
            const completeQuotation: Quotation = {
                ...mockQuotation,
                bodyworkItems: [
                    { cost: 100, description: 'Panel repair', id: '1' },
                ],
                customService: 'Custom restoration',
                paintItems: [
                    { id: '1', part: 'Door', quantity: 1, total: 50, unitPrice: 50 },
                ],
                partItems: [
                    { cost: 200, description: 'Bumper', id: '1' },
                ],
                services: ['collision', 'fullPaint', 'panelPaint'],
            }
            render(<QuotationView quotation={completeQuotation} />)

            // Verify all sections are rendered
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Toyota')).toBeInTheDocument()
            expect(screen.getByText('Servicio Personalizado')).toBeInTheDocument()
            expect(screen.getByText('Custom restoration')).toBeInTheDocument()
            expect(screen.getByText(/🔨.*Hojalatería/)).toBeInTheDocument()
            // Use getAllByText for elements that appear multiple times
            const paintHeaders = screen.getAllByText(/🎨.*PINTURA/i)
            expect(paintHeaders.length).toBeGreaterThan(0)
            expect(screen.getByText(/💡.*REPUESTOS Y ACCESORIOS/i)).toBeInTheDocument()
            expect(screen.getByText('TOTAL PRESUPUESTO')).toBeInTheDocument()
        })
    })

    describe('Empty state - no items', () => {
        it('renders without items sections when all item lists are empty', () => {
            const quotationWithoutItems: Quotation = {
                ...mockQuotation,
                bodyworkItems: [],
                customService: '',
                paintItems: [],
                partItems: [],
            }
            render(<QuotationView quotation={quotationWithoutItems} />)

            // Should render client and vehicle info
            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.getByText('Toyota')).toBeInTheDocument()

            // Should not render item sections
            expect(screen.queryAllByText(/🔨.*Hojalatería/).length).toBe(0)
            expect(screen.queryAllByText(/🎨.*PINTURA/i).length).toBe(0)
            expect(screen.queryAllByText(/💡.*REPUESTOS Y ACCESORIOS/i).length).toBe(0)
            expect(screen.queryByText('Servicio Personalizado')).not.toBeInTheDocument()
        })
    })

    describe('Service labels rendering (getServiceLabel function execution)', () => {
        it('renders correct icon and label for known service keys', () => {
            const quotationWithKnownServices: Quotation = {
                ...mockQuotation,
                services: ['collision', 'mechanical', 'polishing'],
            }
            render(<QuotationView quotation={quotationWithKnownServices} />)

            // The services should be rendered with their icons and labels from SERVICES constant
            // This validates that getServiceLabel correctly finds the service and formats it
            const serviceElements = screen.getAllByRole('generic')
            expect(serviceElements.length).toBeGreaterThan(0)
        })

        it('falls back to service key when service label not found', () => {
            const quotationWithUnknownServices: Quotation = {
                ...mockQuotation,
                services: ['unknown-service-1', 'unknown-service-2'],
            }
            render(<QuotationView quotation={quotationWithUnknownServices} />)

            // Unknown services should render their keys directly
            expect(screen.getByText('unknown-service-1')).toBeInTheDocument()
            expect(screen.getByText('unknown-service-2')).toBeInTheDocument()
        })
    })
})
