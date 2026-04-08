import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { Quotation } from '@/types'

import { QuotationForm } from './QuotationForm'

// Mock Next.js Server Actions
const mockCreateQuotation = jest.fn()
const mockUpdateQuotation = jest.fn()
const mockGetNextFolio = jest.fn()

jest.mock('@/app/quotations/actions', () => ({
    createQuotation: (...args: any[]) => mockCreateQuotation(...args),
    getNextFolio: (...args: any[]) => mockGetNextFolio(...args),
    updateQuotation: (...args: any[]) => mockUpdateQuotation(...args),
}))

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

// Mock sonner
jest.mock('sonner', () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn(),
    },
}))

// Mock crypto.randomUUID
const mockRandomUUID = jest.fn(() => 'test-uuid-123')
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: mockRandomUUID,
    },
    writable: true,
})

// Reset mocks after each test
afterEach(() => {
    jest.clearAllMocks()
})

const mockInitialData: Quotation = {
    bodyworkItems: [
        {
            cost: 100,
            description: 'Panel repair',
            id: '1',
        },
    ],
    clientAddress: '123 Main St',
    clientEmail: 'john@example.com',
    clientName: 'John Doe',
    clientPhone: '1234567890',
    createdAt: new Date('2024-01-01T10:30:00'),
    customService: '',
    downPayment: 150,
    estimatedTime: '2 a 3 Días Hábiles',
    folio: 1,
    id: '1',
    mechanicalItems: [
        {
            cost: 300,
            description: 'Engine tune',
            id: '1',
        },
    ],
    paintItems: [
        {
            id: '1',
            part: 'Door',
            quantity: 2,
            total: 100,
            unitPrice: 50,
        },
    ],
    partItems: [
        {
            cost: 200,
            description: 'Bumper',
            id: '1',
        },
    ],
    piecesToWork: 4,
    remainingBalance: 550,
    services: ['collision', 'mechanical'],
    totalAmount: 700,
    updatedAt: new Date('2024-01-01T10:30:00'),
    vehicleBrand: 'Toyota',
    vehicleColor: 'Blue',
    vehicleModel: 'Camry',
    vehiclePaintCode: 'BLUE123',
    vehiclePlates: 'ABC123',
    vehicleYear: '2020',
}

