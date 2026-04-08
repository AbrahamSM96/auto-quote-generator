import { render } from '@testing-library/react';

import { CardTitle } from './CardTitle';

describe('CardTitle component', () => {

    it('renders without crashing', () => {
        const { getByText } = render(<CardTitle>Card Title</CardTitle>);
        const titleElement = getByText('Card Title');
        expect(titleElement).toBeInTheDocument();
    })

})
