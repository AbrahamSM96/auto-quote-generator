import { render } from '@testing-library/react';

import { CardHeader } from './CardHeader';

describe('CardHeader component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<CardHeader>Card Header</CardHeader>);
        const headerElement = getByText('Card Header');
        expect(headerElement).toBeInTheDocument();
    })
})
