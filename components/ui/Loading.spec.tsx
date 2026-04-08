import { render } from '@testing-library/react';

import { Loading } from './Loading';

describe('Loading component', () => {
    it('renders without crashing', () => {
        const { container } = render(<Loading />);
        const loadingElement = container.querySelector('.animate-spin');
        expect(loadingElement).toBeInTheDocument();


    })
})
