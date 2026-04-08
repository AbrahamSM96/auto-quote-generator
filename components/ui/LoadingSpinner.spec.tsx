import { render } from '@testing-library/react';

import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders the loading spinner', () => {
        // test the component by className since it has no text content
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
    })
})
