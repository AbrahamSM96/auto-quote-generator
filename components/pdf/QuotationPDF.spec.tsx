import { render, screen } from '@testing-library/react'

import { formatCurrency, formatDate, formatTime, padFolio } from '@/lib/utils'

import type { Quotation } from '../../types'

import { QuotationPDF } from './QuotationPDF'

// Mock @react-pdf/renderer
jest.mock('@react-pdf/renderer', () => ({
    Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
    Page: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-page">{children}</div>,
    StyleSheet: {
        create: (styles: any) => styles,
    },
    Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
    View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock the utils
jest.mock('@/lib/utils', () => ({
    formatCurrency: jest.fn((value: number) => `$${value.toFixed(2)}`),
    formatDate: jest.fn(() => '01/04/2026'),
    formatTime: jest.fn(() => '10:30 AM'),
    padFolio: jest.fn((folio: number) => String(folio).padStart(3, '0')),
}))

// Mock constants
jest.mock('@/lib/constants', () => ({
    SERVICES: [
        { key: 'bodywork', label: 'Hojalatería' },
        { key: 'mechanics', label: 'Mecánica' },
        { key: 'paint', label: 'Pintura' },
    ],
}))

// Mock workshop config
jest.mock('@/config/workshop', () => ({
    workshopConfig: {
        address: '123 Test St',
        email: 'test@workshop.com',
        manager: 'Test Manager',
        name: 'Test Workshop',
        phone: '555-1234',
        subtitle: 'Auto Repair',
    },
}))

describe('QuotationPDF', () => {
    const mockQuotation: any = {
        bodyworkItems: [],
        clientAddress: '456 Client St',
        clientEmail: 'john@example.com',
        clientName: 'John Doe',
        clientPhone: '555-5678',
        createdAt: new Date('2026-04-01'),
        downPayment: 1000,
        folio: 123,
        id: 'test-id',
        paintItems: [],
        partItems: [],
        remainingBalance: 4000,
        services: ['bodywork', 'paint'],
        totalAmount: 5000,
        updatedAt: new Date('2026-04-01'),
        vehicleBrand: 'Toyota',
        vehicleColor: 'Blue',
        vehicleModel: 'Corolla',
        vehiclePlates: 'ABC-123',
        vehicleYear: '2020',
    }

    it('renders PDF document without errors', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument()
    })

    it('renders workshop information', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.getByText('Test Workshop')).toBeInTheDocument()
        expect(screen.getByText('Auto Repair')).toBeInTheDocument()
        expect(screen.getByText('Test Manager')).toBeInTheDocument()
    })

    it('renders client information', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.getByText('John Doe')).toBeInTheDocument()
        expect(screen.getByText('555-5678')).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })

    it('renders vehicle information', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.getByText('Toyota')).toBeInTheDocument()
        expect(screen.getByText(/Corolla 2020/)).toBeInTheDocument()
        expect(screen.getByText('Blue')).toBeInTheDocument()
        expect(screen.getByText('ABC-123')).toBeInTheDocument()
    })

    it('renders services', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.getByText('Hojalatería')).toBeInTheDocument()
        expect(screen.getByText('Pintura')).toBeInTheDocument()
    })

    it('renders with bodywork items', () => {
        const quotationWithBodywork: Quotation = {
            ...mockQuotation,
            bodyworkItems: [
                {
                    cost: 300, description: 'Repair door',
                    id: ''
                },
                {
                    cost: 500, description: 'Fix front bumper',
                    id: ''
                },
            ],
        }

        render(<QuotationPDF quotation={quotationWithBodywork} />)
        expect(screen.getByText('Fix front bumper')).toBeInTheDocument()
        expect(screen.getByText('Repair door')).toBeInTheDocument()
    })

    it('does not render bodywork section when empty', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        const bodyworkHeaders = screen.queryAllByText('HOJALATERÍA')
        // Should not have a bodywork section header
        expect(bodyworkHeaders.length).toBe(0)
    })

    it('renders with paint items', () => {
        const quotationWithPaint: Quotation = {
            ...mockQuotation,
            paintItems: [
                {
                    id: '',
                    part: 'Front door', quantity: 2, total: 400, unitPrice: 200,
                },
                {
                    id: '',
                    part: 'Hood', quantity: 1, total: 300, unitPrice: 300,
                },
            ],
        }

        render(<QuotationPDF quotation={quotationWithPaint} />)
        expect(screen.getByText(/Front door/)).toBeInTheDocument()
        expect(screen.getByText(/Hood/)).toBeInTheDocument()
    })

    it('renders with part items', () => {
        const quotationWithParts: Quotation = {
            ...mockQuotation,
            partItems: [
                {
                    cost: 75, description: 'Mirror',
                    id: ''
                },
                {
                    cost: 150, description: 'Headlight assembly',
                    id: ''
                },
            ],
        }

        render(<QuotationPDF quotation={quotationWithParts} />)
        expect(screen.getByText('Headlight assembly')).toBeInTheDocument()
        expect(screen.getByText('Mirror')).toBeInTheDocument()
    })

    it('renders with custom service', () => {
        const quotationWithCustomService: Quotation = {
            ...mockQuotation,
            customService: 'Custom paint job with metallic finish',
        }

        render(<QuotationPDF quotation={quotationWithCustomService} />)
        expect(screen.getByText('Custom paint job with metallic finish')).toBeInTheDocument()
    })

    it('does not render custom service section when null', () => {
        render(<QuotationPDF quotation={mockQuotation} />)
        expect(screen.queryByText('Servicio Personalizado')).not.toBeInTheDocument()
    })

    it('renders with all items types', () => {
        const quotationWithAllItems: Quotation = {
            ...mockQuotation,
            bodyworkItems: [{
                cost: 500, description: 'Fix bumper',
                id: ''
            }],
            customService: 'Special service',
            paintItems: [{
                id: '',
                part: 'Door', quantity: 1, total: 200, unitPrice: 200,
            }],
            partItems: [{
                cost: 150, description: 'Headlight',
                id: ''
            }],
        }

        render(<QuotationPDF quotation={quotationWithAllItems} />)
        expect(screen.getByText('Fix bumper')).toBeInTheDocument()
        expect(screen.getByText(/Door/)).toBeInTheDocument()
        expect(screen.getByText('Headlight')).toBeInTheDocument()
        expect(screen.getByText('Special service')).toBeInTheDocument()
    })

    it('handles empty services array', () => {
        const quotationWithoutServices: Quotation = {
            ...mockQuotation,
            services: [],
        }

        render(<QuotationPDF quotation={quotationWithoutServices} />)
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument()
    })

    it('handles unknown service key', () => {
        const quotationWithUnknownService: Quotation = {
            ...mockQuotation,
            services: ['unknown-service'],
        }

        render(<QuotationPDF quotation={quotationWithUnknownService} />)
        expect(screen.getByText('unknown-service')).toBeInTheDocument()
    })

    it('renders totals correctly', () => {
        const quotationWithTotals: Quotation = {
            ...mockQuotation,
            downPayment: 3000,
            remainingBalance: 7000,
            totalAmount: 10000,
        }

        render(<QuotationPDF quotation={quotationWithTotals} />)
        expect(screen.getByText('$10000.00')).toBeInTheDocument()
        expect(screen.getByText('$3000.00')).toBeInTheDocument()
        expect(screen.getByText('$7000.00')).toBeInTheDocument()
    })

    it('calls formatting utilities correctly', () => {

        render(<QuotationPDF quotation={mockQuotation} />)

        expect(padFolio).toHaveBeenCalledWith(123)
        expect(formatDate).toHaveBeenCalled()
        expect(formatTime).toHaveBeenCalled()
        expect(formatCurrency).toHaveBeenCalled()
    })

    it('handles null/undefined arrays in quotation', () => {
        const quotationWithNullArrays: Quotation = {
            ...mockQuotation,
            bodyworkItems: null as any,
            paintItems: undefined as any,
            partItems: null as any,
            services: undefined as any,
        }

        render(<QuotationPDF quotation={quotationWithNullArrays} />)
        expect(screen.getByTestId('pdf-document')).toBeInTheDocument()
    })
})
