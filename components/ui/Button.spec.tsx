import { render } from '@testing-library/react';

import { Button } from './Button';

describe('Button component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<Button>Click me</Button>);
        const buttonElement = getByText('Click me');
        expect(buttonElement).toBeInTheDocument();
    })

    it('applies the correct outline variant and size classes', () => {
        const { getByText } = render(<Button size="lg" variant="outline">Click me</Button>);
        const buttonElement = getByText('Click me');
        expect(buttonElement).toHaveClass('bg-transparent text-text-primary border-2 border-dark-border hover:border-primary hover:bg-primary/5');
        expect(buttonElement).toHaveClass('px-6 py-3.5 text-lg');
    })

    it('disables the button when loading is true', () => {
        const { getByText } = render(<Button loading>Click me</Button>);
        const buttonElement = getByText('Click me');
        expect(buttonElement).toBeDisabled();
    })

    it('applies the coorrect classes for the danger variant', () => {
        const { getByText } = render(<Button variant="danger">Click me</Button>);
        const buttonElement = getByText('Click me');
        expect(buttonElement).toHaveClass('bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]');
    })

    it('applies the correct classes for the ghost variant', () => {
        const { getByText } = render(<Button variant="ghost">Click me</Button>);
        const buttonElement = getByText('Click me');
        expect(buttonElement).toHaveClass('bg-transparent text-text-secondary hover:bg-dark-elevated hover:text-text-primary');
    })
})
