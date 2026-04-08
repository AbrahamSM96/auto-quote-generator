import { render } from '@testing-library/react';

import { Card } from './Card';

describe('Card component', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<Card glass={false}>Card Content</Card>);
        const contentElement = getByText('Card Content');
        expect(contentElement).toBeInTheDocument();
    })

    it('render correctly with glass style', () => {
        const { getByText } = render(<Card glass>Glass Card Content</Card>);
        const contentElement = getByText('Glass Card Content');
        expect(contentElement).toBeInTheDocument();
    })
})
