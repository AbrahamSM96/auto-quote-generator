import { render } from '@testing-library/react';

import { Input } from './Input';

describe('Input component', () => {
    it('renders without crashing', () => {
        const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);
        const inputElement = getByPlaceholderText('Enter text');
        expect(inputElement).toBeInTheDocument();
    })

    it('displays the label when provided', () => {
        const { getByText } = render(<Input label="Username" />);
        const labelElement = getByText('Username');
        expect(labelElement).toBeInTheDocument();
    })

    it('displays the error message when provided', () => {
        const { getByText } = render(<Input error="This field is required" />);
        const errorElement = getByText('This field is required');
        expect(errorElement).toBeInTheDocument();
    })

    it('applies input with icon when provided', () => {
        const { container } = render(<Input icon={<span>🔍</span>} />);
        const iconElement = container.querySelector('span');
        expect(iconElement).toBeInTheDocument();
        expect(iconElement).toHaveTextContent('🔍');
    })
})
