import { render, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

import * as quotationActions from '@/app/quotations/actions'

import { QuotationList } from './QuotationList'

// Mock dependencies
jest.mock('next/navigation')
jest.mock('sonner')
jest.mock('@/app/quotations/actions')

const mockPush = jest.fn()
const mockRefresh = jest.fn()

describe('QuotationList component', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({
                push: mockPush,
                refresh: mockRefresh,
            })
    })

    const mockQuotations = [
        {
            clientName: 'Bob Johnson',
            createdAt: '2024-01-03T00:00:00Z',
            folio: 3,
            id: '3',
            totalAmount: 5000.00,
            vehicleBrand: 'Ford',
            vehicleModel: 'Mustang',
        },
        {
            clientName: 'Jane Smith',
            createdAt: '2024-01-02T00:00:00Z',
            folio: 2,
            id: '2',
            totalAmount: 2500.00,
            vehicleBrand: 'Honda',
            vehicleModel: 'Civic',
        },
        {
            clientName: 'John Doe',
            createdAt: '2024-01-01T00:00:00Z',
            folio: 1,
            id: '1',
            totalAmount: 1234.56,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        },
    ]

    it('renders empty state correctly', () => {
        const { getByText } = render(<QuotationList quotations={[]} />)
        expect(getByText(/No hay cotizaciones/i)).toBeInTheDocument()
        expect(getByText(/Nueva Cotización/i)).toBeInTheDocument()
    })

    it('renders quotation items correctly', () => {
        const { getByText } = render(<QuotationList quotations={mockQuotations} />)
        expect(getByText(/John Doe/i)).toBeInTheDocument()
        expect(getByText(/Jane Smith/i)).toBeInTheDocument()
        expect(getByText(/Bob Johnson/i)).toBeInTheDocument()
    })

    it('renders total amount formatted as currency', () => {
        const { getByText } = render(<QuotationList quotations={mockQuotations} />)
        expect(getByText('$1,234.56')).toBeInTheDocument()
        expect(getByText('$2,500.00')).toBeInTheDocument()
    })

    it('filters quotations by client name', async () => {
        const user = userEvent.setup()
        const { getByPlaceholderText, getByText, queryByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const searchInput = getByPlaceholderText(/Buscar por cliente/i)
        await user.type(searchInput, 'John')

        expect(getByText(/John Doe/i)).toBeInTheDocument()
        expect(queryByText(/Jane Smith/i)).not.toBeInTheDocument()
    })

    it('filters quotations by vehicle brand', async () => {
        const user = userEvent.setup()
        const { getByPlaceholderText, getByText, queryByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const searchInput = getByPlaceholderText(/Buscar por cliente/i)
        await user.type(searchInput, 'Honda')

        expect(getByText(/Jane Smith/i)).toBeInTheDocument()
        expect(queryByText(/John Doe/i)).not.toBeInTheDocument()
    })

    it('filters quotations by folio', async () => {
        const user = userEvent.setup()
        const { getByPlaceholderText, getByText, queryByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const searchInput = getByPlaceholderText(/Buscar por cliente/i)
        await user.type(searchInput, '001')

        expect(getByText(/John Doe/i)).toBeInTheDocument()
        expect(queryByText(/Jane Smith/i)).not.toBeInTheDocument()
    })

    it('resets to first page when search term changes', async () => {
        const user = userEvent.setup()
        const manyQuotations = Array.from({ length: 25 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { getByPlaceholderText, getByRole } = render(
            <QuotationList quotations={manyQuotations} />
        )

        const searchInput = getByPlaceholderText(/Buscar por cliente/i)

        // Go to page 2
        await user.click(getByRole('button', { name: '2' }))

        // Search - should reset to page 1
        await user.type(searchInput, 'Client 1')

        // Verify we're back on page 1
        const pageButton = getByRole('button', { name: '1' })
        expect(pageButton).toHaveClass('bg-primary')
    })

    it('paginates quotations correctly', () => {
        const manyQuotations = Array.from({ length: 15 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { container, queryByText } = render(
            <QuotationList quotations={manyQuotations} />
        )

        // Page 1 should show Client 1-10
        const tbody = container.querySelector('tbody')
        expect(tbody?.textContent).toContain('Client 1')
        expect(queryByText(/Client 11/i)).not.toBeInTheDocument()
    })

    it('navigates to next page', async () => {
        const user = userEvent.setup()
        const manyQuotations = Array.from({ length: 15 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { container, getByRole, queryByText } = render(
            <QuotationList quotations={manyQuotations} />
        )

        const nextButton = getByRole('button', { name: '›' })
        await user.click(nextButton)

        const tbody = container.querySelector('tbody')
        expect(tbody?.textContent).not.toContain('Client 10')
        expect(queryByText(/Client 11/i)).toBeInTheDocument()
    })

    it('navigates to previous page', async () => {
        const user = userEvent.setup()
        const manyQuotations = Array.from({ length: 15 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { container, getByRole, queryByText } = render(
            <QuotationList quotations={manyQuotations} />
        )

        // Go to page 2
        await user.click(getByRole('button', { name: '2' }))
        expect(queryByText(/Client 11/i)).toBeInTheDocument()

        // Go back to page 1
        const prevButton = getByRole('button', { name: '‹' })
        await user.click(prevButton)
        const tbody = container.querySelector('tbody')
        expect(tbody?.textContent).toContain('Client 1')
        expect(queryByText(/Client 11/i)).not.toBeInTheDocument()
    })

    it('navigates to first and last page', async () => {
        const user = userEvent.setup()
        const manyQuotations = Array.from({ length: 25 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { container, getByRole, queryByText } = render(
            <QuotationList quotations={manyQuotations} />
        )

        // Go to last page
        const lastButton = getByRole('button', { name: '»»' })
        await user.click(lastButton)
        expect(queryByText(/Client 21/i)).toBeInTheDocument()

        // Go back to first page
        const firstButton = getByRole('button', { name: '««' })
        await user.click(firstButton)
        const tbody = container.querySelector('tbody')
        expect(tbody?.textContent).toContain('Client 1')
    })

    it('disables pagination buttons appropriately', () => {
        const manyQuotations = Array.from({ length: 15 }, (_, i) => ({
            clientName: `Client ${i + 1}`,
            createdAt: '2024-01-01T00:00:00Z',
            folio: i + 1,
            id: String(i + 1),
            totalAmount: 1000,
            vehicleBrand: 'Toyota',
            vehicleModel: 'Corolla',
        }))

        const { getByRole } = render(
            <QuotationList quotations={manyQuotations} />
        )

        // First page buttons should be disabled
        const firstButton = getByRole('button', { name: '««' })
        const prevButton = getByRole('button', { name: '‹' })
        expect(firstButton).toBeDisabled()
        expect(prevButton).toBeDisabled()
    })

    it('opens delete confirmation modal', async () => {
        const user = userEvent.setup()
        const { getAllByRole, getByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        // Find and click delete button for first item
        const deleteButtons = getAllByRole('button', { name: '🗑️' })
        await user.click(deleteButtons[0])

        expect(getByText(/¿Eliminar Cotización?/i)).toBeInTheDocument()
    })

    it('deletes quotation when confirmed', async () => {
        const user = userEvent.setup()
            ; (quotationActions.deleteQuotation as jest.Mock).mockResolvedValueOnce({
                success: true,
            })

        const { getAllByRole, getByRole } = render(
            <QuotationList quotations={mockQuotations} />
        )

        // Open delete modal
        const deleteButtons = getAllByRole('button', { name: '🗑️' })
        await user.click(deleteButtons[0])

        // Confirm deletion
        const confirmButton = getByRole('button', { name: /Eliminar/i })
        await user.click(confirmButton)

        await waitFor(() => {
            expect(quotationActions.deleteQuotation).toHaveBeenCalledWith('3')
            expect(toast.success).toHaveBeenCalledWith('Cotización eliminada exitosamente')
            expect(mockRefresh).toHaveBeenCalled()
        })
    })

    it('shows error when deletion fails', async () => {
        const user = userEvent.setup()
            ; (quotationActions.deleteQuotation as jest.Mock).mockResolvedValueOnce({
                error: 'Error deleting quotation',
                success: false,
            })

        const { getAllByRole, getByRole } = render(
            <QuotationList quotations={mockQuotations} />
        )

        // Open delete modal
        const deleteButtons = getAllByRole('button', { name: '🗑️' })
        await user.click(deleteButtons[0])

        // Confirm deletion
        const confirmButton = getByRole('button', { name: /Eliminar/i })
        await user.click(confirmButton)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error deleting quotation')
        })
    })

    // Note: Line 203 (router.push on row click) is difficult to test in isolation because
    // it requires clicking on the row element itself, but the row's action cells have
    // stopPropagation() which prevents proper event bubbling. Testing this would require
    // modifying the component structure. The individual button clicks (edit, view buttons)
    // are tested separately and cover the router.push calls.
    it('navigates to quotation view on row click', async () => {
        const user = userEvent.setup()
        const { getByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        // Click on the client name cell (which is part of the row but doesn't have stop propagation)
        const clientCell = getByText('John Doe')
        await user.click(clientCell)

        expect(mockPush).toHaveBeenCalledWith('/quotations/1')
    })

    it('navigates to edit page on edit button click', async () => {
        const user = userEvent.setup()
        const { getAllByRole } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const editButtons = getAllByRole('button', { name: '✏️' })
        await user.click(editButtons[0])

        expect(mockPush).toHaveBeenCalledWith('/quotations/3/edit')
    })

    it('opens PDF in new window', async () => {
        const user = userEvent.setup()
        const windowOpenSpy = jest.spyOn(window, 'open').mockReturnValueOnce(null)

        const { getAllByRole } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const pdfButtons = getAllByRole('button', { name: '📄' })
        await user.click(pdfButtons[0])

        expect(windowOpenSpy).toHaveBeenCalledWith(
            '/api/quotations/3/pdf',
            '_blank'
        )
        windowOpenSpy.mockRestore()
    })

    it('shows no results message when search returns empty', async () => {
        const user = userEvent.setup()
        const { getByPlaceholderText, getByText } = render(
            <QuotationList quotations={mockQuotations} />
        )

        const searchInput = getByPlaceholderText(/Buscar por cliente/i)
        await user.type(searchInput, 'NonexistentClient')

        expect(getByText(/No se encontraron resultados/i)).toBeInTheDocument()
    })

    it('displays pagination info correctly', () => {
        const { getByText } = render(<QuotationList quotations={mockQuotations} />)

        expect(getByText(/Mostrando/i)).toBeInTheDocument()
        const paginationText = getByText(/Mostrando/)
        expect(paginationText.textContent).toContain('1')
        expect(paginationText.textContent).toContain('3')
    })

    it('handles Decimal totalAmount correctly', () => {
        const quotationsWithDecimal = [
            {
                clientName: 'John Doe',
                createdAt: '2024-01-01T00:00:00Z',
                folio: 1,
                id: '1',
                totalAmount: {
                    toNumber: () => 1234.56,
                },
                vehicleBrand: 'Toyota',
                vehicleModel: 'Corolla',
            },
        ]

        const { getByText } = render(
            <QuotationList quotations={quotationsWithDecimal} />
        )
        expect(getByText('$1,234.56')).toBeInTheDocument()
    })

    it('navigates to quotation detail when view button is clicked', async () => {
        const user = userEvent.setup()

        const { getAllByTitle } = render(
            <QuotationList quotations={mockQuotations} />
        )

        await waitFor(() => {
            expect(getAllByTitle('Ver')[0]).toBeInTheDocument()
        })

        // Click on the first "Ver" button
        const viewButtons = getAllByTitle('Ver')
        await user.click(viewButtons[0])

        expect(mockPush).toHaveBeenCalledWith('/quotations/3')
    })
})