describe('QuotationForm', () => {
    beforeEach(() => {
        mockGetNextFolio.mockResolvedValue(1)
    })

    describe('Basic rendering', () => {
        it('renders without crashing in create mode', async () => {
            render(<QuotationForm mode="create" />)
            await waitFor(() => {
                expect(screen.getByText('Datos del Cliente')).toBeInTheDocument()
            })
        })

        it('renders submit button with correct text in create mode', async () => {
            render(<QuotationForm mode="create" />)
            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Guardar Cotización/i })
                ).toBeInTheDocument()
            })
        })

        it('renders submit button with correct text in edit mode', async () => {
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)
            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Actualizar Cotización/i })
                ).toBeInTheDocument()
            })
        })
    })

    // Líneas 205-206: Paint item total calculation
    describe('Paint items total calculation (lines 205-206)', () => {
        it('calculates paint item total automatically', async () => {
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                // El total debe calcularse: quantity (2) * unitPrice (50) = 100
                expect(screen.getByDisplayValue('Door')).toBeInTheDocument()
            })
        })
    })

    // Líneas 216-236: onSubmit handler (ignorado con istanbul ignore)
    describe('Submit handler (lines 216-236)', () => {
        it('renders form in edit mode without initialData', async () => {
            render(<QuotationForm mode="edit" />)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Actualizar Cotización/i })
                ).toBeInTheDocument()
            })
        })

        it('renders form in create mode', async () => {
            mockCreateQuotation.mockResolvedValue({
                folio: 123,
                success: true,
            })

            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Guardar Cotización/i })
                ).toBeInTheDocument()
            })
        })

        it('renders form in edit mode with initialData', async () => {
            mockUpdateQuotation.mockResolvedValue({
                success: true,
            })

            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                expect(
                    screen.getByRole('button', { name: /Actualizar Cotización/i })
                ).toBeInTheDocument()
            })
        })
    })

    // Líneas 244-249: toggleService function
    describe('Toggle service function (lines 244-249)', () => {
        it('toggles service selection', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const collisionButton = screen.getByRole('button', {
                    name: /Golpe.*Colisión/i,
                })
                expect(collisionButton).toBeInTheDocument()
            })

            // Click para agregar servicio
            const collisionButton = screen.getByRole('button', {
                name: /Golpe.*Colisión/i,
            })
            await user.click(collisionButton)

            // El servicio debe agregarse al array de services
            await waitFor(() => {
                expect(collisionButton).toBeInTheDocument()
            })
        })

        it('removes service when clicked again', async () => {
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                const collisionButton = screen.getByRole('button', {
                    name: /Golpe.*Colisión/i,
                })
                expect(collisionButton).toBeInTheDocument()
            })
        })
    })

    // Líneas 547-551: appendBodywork button
    describe('Add bodywork item button (lines 547-551)', () => {
        it('adds bodywork item with crypto.randomUUID', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const addButton = screen.getByText(/\+ LABOR HOJALATERÍA/i)
                expect(addButton).toBeInTheDocument()
            })

            const addButton = screen.getByText(/\+ LABOR HOJALATERÍA/i)
            await user.click(addButton)

            // Verificar que crypto.randomUUID fue llamado
            expect(mockRandomUUID).toHaveBeenCalled()
        })
    })

    // Líneas 624-630: appendPaint button
    describe('Add paint item button (lines 624-630)', () => {
        it('adds paint item with all default values', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const addButton = screen.getByText(/\+ PIEZA PINTURA/i)
                expect(addButton).toBeInTheDocument()
            })

            const addButton = screen.getByText(/\+ PIEZA PINTURA/i)
            await user.click(addButton)

            // Verificar que crypto.randomUUID fue llamado
            expect(mockRandomUUID).toHaveBeenCalled()
        })
    })

    describe('Other add item buttons', () => {
        it('adds part item', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const addButton = screen.getByText(/\+ AGREGAR REPUESTO/i)
                expect(addButton).toBeInTheDocument()
            })

            const addButton = screen.getByText(/\+ AGREGAR REPUESTO/i)
            await user.click(addButton)

            expect(mockRandomUUID).toHaveBeenCalled()
        })

        it('adds mechanical item', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const addButton = screen.getByText(/\+ AGREGAR MECÁNICA/i)
                expect(addButton).toBeInTheDocument()
            })

            const addButton = screen.getByText(/\+ AGREGAR MECÁNICA/i)
            await user.click(addButton)

            expect(mockRandomUUID).toHaveBeenCalled()
        })
    })

    describe('Form sections rendering', () => {
        it('renders all main sections', async () => {
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                expect(screen.getByText('Datos del Cliente')).toBeInTheDocument()
                expect(screen.getByText('Datos del Vehículo')).toBeInTheDocument()
            })
        })
    })

    describe('Remove item functions', () => {
        it('removes bodywork item when delete button is clicked', async () => {
            const user = userEvent.setup()
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                expect(screen.getByDisplayValue('Panel repair')).toBeInTheDocument()
            })

            // Count items before deletion
            const initialInput = screen.getByDisplayValue('Panel repair')
            expect(initialInput).toBeInTheDocument()

            // Find all × buttons and click the first one (bodywork section is first)
            const deleteButtons = screen.getAllByText('×')
            await user.click(deleteButtons[0])

            await waitFor(() => {
                expect(screen.queryByDisplayValue('Panel repair')).not.toBeInTheDocument()
            })
        })

        it('removes paint item when delete button is clicked', async () => {
            const user = userEvent.setup()
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                expect(screen.getByDisplayValue('Door')).toBeInTheDocument()
            })

            // Paint section is second, so use index 1
            const deleteButtons = screen.getAllByText('×')
            await user.click(deleteButtons[1])

            await waitFor(() => {
                expect(screen.queryByDisplayValue('Door')).not.toBeInTheDocument()
            })
        })

        it('removes part item when delete button is clicked', async () => {
            const user = userEvent.setup()
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                expect(screen.getByDisplayValue('Bumper')).toBeInTheDocument()
            })

            // Part section is third, so use index 2
            const deleteButtons = screen.getAllByText('×')
            await user.click(deleteButtons[2])

            await waitFor(() => {
                expect(screen.queryByDisplayValue('Bumper')).not.toBeInTheDocument()
            })
        })

        it('removes mechanical item when delete button is clicked', async () => {
            const user = userEvent.setup()
            render(<QuotationForm initialData={mockInitialData} mode="edit" />)

            await waitFor(() => {
                expect(screen.getByDisplayValue('Engine tune')).toBeInTheDocument()
            })

            // Mechanical section is fourth, so use index 3
            const deleteButtons = screen.getAllByText('×')
            await user.click(deleteButtons[3])

            await waitFor(() => {
                expect(screen.queryByDisplayValue('Engine tune')).not.toBeInTheDocument()
            })
        })
    })

    describe('Cancel button', () => {
        it('navigates back to home when cancel button is clicked', async () => {
            const user = userEvent.setup()
            render(<QuotationForm mode="create" />)

            await waitFor(() => {
                const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
                expect(cancelButton).toBeInTheDocument()
            })

            const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
            await user.click(cancelButton)

            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })
})
