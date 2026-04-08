import { render } from '@testing-library/react';

import { CardContent } from './CardContent';

describe('CardContent component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<CardContent>Card Content</CardContent>);
        const contentElement = getByText('Card Content');
        expect(contentElement).toBeInTheDocument();
    })
})
