import { render } from '@testing-library/react';

import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(
            <ConfirmModal
                isOpen
                message="Test Message"
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                title="Test Title"
            />
        );
        const titleElement = getByText('Test Title');
        expect(titleElement).toBeInTheDocument();
    })

    it('renders title and message correctly', () => {
        const title = 'Confirm Action';
        const message = 'Are you sure you want to proceed?';
        const { getByText } = render(
            <ConfirmModal
                isOpen
                message={message}
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                title={title}
            />
        );
        const titleElement = getByText(title);
        const messageElement = getByText(message);
        expect(titleElement).toBeInTheDocument();
        expect(messageElement).toBeInTheDocument();
    })

    it('should render correctly with primary variant', () => {
        const { getByText } = render(
            <ConfirmModal
                confirmVariant="primary"
                isOpen
                message="Are you sure?"
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                title="Confirm Action"
            />
        );
        const confirmButton = getByText('Confirmar');
        expect(confirmButton).toBeInTheDocument();
    })

    it('should render correctly with danger variant', () => {
        const { getByText } = render(
            <ConfirmModal
                confirmVariant="danger"
                isOpen
                message="Are you sure?"
                onClose={jest.fn()}
                onConfirm={jest.fn()}
                title="Confirm Action"
            />
        );
        const confirmButton = getByText('Confirmar');
        expect(confirmButton).toBeInTheDocument();
    })

    it('should call onConfirm and onClose when confirm button is clicked', () => {
        const onConfirmMock = jest.fn();
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <ConfirmModal
                confirmVariant="primary"
                isOpen
                message="Are you sure?"
                onClose={onCloseMock}
                onConfirm={onConfirmMock}
                title="Confirm Action"
            />
        );
        const confirmButton = getByText('Confirmar');
        confirmButton.click();
        expect(onConfirmMock).toHaveBeenCalled();
        expect(onCloseMock).toHaveBeenCalled();
    })

    it('should call onClose when cancel button is clicked', () => {
        const onCloseMock = jest.fn();
        const { getByText } = render(
            <ConfirmModal
                isOpen
                message="Are you sure?"
                onClose={onCloseMock}
                onConfirm={jest.fn()}
                title="Confirm Action"
            />
        );
        const cancelButton = getByText('Cancelar');
        cancelButton.click();
        expect(onCloseMock).toHaveBeenCalled();
    })
})
