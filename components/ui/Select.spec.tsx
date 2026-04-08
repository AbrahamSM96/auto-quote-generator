import { render } from '@testing-library/react';

import { Select } from './Select';


describe('Select component', () => {
    const options = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    it('renders without crashing', () => {
        const { getByText } = render(<Select options={options} />);
        const optionElement = getByText('Option 1');
        expect(optionElement).toBeInTheDocument();
    })

    it('displays the label when provided', () => {
        const { getByText } = render(<Select label="Select an option" options={options} />);
        const labelElement = getByText('Select an option');
        expect(labelElement).toBeInTheDocument();
    })

    it('displays the error message when provided', () => {
        const { getByText } = render(<Select error="This field is required" options={options} />);
        const errorElement = getByText('This field is required');
        expect(errorElement).toBeInTheDocument();
    })
})
