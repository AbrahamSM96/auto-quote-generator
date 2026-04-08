import { render } from '@testing-library/react';

import { Modal } from './Modal';

describe('Modal component', () => {
    it('renders without crashing when open', () => {
        const { getByText } = render(
            <Modal isOpen onClose={() => {}}>
                <p>Modal Content</p>
            </Modal>
        );
        const contentElement = getByText('Modal Content');
        expect(contentElement).toBeInTheDocument();
    })

    it('does not render when closed', () => {
        const { queryByText } = render(
            <Modal isOpen={false} onClose={() => {}}>
                <p>Modal Content</p>
            </Modal>
        );
        const contentElement = queryByText('Modal Content');
        expect(contentElement).toBeNull();
    })
})
